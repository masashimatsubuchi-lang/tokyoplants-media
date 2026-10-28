#!/usr/bin/env node
/**
 * GA4の閲覧数から「よく読まれている記事」と、トップの「人気ランキング（Amazon）」を作り直す。
 * 月1回を目安に実行し、差分を確認してコミットする。
 *
 *   node scripts/update-popular.mjs                 # 直近28日（昨日まで）
 *   node scripts/update-popular.mjs --end 2026-10-27 --days 28
 *   node scripts/update-popular.mjs --dry-run       # 書き出さずに結果だけ表示
 *
 * 書き出すファイル
 *   src/data/popular-articles.json  記事末尾とトップの「よく読まれている記事」（上位30本）
 *   src/data/home-ranking.json      トップの人気ランキング（15位まで）
 *
 * 人気ランキングの並べ方（2026-10-28 オーナーと決定）
 *   その商品を amazonProducts に載せている記事の、期間内の閲覧数の合計。
 *   注文数やクリック数は件数が少なく15位まで意味のある順位にならないため。
 *
 * 載せるのは APPROVED に登録した商品だけ。
 *   当サイトのAmazon選定基準（★3.2以上・レビュー10件以上・出荷元Amazon・在庫あり）は
 *   商品ページを見ないと分からず、curl だとボット判定で弾かれるため自動では確かめられない。
 *   上位に入ったのに未登録の商品は「要確認」として表示するので、内蔵ブラウザで商品ページを確かめ、
 *   基準を満たせば APPROVED に、満たさなければ EXCLUDED に足してから実行し直す。
 *   価格は頻繁に変わるので持たない（カードにも出さない）。
 *
 * 認証: GA4を読めるサービスアカウントのJSONキー。**リポジトリには絶対に置かないこと。**
 *   既定の場所  ~/.config/ga4-mcp/key.json（analytics-mcp と共用）
 *   環境変数    GA4_KEY_FILE=/path/to/key.json
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { createSign } from "node:crypto";
import { homedir } from "node:os";
import { join } from "node:path";
import matter from "gray-matter";

const PROPERTY = "properties/525020490";
const HOST = "media.tokyoplants.com"; // ECが同じプロパティに同居しているので必ず絞る
const KEY_FILE = process.env.GA4_KEY_FILE ?? join(homedir(), ".config", "ga4-mcp", "key.json");
const CATEGORIES = ["guide", "soil", "research", "review", "species"];
const POPULAR_COUNT = 30; // ページ内で既に出している記事を除いても足りるよう多めに持つ
const RANKING_COUNT = 15;

/** トップに載せてよいと確認済みの商品。title はカード用の短い名前（記事の商品名は長いので手で付ける） */
const APPROVED = {
  B0CLD6QSDD: { title: "BRIM FLORA 植物育成ライト 3ヘッド", image: "https://m.media-amazon.com/images/I/81nywh0p0lL._AC_SL500_.jpg" },
  B0B3M47RQJ: { title: "BRIM SOL 植物育成ライト 24W", image: "https://m.media-amazon.com/images/I/71B+1-FFtjL._AC_SL500_.jpg" },
  B0CP4BVWMN: { title: "BRIM PANEL A 植物育成ライト 45W", image: "https://m.media-amazon.com/images/I/71KvklTOC0L._AC_SL500_.jpg" },
  B0CY2VJ3D3: { title: "ジャパン蘭土 圧縮水苔AAA 150g", image: "https://m.media-amazon.com/images/I/61XVL+zGwUL._AC_SL500_.jpg" },
  B0BYYQTM98: { title: "Charming Club モスポール 110cm", image: "https://m.media-amazon.com/images/I/61AcOWOTsxL._AC_SL500_.jpg" },
  B0F1K913VB: { title: "園芸支柱 ココスティック 120cm 太め", image: "https://m.media-amazon.com/images/I/71oTpMWx6gL._AC_SL500_.jpg" },
  B0D7C1LT7M: { title: "BRIM PANEL Y 植物育成ライト 100W", image: "https://m.media-amazon.com/images/I/619wbqYTqKL._AC_SL500_.jpg" },
  B07ZTM6H4H: { title: "ハイポネックス 専用液肥 観葉植物用 450ml", image: "https://m.media-amazon.com/images/I/317m+X7Za-L._AC_SL500_.jpg" },
  B0CG35V5CD: { title: "コルク樹皮 300×400mm（着生用）", image: "https://m.media-amazon.com/images/I/51DbJvUJERL._AC_SL500_.jpg" },
  B0764P7D64: { title: "SUStee 水やりチェッカー Mサイズ", image: "https://m.media-amazon.com/images/I/41hQLomFS-L._AC_SL500_.jpg" },
  B07H9VRZ17: { title: "ドウシシャ ルミナス ノワール ラック 4段", image: "https://m.media-amazon.com/images/I/81eB9ZsSuoL._AC_SL500_.jpg" },
  B009HI1YBU: { title: "タカショー ビニール温室 3段", image: "https://m.media-amazon.com/images/I/71Hyz9Qw1YL._AC_SL500_.jpg" },
  B000FXC3T8: { title: "日清ガーデンメイト 超圧縮水苔 No.500", image: "https://m.media-amazon.com/images/I/71DAj0MPg9L._AC_SL500_.jpg" },
  B09KVC22B5: { title: "チリ産水苔 AA 150g", image: "https://m.media-amazon.com/images/I/51pzw95PcjL._AC_SL500_.jpg" },
  B09DG9KRZ7: { title: "YOUSHY ココスティック 40cm×2本セット", image: "https://m.media-amazon.com/images/I/71zAmMtBNtL._AC_SL500_.jpg" },
};

/** 容量違いなど、同じ商品として1つにまとめるもの（左を右に合算する） */
const MERGE = {
  B000FXH5PK: "B000FXC3T8", // 日清ガーデンメイト 水苔 No.150 → No.500
  B009HI3Z1C: "B009HI1YBU", // タカショー ビニール温室 4段 → 3段
};

/** 載せない商品と理由。選定基準を満たさないもの、I'm original SOIL・HYDRO MINERAL の代わりになる土・培地 */
const EXCLUDED = {
  B0BXPKS4S7: "BARREL NEO AMATERAS 20W｜選定基準未達（レビュー9件）。/items の編集部おすすめには残してよい（オーナー判断）",
  B0BZM6X9GW: "BARREL NEO TSUKUYOMI 20W｜選定基準未達",
  B0DCFSQP9F: "HaruDesign BAR LIGHT L610｜選定基準未達",
  B0D362RR1R: "HaruDesign GL-T5 L530｜選定基準未達",
  B0GMN3XPJC: "GOODGOODS SL-G120P｜選定基準未達",
  B08CXB5KTH: "ITANSE スリット鉢 7号｜選定基準未達",
  B0F58VXYS4: "BIBIPLANTS ビザールプランツラック｜選定基準未達",
  B0DK6W7WXJ: "怪獣モス 圧縮水苔｜選定基準未達",
  B000IAA2F0: "花ごころ さぼてん多肉植物の土｜SOIL・HYDROの代わり",
  B000FXE67U: "プロトリーフ サボテン・多肉植物の土｜SOIL・HYDROの代わり",
  B0DP6ZKD3N: "KINCHO園芸 MYPLANTS ソイル｜SOIL・HYDROの代わり",
  B000IA9ZXU: "花ごころ さし芽種まきの土｜SOIL・HYDROの代わり",
  B0CKF99LL6: "東京寿園 ゼオライト｜SOIL・HYDROの代わり",
  B0H5R9NP5S: "ねこチップ ふわふわEX 5L｜SOIL・HYDROの代わり",
  B0H5RBGZ8C: "ねこチップ Sサイズ 10L｜SOIL・HYDROの代わり",
  B0D8YTWZQV: "ねこチップ Mサイズ 5L｜SOIL・HYDROの代わり",
  B0D8YTS212: "ねこチップ Mサイズ 10L｜SOIL・HYDROの代わり",
  B01EGYYQSC: "ハイドロボール 中粒｜SOIL・HYDROの代わり",
  B000IAA00M: "花ごころ 洋らんバーク｜SOIL・HYDROの代わり",
  B00JUDCR68: "瀬戸ヶ原花苑 パーライト｜SOIL・HYDROの代わり",
  B00GXYFZSO: "プロトリーフ 赤玉土｜SOIL・HYDROの代わり",
  B004OPG0X8: "日向土 小粒｜SOIL・HYDROの代わり",
  B00GTC2NGC: "あかぎ園芸 くん炭｜SOIL・HYDROの代わり",
};

/* ---------- 引数 ---------- */
const args = process.argv.slice(2);
const flag = (n, d) => {
  const i = args.indexOf(n);
  return i === -1 ? d : args[i + 1];
};
const dryRun = args.includes("--dry-run");
const ymd = (d) => d.toISOString().slice(0, 10);
const days = Number(flag("--days", 28));
const endDate = flag("--end", ymd(new Date(Date.now() - 86400000)));
const startDate = ymd(new Date(new Date(endDate).getTime() - (days - 1) * 86400000));

if (!existsSync(KEY_FILE)) {
  console.error(`GA4のサービスアカウントキーが見つかりません:\n  ${KEY_FILE}\nGA4_KEY_FILE=/path/to/key.json で指定してください。`);
  process.exit(1);
}

/* ---------- サービスアカウントでアクセストークンを取る（依存パッケージなし） ---------- */
const b64url = (buf) => Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

async function getAccessToken() {
  const key = JSON.parse(readFileSync(KEY_FILE, "utf8"));
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({
      iss: key.client_email,
      scope: "https://www.googleapis.com/auth/analytics.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  );
  const sig = b64url(createSign("RSA-SHA256").update(`${header}.${claim}`).sign(key.private_key));
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${header}.${claim}.${sig}` }),
  });
  const j = await res.json();
  if (!j.access_token) throw new Error(`トークン取得に失敗: ${JSON.stringify(j)}`);
  return j.access_token;
}

/** pagePath 別の閲覧数。クエリ文字列・末尾スラッシュ違いは合算する */
async function fetchPageViews(token) {
  const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/${PROPERTY}:runReport`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      dimensionFilter: { filter: { fieldName: "hostName", stringFilter: { value: HOST } } },
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 5000,
    }),
  });
  if (!res.ok) throw new Error(`GA4 ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const pv = new Map();
  for (const r of (await res.json()).rows ?? []) {
    const p = r.dimensionValues[0].value.replace(/[?#].*$/, "").replace(/\/$/, "");
    pv.set(p, (pv.get(p) ?? 0) + Number(r.metricValues[0].value));
  }
  return pv;
}

/* ---------- 集計 ---------- */
const token = await getAccessToken();
const pv = await fetchPageViews(token);

const articles = [];
const score = new Map(); // asin → { views, articles, title }
for (const cat of CATEGORIES) {
  for (const f of readdirSync(join("content", cat))) {
    if (!f.endsWith(".md")) continue;
    const slug = `${cat}/${f.replace(/\.md$/, "")}`;
    const views = pv.get(`/${slug}`) ?? 0;
    articles.push({ slug, views });
    const { data } = matter(readFileSync(join("content", cat, f), "utf8"));
    const seen = new Set(); // 同じ記事に同じ商品が2回載っていても1回と数える
    for (const p of data.amazonProducts ?? []) {
      if (!p.asin) continue;
      const asin = MERGE[p.asin] ?? p.asin;
      if (seen.has(asin)) continue;
      seen.add(asin);
      const s = score.get(asin) ?? { asin, views: 0, articles: 0, title: p.title };
      s.views += views;
      if (views) s.articles++;
      score.set(asin, s);
    }
  }
}

const popular = articles
  .filter((a) => a.views > 0)
  .sort((a, b) => b.views - a.views)
  .slice(0, POPULAR_COUNT);

const ranking = [];
const pending = [];
for (const s of [...score.values()].sort((a, b) => b.views - a.views)) {
  if (ranking.length >= RANKING_COUNT) break;
  if (EXCLUDED[s.asin]) continue;
  if (!APPROVED[s.asin]) {
    pending.push(s);
    continue;
  }
  ranking.push({ asin: s.asin, ...APPROVED[s.asin], views: s.views });
}

/* ---------- 出力 ---------- */
console.log(`期間 ${startDate} 〜 ${endDate}\n`);
console.log("よく読まれている記事（上位10）");
for (const a of popular.slice(0, 10)) console.log(`  ${String(a.views).padStart(5)}  ${a.slug}`);
console.log("\n人気ランキング");
ranking.forEach((r, i) => console.log(`  ${String(i + 1).padStart(2)}位 ${String(r.views).padStart(5)}  ${r.asin}  ${r.title}`));
if (pending.length) {
  console.log("\n⚠️ 要確認（上位に入ったが APPROVED にも EXCLUDED にも無い。選定基準を確かめてどちらかに足し、実行し直す）");
  for (const s of pending) console.log(`  ${String(s.views).padStart(5)}  ${s.asin}  ${s.title}  [${s.articles}記事]`);
}

if (dryRun) {
  console.log("\n--dry-run のため書き出していません");
  process.exit(0);
}

const generatedAt = ymd(new Date());
const period = { start: startDate, end: endDate };
writeFileSync(
  "src/data/popular-articles.json",
  JSON.stringify(
    {
      _note: "GA4「tokyoplants｜media」プロパティの表示回数から作成した人気記事リスト。記事末尾とトップの『よく読まれている記事』で使う。scripts/update-popular.mjs で作り直す。",
      period,
      generatedAt,
      items: popular,
    },
    null,
    2,
  ) + "\n",
);
writeFileSync(
  "src/data/home-ranking.json",
  JSON.stringify(
    {
      _note: "トップの人気ランキング。その商品を紹介している記事の閲覧数（GA4）の合計で並べる。scripts/update-popular.mjs で作り直す。",
      period,
      generatedAt,
      items: ranking,
    },
    null,
    2,
  ) + "\n",
);
console.log("\nsrc/data/popular-articles.json と src/data/home-ranking.json を書き出しました");
