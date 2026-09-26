/**
 * 本文に literal な `**` が残っていないかを、実際のMarkdownパイプラインで検出する。
 *
 * CommonMark の強調判定はCJKと相性が悪く、`札幌が**-6.4℃**` のように `**` の直後が
 * 約物だと太字が開かず `**` がそのまま表示される。2026-09-27に124記事246箇所で発覚し、
 * remark-cjk-friendly を導入して解消した（src/lib/posts.ts）。
 * このスクリプトは、プラグインでも救えない書き間違い（`**` の数が奇数など）を拾うための番人。
 *
 *   node scripts/check-markdown-bold.mjs
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkCjkFriendly from "remark-cjk-friendly";
import html from "remark-html";

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".md")) files.push(p);
  }
})("content");
files.sort();

let total = 0;
for (const f of files) {
  const { content } = matter(fs.readFileSync(f, "utf8"));
  const out = String(
    await remark().use(remarkGfm).use(remarkCjkFriendly).use(html, { sanitize: false }).process(content)
  );
  for (const m of out.matchAll(/[^\n]{0,30}\*\*[^\n]{0,30}/g)) {
    console.log(`${f}\n  …${m[0].replace(/\s+/g, " ")}…`);
    total++;
  }
}
console.log(total === 0 ? "OK: 壊れた強調はありません" : `NG: ${total}箇所`);
process.exit(total === 0 ? 0 : 1);
