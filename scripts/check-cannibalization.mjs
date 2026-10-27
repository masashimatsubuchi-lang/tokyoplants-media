#!/usr/bin/env node
/**
 * 記事同士のカニバリ（検索意図の重複）リスクを機械的に洗い出す。
 *
 *   node scripts/check-cannibalization.mjs            # 上位30ペアを表示
 *   node scripts/check-cannibalization.mjs --min 0.5  # しきい値を変える
 *   node scripts/check-cannibalization.mjs --slug guide/monstera-care   # 特定記事と近い記事
 *   node scripts/check-cannibalization.mjs --title "モンステラの冬越し"  # 新規テーマの事前チェック
 *
 * スコアは title + description + tags から作った語の IDF 重み付きコサイン類似度。
 * 「〜属とは｜主な品種・育て方・特徴を解説」のような全記事共通の定型句は
 * IDF でほぼ0になるため、植物名や固有テーマの一致だけが score に効く。
 * 0.45 以上は「同じクエリを奪い合う可能性が高い」ため、
 *   - 役割ナビ（どちらを読むべきか）を両記事の冒頭に置く
 *   - 片方を他方のセクションに統合してリダイレクトする
 *   - タイトル・導入文で対象読者を書き分ける
 * のいずれかで解消すること。新規記事の発注前に --title で必ず確認する。
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const CONTENT = "content";
const STOP = new Set(["観葉植物", "の", "と", "は", "が", "を", "に", "で", "も", "な", "する", "こと", "ため", "方法", "ガイド", "完全", "おすすめ", "解説", "紹介", "선택"]);

function tokens(text) {
  // 日本語は2〜4gram、英数字は単語で切る
  const clean = text.replace(/[｜|、。・（）()【】「」\[\]".,:;!?/]/g, " ").toLowerCase();
  const out = new Set();
  for (const word of clean.split(/\s+/).filter(Boolean)) {
    if (/^[a-z0-9-]+$/.test(word)) { if (word.length > 2) out.add(word); continue; }
    for (let n = 2; n <= 4; n++) {
      for (let i = 0; i + n <= word.length; i++) {
        const g = word.slice(i, i + n);
        if (!STOP.has(g)) out.add(g);
      }
    }
  }
  return out;
}

// IDF: 多くの記事に出る語（定型句）ほど重みを下げる。
// さらに全記事の5%超に出る語（「育て方」「原因と対処法」「〜属とは」等の型）は
// 検索意図の区別に使えないので、類似度の計算から完全に除外する。
let IDF = new Map();
const COMMON_RATIO = 0.05;
function buildIdf(all) {
  const df = new Map();
  for (const p of all) for (const t of p.tok) df.set(t, (df.get(t) ?? 0) + 1);
  const N = all.length;
  const cut = Math.max(3, N * COMMON_RATIO);
  IDF = new Map();
  for (const [t, d] of df) if (d <= cut) IDF.set(t, Math.log(N / d));
  for (const p of all) p.tok = new Set([...p.tok].filter((t) => IDF.has(t)));
}
function weight(t) { return IDF.get(t) ?? 0; }

/**
 * 記事の「主語」＝何について書かれた記事か。主語が違えば、文型がどれだけ
 * 似ていても別クエリなのでカニバらない（「モンステラの育て方」と
 * 「ポトスの育て方」は競合しない）。
 *
 * ⚠️ 以前はタイトル内で最もIDFの高い n-gram を主語に採っていたが、
 * これは日本語では機能しなかった（2026-10-22に発覚）。2〜4文字の n-gram を
 * 総当たりで作るため、最も希少なのは「横幅のあ」「レガレの」「美しい葉」
 * のような無意味な断片になり、主語が一致せずペアが比較前に捨てられていた。
 * 実際、species/anthurium-regale と guide/anthurium-regale-care-guide という
 * 明らかなカニバリを、しきい値0.1まで下げても検出できていなかった。
 *
 * slug は `anthurium-regale` `best-soil-for-anthurium` のように対象が
 * ローマ字で入っており、n-gram のような崩れ方をしない。こちらを主語に使う。
 */
// slug に出てくるが「対象」ではない語。植物名だけを主語として残したいので、
// 症状・作業・用途といった話題語はここで落とす。
// ⚠️ ここが薄いと、別の植物の同テーマ記事（anthurium-root-rot と
// philodendron-root-rot のような組）を「同じ主語」と誤認して誤検出する。
// 新しい型の記事が増えたら、その型を表す語をここに足すこと。
const SLUG_STOP = new Set([
  // 構造・定型
  "best", "soil", "for", "guide", "care", "how", "the", "and", "with", "your",
  "houseplant", "houseplants", "plant", "plants", "genus", "types", "vs",
  "comparison", "review", "complete", "basics", "tips", "list", "science", "species",
  // 症状・トラブル
  "root", "rot", "causes", "recovery", "yellow", "leaves", "leaf", "spots",
  "wilting", "checklist", "problems", "drooping", "brown", "black", "pests",
  "diseases", "damage", "dying",
  // 作業・テーマ
  "propagation", "cutting", "cuttings", "water", "watering", "hydroculture",
  "repotting", "pruning", "fertilizer", "winter", "summer", "light", "humidity",
  "placement", "mounting", "varieties", "catalog", "price", "grow", "mix",
  // 用途・季節
  "gift", "lover", "ideas", "day", "christmas", "birthday", "mothers", "fathers",
]);
function subjectOf(p) {
  const name = p.slug.split("/")[1] ?? "";
  const parts = name.split("-").filter((w) => w.length >= 4 && !SLUG_STOP.has(w));
  return parts.length ? new Set(parts) : null;
}
function sharesSubject(a, b) {
  const sa = a.subject, sb = b.subject;
  if (!sa || !sb) return true; // 判定材料が無いときは落とさない
  for (const w of sa) if (sb.has(w)) return true;
  return false;
}

function similarity(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (const t of a) { const w = weight(t); na += w * w; if (b.has(t)) dot += w * w; }
  for (const t of b) { const w = weight(t); nb += w * w; }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

function frontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const fm = {};
  const title = m[1].match(/^title:\s*"?(.*?)"?\s*$/m);
  const desc = m[1].match(/^description:\s*"?(.*?)"?\s*$/m);
  const tags = [...m[1].matchAll(/^\s+- "?([^"\n]+)"?\s*$/gm)].map((x) => x[1]);
  if (title) fm.title = title[1];
  if (desc) fm.description = desc[1];
  fm.tags = tags;
  return fm;
}

const posts = [];
for (const cat of readdirSync(CONTENT)) {
  let files;
  try { files = readdirSync(join(CONTENT, cat)); } catch { continue; }
  for (const f of files.filter((x) => x.endsWith(".md"))) {
    const raw = readFileSync(join(CONTENT, cat, f), "utf8");
    const fm = frontmatter(raw);
    if (!fm.title) continue;
    posts.push({
      slug: `${cat}/${f.slice(0, -3)}`,
      title: fm.title,
      tok: tokens(`${fm.title} ${fm.description ?? ""} ${(fm.tags ?? []).join(" ")}`),
      titleTok: tokens(fm.title),
    });
  }
}

const args = process.argv.slice(2);
const argOf = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const min = Number(argOf("--min") ?? 0.3);
buildIdf(posts);
for (const p of posts) p.subject = subjectOf(p);
const one = argOf("--slug");
const probe = argOf("--title");

if (probe) {
  const t = new Set([...tokens(probe)].filter((x) => IDF.has(x)));
  const near = posts.map((p) => ({ ...p, s: similarity(t, p.tok) })).sort((a, b) => b.s - a.s).slice(0, 10);
  console.log(`「${probe}」に近い既存記事:\n`);
  for (const p of near) console.log(`  ${p.s.toFixed(2)}  ${p.slug}\n        ${p.title}`);
  process.exit(0);
}

const pairs = [];
for (let i = 0; i < posts.length; i++) {
  for (let j = i + 1; j < posts.length; j++) {
    if (one && posts[i].slug !== one && posts[j].slug !== one) continue;
    if (!sharesSubject(posts[i], posts[j])) continue; // 主語が違う＝別クエリ
    const s = similarity(posts[i].tok, posts[j].tok);
    if (s >= min) pairs.push({ s, a: posts[i], b: posts[j] });
  }
}
pairs.sort((x, y) => y.s - x.s);

console.log(`記事数 ${posts.length} / しきい値 ${min} / 該当ペア ${pairs.length}\n`);
for (const { s, a, b } of pairs.slice(0, Number(argOf("--limit") ?? 30))) {
  console.log(`${s.toFixed(2)}  ${a.slug}\n      ${b.slug}`);
  console.log(`      A: ${a.title}`);
  console.log(`      B: ${b.title}\n`);
}
