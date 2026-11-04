#!/usr/bin/env node
/**
 * IndexNow で Bing などに「このページが変わった」と知らせる（2026-11-04 導入。ChatGPT の検索は Bing の索引を土台にしているとされるため）。
 *
 *   node scripts/indexnow.mjs <変更前のコミット> <変更後のコミット>   # その間に変わった記事などを送る（公開されてから実行する）
 *   node scripts/indexnow.mjs --url https://media.tokyoplants.com/items  # 指定した URL だけ送る
 *   どちらも --dry-run を付けると送らずに表示だけする
 *
 * 鍵は public/<鍵>.txt（中身も鍵）。鍵を変えるときはファイル名と中身と KEY をそろえる。
 * 自動化する GitHub Actions（push のたびに公開を待って実行）は、push に workflow 権限が要るため未導入（2026-11-04）。
 * 送るのは本番 https://media.tokyoplants.com の URL だけ。消えた記事の URL も送る（Bing が 404 を確かめに来る）。
 */
import { execFileSync } from "node:child_process";

const HOST = "media.tokyoplants.com";
const KEY = "fb2acb0bc6c5d857a080cb69bc3645ce";
const dry = process.argv.includes("--dry-run");
const args = process.argv.slice(2).filter((a) => a !== "--dry-run");

// リポジトリ内のパス → 公開 URL。記事以外で中身が変わると AI に読まれたいページもここで対応づける
function urlFor(path) {
  const m = path.match(/^content\/(guide|soil|research|review|species)\/([^/]+)\.md$/);
  if (m) return `https://${HOST}/${m[1]}/${m[2]}`;
  if (path === "public/llms.txt") return `https://${HOST}/llms.txt`;
  if (path.startsWith("src/app/items/") || path === "src/lib/recommendedItems.ts") return `https://${HOST}/items`;
  if (path.startsWith("src/app/about/")) return `https://${HOST}/about`;
  return null;
}

let urls = [];
if (args[0] === "--url") {
  urls = args.slice(1);
} else if (args.length === 2) {
  const out = execFileSync("git", ["diff", "--name-only", args[0], args[1]], { encoding: "utf8" });
  urls = out.split("\n").filter(Boolean).map(urlFor).filter(Boolean);
} else {
  console.error("使い方: node scripts/indexnow.mjs <前のコミット> <後のコミット> | --url <URL>...  [--dry-run]");
  process.exit(1);
}
urls = [...new Set(urls)].filter((u) => new URL(u).host === HOST).slice(0, 10000);
if (!urls.length) {
  console.log("送る URL はありません");
  process.exit(0);
}
console.log(`${dry ? "（送らない）" : ""}IndexNow に ${urls.length} 件:\n${urls.join("\n")}`);
if (dry) process.exit(0);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
// 200 と 202 が受付。それ以外は理由を出して失敗にする
console.log(`応答: ${res.status}`);
if (res.status !== 200 && res.status !== 202) {
  console.error(await res.text());
  process.exit(1);
}
