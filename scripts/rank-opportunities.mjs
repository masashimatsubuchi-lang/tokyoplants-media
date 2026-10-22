#!/usr/bin/env node
/**
 * 「表示はあるのに順位が中位で止まっているクエリ」を、記事ごとに束ねて
 * リライトの優先順位を出す。
 *
 *   node scripts/gsc-queries.mjs --dim query,page --days 28 --limit 5000 --tsv qp.tsv
 *   node scripts/rank-opportunities.mjs qp.tsv
 *
 * 見込みクリック増 = 表示 × (目標順位のCTR − 現在のCTR)
 * 目標順位は「今より3つ上、ただし3位まで」とした。1位を仮定すると過大評価になる。
 * CTRカーブは順位別の実測値（このサイトの直近28日データから算出）を使う。
 *
 * ⚠️ これは「どこを見るか」の当たりをつけるための推定であって、約束された数字ではない。
 * 実際に上がるかは競合ページの強さ次第で、ここでは測れない。
 */
import { readFileSync } from "node:fs";

const file = process.argv[2];
if (!file) { console.error("使い方: node scripts/rank-opportunities.mjs qp.tsv"); process.exit(1); }

const rows = readFileSync(file, "utf8").split("\n").slice(1).filter(Boolean).map((l) => {
  const [key, clicks, impr, ctr, pos] = l.split("\t");
  const [query, page] = key.split(" / ");
  return { query, page: (page ?? "").replace("https://media.tokyoplants.com", ""),
           clicks: +clicks, impr: +impr, ctr: +ctr / 100, pos: +pos };
}).filter((r) => r.page);

// 順位別の実測CTRカーブを自前データから作る（外部の一般論を使わない）
const bucket = new Map();
for (const r of rows) {
  const p = Math.min(Math.round(r.pos), 30);
  const b = bucket.get(p) ?? { c: 0, i: 0 };
  b.c += r.clicks; b.i += r.impr; bucket.set(p, b);
}
const curve = new Map();
for (const [p, b] of bucket) if (b.i >= 100) curve.set(p, b.c / b.i);
// 実測カーブはサンプルが少ない順位で上下する（3位7.9% < 4位9.3% のように逆転する）。
// そのままだと「順位を上げると見込みが減る」というおかしな推定になるため、
// 上位ほどCTRが高いという制約だけをかけて単調化する。
{
  const ks = [...curve.keys()].sort((a, b) => a - b);
  let floor = Infinity;
  for (const k of ks) { floor = Math.min(floor, curve.get(k)); curve.set(k, floor); }
}
const ctrAt = (p) => {
  const k = Math.max(1, Math.min(30, Math.round(p)));
  for (let d = 0; d < 30; d++) {
    if (curve.has(k - d)) return curve.get(k - d);
    if (curve.has(k + d)) return curve.get(k + d);
  }
  return 0.01;
};

// 中位（6〜20位）× 表示100回以上 が対象
const cand = rows.filter((r) => r.pos >= 5.5 && r.pos <= 20 && r.impr >= 100);
const byPage = new Map();
for (const r of cand) {
  const target = Math.max(3, r.pos - 3);
  const gain = r.impr * Math.max(0, ctrAt(target) - r.ctr);
  const a = byPage.get(r.page) ?? { page: r.page, gain: 0, impr: 0, clicks: 0, qs: [] };
  a.gain += gain; a.impr += r.impr; a.clicks += r.clicks; a.qs.push({ ...r, gain });
  byPage.set(r.page, a);
}

console.log("順位別CTR（自サイト実測）:");
console.log("  " + [1,2,3,4,5,6,8,10,15,20].filter(p=>curve.has(p)).map(p=>`${p}位 ${(curve.get(p)*100).toFixed(1)}%`).join(" / "));
console.log(`\n対象クエリ ${cand.length}件 / 記事 ${byPage.size}本\n`);
console.log("=".repeat(76));

const top = [...byPage.values()].sort((a, b) => b.gain - a.gain).slice(0, 20);
for (const [i, p] of top.entries()) {
  console.log(`\n${i + 1}. ${p.page}`);
  console.log(`   見込み +${Math.round(p.gain)}クリック/28日   現状 ${p.clicks}クリック / ${p.impr}表示`);
  for (const q of p.qs.sort((a, b) => b.gain - a.gain).slice(0, 4))
    console.log(`     ${q.pos.toFixed(1)}位  表示${String(q.impr).padStart(5)}  CTR${(q.ctr*100).toFixed(1)}%  +${Math.round(q.gain)}  「${q.query}」`);
}
console.log(`\n上位20本の見込み合計: +${Math.round(top.reduce((s,p)=>s+p.gain,0))}クリック/28日`);
