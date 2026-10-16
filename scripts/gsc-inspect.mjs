#!/usr/bin/env node
/**
 * Search Console の URL Inspection API で、URLの実際のインデックス状態を問い合わせる。
 *
 *   node scripts/gsc-inspect.mjs urls.txt          # 1行1URLのファイル
 *   node scripts/gsc-inspect.mjs urls.txt --tsv out.tsv
 *
 * 「検索実績がない＝インデックス未登録」ではない（単に順位が低いだけのこともある）ため、
 * 推測せずここで確定させる。1日2000URLまで（APIの上限）。
 *
 * 認証は scripts/gsc-queries.mjs と同じサービスアカウント。
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createSign } from "node:crypto";
import { homedir } from "node:os";
import { join } from "node:path";

const SITE = process.env.GSC_SITE ?? "https://media.tokyoplants.com/";
const KEY_FILE =
  process.env.GSC_KEY_FILE ?? join(homedir(), ".config", "tokyoplants", "gsc-service-account.json");

const args = process.argv.slice(2);
const listFile = args.find((a) => !a.startsWith("--"));
const tsvPath = args.includes("--tsv") ? args[args.indexOf("--tsv") + 1] : null;
if (!listFile || !existsSync(listFile)) {
  console.error("1行1URLのファイルを渡してください。例: node scripts/gsc-inspect.mjs urls.txt");
  process.exit(1);
}

const b64url = (b) =>
  Buffer.from(b).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

async function getAccessToken() {
  const key = JSON.parse(readFileSync(KEY_FILE, "utf8"));
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({
      iss: key.client_email,
      scope: "https://www.googleapis.com/auth/webmasters.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  );
  const sig = b64url(createSign("RSA-SHA256").update(`${header}.${claim}`).sign(key.private_key));
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claim}.${sig}`,
    }),
  });
  const j = await res.json();
  if (!j.access_token) throw new Error(`トークン取得に失敗: ${JSON.stringify(j)}`);
  return j.access_token;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const token = await getAccessToken();
const urls = readFileSync(listFile, "utf8").split("\n").map((s) => s.trim()).filter(Boolean);
console.log(`${urls.length} URL を照会します\n`);

const rows = [];
for (let i = 0; i < urls.length; i++) {
  const url = urls[i];
  let r;
  try {
    const res = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE, languageCode: "ja" }),
    });
    if (!res.ok) {
      const t = await res.text();
      r = { verdict: `HTTP${res.status}`, coverage: t.slice(0, 120) };
    } else {
      const j = await res.json();
      const s = j.inspectionResult?.indexStatusResult ?? {};
      r = {
        verdict: s.verdict ?? "-",
        coverage: s.coverageState ?? "-",
        robots: s.robotsTxtState ?? "-",
        indexing: s.indexingState ?? "-",
        canonical: s.googleCanonical && s.googleCanonical !== url ? s.googleCanonical : "",
        lastCrawl: (s.lastCrawlTime ?? "").slice(0, 10),
      };
    }
  } catch (e) {
    r = { verdict: "ERROR", coverage: String(e).slice(0, 100) };
  }
  rows.push({ url, ...r });
  const path = url.replace(SITE.replace(/\/$/, ""), "");
  console.log(`[${i + 1}/${urls.length}] ${r.verdict.padEnd(12)} ${(r.coverage ?? "").slice(0, 46).padEnd(48)} ${path}`);
  await sleep(600);
}

console.log("\n=== coverageState 別の件数 ===");
const by = new Map();
for (const r of rows) by.set(r.coverage, (by.get(r.coverage) ?? 0) + 1);
for (const [k, v] of [...by].sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(3)}  ${k}`);

if (tsvPath) {
  writeFileSync(
    tsvPath,
    ["url\tverdict\tcoverage\trobots\tindexing\tgoogleCanonical\tlastCrawl", ...rows.map((r) =>
      [r.url, r.verdict, r.coverage, r.robots ?? "", r.indexing ?? "", r.canonical ?? "", r.lastCrawl ?? ""].join("\t")
    )].join("\n"),
    "utf8"
  );
  console.log(`\n${tsvPath} に保存しました。`);
}
