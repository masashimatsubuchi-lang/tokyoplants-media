#!/usr/bin/env node
/**
 * amazonProducts の商品画像が実際に表示されるかを確認する。
 *
 *   node scripts/check-amazon-images.mjs
 *
 * `AmazonAffiliateBlock` は image 未指定のとき
 * `https://m.media-amazon.com/images/P/{ASIN}.01._SL200_.jpg` を使うが、
 * 商品によってはこのURLが**1x1の透明GIF**を返し、カードの画像が空白になる
 * （2026-09-26、サイト最大流入のねこチップ記事で発覚。全250 ASIN中 約1割）。
 *
 * 空だったASINは、商品ページの `"hiRes":"https://m.media-amazon.com/images/I/{ID}..."`
 * から実画像IDを取り出し、frontmatter に
 *   image: "https://m.media-amazon.com/images/I/{ID}._AC_SL200_.jpg"
 * を書いて修正する（image があればそちらが優先される）。
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const found = new Map(); // asin -> Set<file>
for (const cat of readdirSync("content")) {
  let files;
  try { files = readdirSync(join("content", cat)); } catch { continue; }
  for (const f of files.filter((x) => x.endsWith(".md"))) {
    const raw = readFileSync(join("content", cat, f), "utf8");
    const fm = raw.match(/^---\n([\s\S]*?)\n---/);
    if (!fm) continue;
    // image が明示されているブロックは対象外
    for (const block of fm[1].split(/\n  - /).slice(1)) {
      const asin = block.match(/asin:\s*"([A-Z0-9]{10})"/)?.[1];
      if (!asin || /image:\s*"/.test(block)) continue;
      if (!found.has(asin)) found.set(asin, new Set());
      found.get(asin).add(`${cat}/${f.slice(0, -3)}`);
    }
  }
}

const asins = [...found.keys()];
console.log(`image 未指定の ASIN: ${asins.length} 件を確認します…\n`);

const blanks = [];
const CONCURRENCY = 8;
let i = 0;
async function worker() {
  while (i < asins.length) {
    const asin = asins[i++];
    try {
      const res = await fetch(`https://m.media-amazon.com/images/P/${asin}.01._SL200_.jpg`);
      const buf = await res.arrayBuffer();
      if (buf.byteLength < 200) blanks.push(asin);
    } catch { /* ネットワーク失敗は無視 */ }
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

if (blanks.length === 0) {
  console.log("空画像のASINはありません。");
} else {
  console.log(`⚠ 画像が空（1x1）になる ASIN: ${blanks.length} 件\n`);
  for (const a of blanks) {
    console.log(`  ${a}  https://www.amazon.co.jp/dp/${a}`);
    for (const f of found.get(a)) console.log(`        ${f}`);
  }
  console.log("\n各商品ページから hiRes の画像IDを取り、frontmatter に image を追記してください。");
}
