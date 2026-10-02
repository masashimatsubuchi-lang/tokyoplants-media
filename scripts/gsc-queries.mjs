#!/usr/bin/env node
/**
 * Search Console の検索クエリを直接取得する。
 *
 *   node scripts/gsc-queries.mjs                        # 直近28日のクエリ上位200件
 *   node scripts/gsc-queries.mjs --days 90 --limit 500
 *   node scripts/gsc-queries.mjs --dim page             # ページ別
 *   node scripts/gsc-queries.mjs --dim query,page       # クエリ×ページ
 *   node scripts/gsc-queries.mjs --compare              # 前期間と比較して順位の変動を出す
 *   node scripts/gsc-queries.mjs --tsv out.tsv          # TSVに保存
 *
 * 認証: サービスアカウントのJSONキー。**リポジトリには絶対に置かないこと。**
 *   既定の場所  ~/.config/tokyoplants/gsc-service-account.json
 *   環境変数    GSC_KEY_FILE=/path/to/key.json
 *
 * セットアップ（オーナー作業）は scripts/README-gsc.md を参照。
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createSign } from "node:crypto";
import { homedir } from "node:os";
import { join } from "node:path";

const SITE = process.env.GSC_SITE ?? "https://media.tokyoplants.com/";
const KEY_FILE =
  process.env.GSC_KEY_FILE ?? join(homedir(), ".config", "tokyoplants", "gsc-service-account.json");
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

const args = process.argv.slice(2);
const flag = (n, d) => {
  const i = args.indexOf(n);
  return i === -1 ? d : args[i + 1];
};
const days = Number(flag("--days", 28));
const limit = Number(flag("--limit", 200));
const dimensions = flag("--dim", "query").split(",");
const compare = args.includes("--compare");
const tsvPath = flag("--tsv", null);

if (!existsSync(KEY_FILE)) {
  console.error(
    `サービスアカウントのキーが見つかりません:\n  ${KEY_FILE}\n\n` +
      `セットアップ手順は scripts/README-gsc.md を参照してください。\n` +
      `別の場所に置いた場合は GSC_KEY_FILE=/path/to/key.json を指定してください。`
  );
  process.exit(1);
}

/* ---------- サービスアカウントでアクセストークンを取る（依存パッケージなし） ---------- */
const b64url = (buf) =>
  Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

async function getAccessToken() {
  const key = JSON.parse(readFileSync(KEY_FILE, "utf8"));
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({
      iss: key.client_email,
      scope: SCOPE,
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

/* ---------- Search Analytics ---------- */
const ymd = (d) => d.toISOString().slice(0, 10);
function range(endOffset, len) {
  // GSCのデータは2〜3日遅れるので、終端を3日前に置く
  const end = new Date(Date.now() - (3 + endOffset) * 86400000);
  const start = new Date(end.getTime() - (len - 1) * 86400000);
  return { startDate: ymd(start), endDate: ymd(end) };
}

async function query(token, period) {
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ...period, dimensions, rowLimit: limit, type: "web", dataState: "final" }),
    }
  );
  if (!res.ok) {
    const t = await res.text();
    if (res.status === 403)
      throw new Error(
        `403: サービスアカウントがSearch Consoleのプロパティに追加されていない可能性があります。\n` +
          `  対象プロパティ: ${SITE}\n  詳細: ${t.slice(0, 300)}`
      );
    throw new Error(`${res.status}: ${t.slice(0, 300)}`);
  }
  return (await res.json()).rows ?? [];
}

const token = await getAccessToken();
const cur = range(0, days);
const rows = await query(token, cur);
console.log(`${SITE}  ${cur.startDate} 〜 ${cur.endDate}（${days}日間）  ${rows.length}件\n`);

let prev = new Map();
if (compare) {
  const p = range(days, days);
  for (const r of await query(token, p)) prev.set(r.keys.join(" / "), r);
  console.log(`比較対象: ${p.startDate} 〜 ${p.endDate}\n`);
}

const fmt = (n) => n.toFixed(1);
const out = [];
const head = compare
  ? ["キー", "クリック", "表示", "CTR%", "順位", "順位変動", "クリック差"]
  : ["キー", "クリック", "表示", "CTR%", "順位"];
console.log(head.join("\t"));

for (const r of rows) {
  const k = r.keys.join(" / ");
  const base = [k, r.clicks, r.impressions, fmt(r.ctr * 100), fmt(r.position)];
  if (compare) {
    const p = prev.get(k);
    // 順位は小さいほど良いので、改善をプラスで出す
    const dPos = p ? fmt(p.position - r.position) : "—";
    const dClick = p ? r.clicks - p.clicks : "new";
    base.push(dPos, dClick);
  }
  console.log(base.join("\t"));
  out.push(base);
}

const tot = rows.reduce((a, r) => ({ c: a.c + r.clicks, i: a.i + r.impressions }), { c: 0, i: 0 });
console.log(
  `\n合計 クリック ${tot.c} / 表示 ${tot.i} / CTR ${fmt((tot.c / Math.max(tot.i, 1)) * 100)}%`
);

if (tsvPath) {
  writeFileSync(tsvPath, [head, ...out].map((r) => r.join("\t")).join("\n"), "utf8");
  console.log(`${tsvPath} に保存しました。`);
}
