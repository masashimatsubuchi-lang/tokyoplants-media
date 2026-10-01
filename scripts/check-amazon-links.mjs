#!/usr/bin/env node
/**
 * content 配下の Amazon アソシエイトリンクが、今も「紹介してよい状態」かを確認する。
 *
 *   node scripts/check-amazon-links.mjs                 # 参照の多い順に50件（月次向け・数分）
 *   node scripts/check-amazon-links.mjs --all           # 全ASIN（四半期向け・自動で分割＆休憩）
 *   node scripts/check-amazon-links.mjs --offset 80 --limit 80
 *   node scripts/check-amazon-links.mjs --json out.tsv  # 結果をTSVでも保存
 *
 * 見ているもの（Amazon商品選定基準に対応）
 *   OUT        在庫切れ／取り扱い終了
 *   NO_BUYBOX  カートボタンが無い（マーケットプレイス出品のみ＝Prime対象外・別途送料）
 *   NOT_PRIME  出荷元がAmazonではない
 *   LOW_STAR   ★3.2未満
 *   FEW_REVIEW レビュー10件未満
 *   REDIRECT   別ASINのページに転送される（記事の説明と違う商品に着地する）
 *   PRICE_DIFF frontmatter の price と実売price が1割以上ずれている
 *
 * ⚠️ ボット判定について（2026-10-01の全件監査で判明）
 * Amazonは連続90〜100件あたりで、3〜4KBの「ショッピングを続ける」中間ページを
 * 200で返すようになる。これを「商品が無い」と解釈すると大量の誤判定になる
 * （実際に168/273件を誤って"死んでいる"と判定しかけた）。
 * このスクリプトは中間ページを BLOCKED として明示し、**絶対にOUTとは報告しない**。
 * BLOCKED が出たらそこで打ち切り、時間を置いて --offset で続きから回すこと。
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";
const MIN_STAR = 3.2;
const MIN_REVIEWS = 10;
const CHUNK = 80; // この件数ごとに休憩を挟む
const COOLDOWN_MS = 10 * 60 * 1000;

const args = process.argv.slice(2);
const flag = (n, d) => {
  const i = args.indexOf(n);
  return i === -1 ? d : args[i + 1];
};
const wantAll = args.includes("--all");
const outPath = flag("--json", null);

/* ---------- 1. content から ASIN を集める（frontmatter と本文リンクの両方） ---------- */
const refs = new Map(); // asin -> { files:Set, price:string|null }
function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".md")) scan(p);
  }
}
function scan(file) {
  const src = readFileSync(file, "utf8");
  const rel = file.replace(/^content\//, "").replace(/\.md$/, "");
  const add = (asin, price) => {
    if (!refs.has(asin)) refs.set(asin, { files: new Set(), price: null });
    const r = refs.get(asin);
    r.files.add(rel);
    if (price && !r.price) r.price = price;
  };
  // frontmatter: asin: "XXXX" の直後に続く price: "¥1,234" を拾う
  const fm = src.split(/\n---\n/)[0] ?? "";
  for (const blk of fm.split(/^(?=\s*- title:)/m)) {
    const a = blk.match(/^\s*asin:\s*"?([A-Z0-9]{10})"?/m);
    if (!a) continue;
    const pr = blk.match(/^\s*price:\s*"([^"]*)"/m);
    add(a[1], pr ? pr[1] : null);
  }
  // 本文のインラインリンク
  for (const m of src.matchAll(/amazon\.co\.jp\/dp\/([A-Z0-9]{10})/g)) add(m[1], null);
}
walk("content");

let list = [...refs.entries()].sort((a, b) => b[1].files.size - a[1].files.size);
const offset = Number(flag("--offset", 0));
const limit = Number(flag("--limit", wantAll ? list.length : 50));
list = list.slice(offset, offset + limit);

console.log(
  `対象 ${list.length} ASIN（全${refs.size}件中 ${offset + 1}〜${offset + list.length}番目・参照の多い順）\n`
);

/* ---------- 2. 1件ずつ確認 ---------- */
const text = (html, re) => {
  const m = html.match(re);
  return m ? m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : "";
};
/**
 * id="..." の中身を読む。
 * ⚠️ `<div id="x">([\s\S]*?)</div>` と書いてはいけない。Amazonのブロックは入れ子に
 * なっているので最初の閉じタグで切れてしまい、肝心の文字列を取り逃す
 * （この書き方で「出荷元Amazon」を読めず、正常な商品を一斉に NOT_PRIME と
 * 誤判定した）。固定長の窓で切り出してから中を探す。
 */
const blockText = (html, id, win = 2500) => {
  const i = html.indexOf(`id="${id}"`);
  if (i === -1) return "";
  const start = html.indexOf(">", i); // 属性を飛ばして中身から読む
  if (start === -1) return "";
  return html
    .slice(start + 1, start + 1 + win)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchPage(asin) {
  const res = await fetch(`https://www.amazon.co.jp/dp/${asin}`, {
    headers: { "User-Agent": UA, "Accept-Language": "ja-JP,ja;q=0.9" },
    redirect: "follow",
  });
  return { html: await res.text(), url: res.url };
}

function judge(asin, html, url, known) {
  // ボット判定の中間ページ。商品ページは必ず数百KB以上ある
  if (html.length < 200_000 || /errors_page\/validateCaptcha/.test(html))
    return { state: "BLOCKED" };

  const title = text(html, /<span id="productTitle"[^>]*>([\s\S]*?)<\/span>/);
  if (!title) return { state: "BLOCKED" };

  const landed = url.match(/\/dp\/([A-Z0-9]{10})/)?.[1] ?? asin;
  const avail = blockText(html, "availability", 400);
  const cart = html.includes('id="add-to-cart-button"');
  /**
   * 出荷元の表示は2通りある。両方見ないと誤判定する。
   *   A) 分離型: fulfillerInfo に「出荷元 Amazon」／merchantInfo に「販売元 ◯◯」
   *   B) 統合型: merchantInfo に「出荷元 / 販売元 Amazon.co.jp」（fulfillerInfo は空）
   * fulfillerInfo だけを見ていた版では、B型の商品（Amazon直販）を軒並み
   * NOT_PRIME と誤判定した。
   */
  const fulfiller = blockText(html, "fulfillerInfoFeature_feature_div", 1200);
  const merchant = blockText(html, "merchantInfoFeature_feature_div", 1200);
  const shipsFrom = [fulfiller, merchant].filter(Boolean).join(" / ");
  const byAmazon = /出荷元[^。]{0,24}Amazon/.test(shipsFrom);
  // 定期おトク便の5%引きを拾わないよう corePrice を優先する
  const price =
    text(html, /id="corePrice_feature_div"[\s\S]*?class="a-offscreen">(￥[\d,]+)/) ||
    text(html, /class="a-offscreen">(￥[\d,]+)/);
  const star = Number(html.match(/<span id="acrPopover"[^>]*title="([\d.]+)/)?.[1] ?? NaN);
  const reviews = Number(
    (html.match(/id="acrCustomerReviewText"[^>]*>\s*\(?([\d,]+)/)?.[1] ?? "").replace(/,/g, "")
  );

  const issues = [];
  if (/在庫切れ|お取り扱いできません/.test(avail)) issues.push("OUT");
  else if (!cart && !shipsFrom) issues.push("NO_BUYBOX");
  else if (shipsFrom && !byAmazon) issues.push("NOT_PRIME");
  if (landed !== asin) issues.push(`REDIRECT→${landed}`);
  if (Number.isFinite(star) && star < MIN_STAR) issues.push(`LOW_STAR(${star})`);
  if (Number.isFinite(reviews) && reviews < MIN_REVIEWS) issues.push(`FEW_REVIEW(${reviews})`);
  // カートが無い商品は「買える価格」が存在せず、ページに残った別要素の数字を
  // 拾ってしまうので価格比較はしない（NO_BUYBOX の指摘だけで十分）
  if (known.price && price && !issues.includes("NO_BUYBOX")) {
    const a = Number(known.price.replace(/[^\d]/g, ""));
    const b = Number(price.replace(/[^\d]/g, ""));
    if (a && b && Math.abs(a - b) / b >= 0.1) issues.push(`PRICE_DIFF(記事${known.price}→実${price})`);
  }
  return { state: issues.length ? issues.join(" ") : "OK", title, price, star, reviews, avail };
}

const rows = [];
let blocked = 0;
for (let i = 0; i < list.length; i++) {
  const [asin, known] = list[i];
  if (i > 0 && i % CHUNK === 0) {
    console.log(`\n--- ${i}件完了。ボット判定を避けるため ${COOLDOWN_MS / 60000} 分休憩 ---\n`);
    await sleep(COOLDOWN_MS);
  }
  let r;
  try {
    const { html, url } = await fetchPage(asin);
    r = judge(asin, html, url, known);
  } catch (e) {
    r = { state: `ERROR(${e.name})` };
  }
  if (r.state === "BLOCKED") {
    blocked++;
    if (blocked >= 3) {
      console.log(
        `\n⛔ Amazonのボット判定に入りました（${i}件目）。ここで打ち切ります。\n` +
          `   しばらく空けて  node scripts/check-amazon-links.mjs --offset ${offset + i} --limit ${limit - i}  で続きから。\n`
      );
      break;
    }
  } else blocked = 0;

  rows.push({ asin, ...r, files: [...known.files] });
  if (r.state !== "OK") {
    console.log(`⚠ ${asin}  ${r.state}`);
    console.log(`    ${(r.title ?? "").slice(0, 52)}`);
    for (const f of known.files) console.log(`    └ ${f}`);
  }
  await sleep(1500 + Math.random() * 1500);
}

/* ---------- 3. まとめ ---------- */
const bad = rows.filter((r) => r.state !== "OK" && r.state !== "BLOCKED");
console.log(`\n${"=".repeat(52)}`);
console.log(`確認 ${rows.length} 件 / 要対応 ${bad.length} 件`);
if (!bad.length) console.log("基準を満たさない商品はありません。");
console.log(
  `\n直すときは「在庫切れだから機械的に差し替える」ではなく、記事がその商品に`
);
console.log(`期待している役割（容量・pH調整の有無・価格帯など）に合うかを必ず確認すること。`);

if (outPath) {
  writeFileSync(
    outPath,
    rows.map((r) => [r.asin, r.state, r.price ?? "", r.title ?? "", r.files.join(",")].join("\t")).join("\n"),
    "utf8"
  );
  console.log(`\n${outPath} に保存しました。`);
}
process.exit(bad.length ? 1 : 0);
