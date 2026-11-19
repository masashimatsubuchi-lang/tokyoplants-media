#!/usr/bin/env node
/**
 * 観葉植物の通販比較（review/houseplant-online-shop-comparison）の価格・在庫を更新する（2026-11-19）。
 * データ: src/data/shop-comparison.json ／ 表示: src/components/ShopCompare.tsx
 *
 *   node scripts/update-shop-comparison.mjs            # 取得して JSON を更新
 *   node scripts/update-shop-comparison.mjs --dry-run  # 取得するが書き込まない
 *
 * 取得元
 *   - rakuten: 楽天市場商品検索API。アプリIDは環境変数 RAKUTEN_APP_ID か ~/.config/rakuten-api/app_id
 *     （リポジトリには置かない）。IDが無いあいだは何もしない
 *   - AND PLANTS 等の自社EC: 取得しない。AND PLANTS は商品ページ・商品JSONへの機械的なアクセスを
 *     429（local_rate_limited）で一貫して断っている（2026-11-19確認）。断られている取得はかいくぐらず、
 *     月1回ブラウザで手動確認する（source.type は manual）
 *   - amazon: 価格を表示しないので取得しない
 *   - manual / yahoo: 取得しない（月1回の手動確認。manualCheckedAt）
 *
 * 安全装置
 *   - 価格が前回から40%以上動いたら上書きせず needsReview を立てる（変種の取り違え・セール等を人が確認）
 *   - 取得に失敗したら failCount を増やし、3回続くと表示側で順位外に回す
 *   - 価格・在庫・確認待ちが変わらず、前回の更新から6日以内なら書き込まない（毎日の無駄なデプロイを避ける）
 * 相手サイトへの負担を避けるため、1件ごとに3秒あける。
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FILE = join(ROOT, "src/data/shop-comparison.json");
const DRY = process.argv.includes("--dry-run");
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";
const RAKUTEN_ID_FILE = join(homedir(), ".config/rakuten-api/app_id");
const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID || (existsSync(RAKUTEN_ID_FILE) ? readFileSync(RAKUTEN_ID_FILE, "utf8").trim() : "");
const JUMP = 0.4;
const STALE_DAYS = 6;
// 連続失敗回数は公開データに書かない日もあるので、この Mac の中に別に持つ（変化のない日はデプロイしないため）
const STATE = process.env.SHOP_COMPARE_STATE || join(homedir(), ".cache/tokyoplants/shop-comparison-state.json");
const state = existsSync(STATE) ? JSON.parse(readFileSync(STATE, "utf8")) : {};

const today = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10); // JST
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/** @returns {Promise<{price:number, inStock:boolean, variantId?:number}>} */
async function fetchShopify(item) {
  const { host, handle, variantId } = item.source;
  const p = await getJson(`https://${host}/products/${handle}.js`);
  let v = variantId ? p.variants.find((x) => x.id === variantId) : null;
  if (!v && p.variants.length === 1) v = p.variants[0];
  if (!v) v = p.variants.find((x) => Math.round(x.price / 100) === item.price);
  if (!v) throw new Error(`変種を特定できない（${p.variants.map((x) => `${x.title}:${x.price / 100}`).join(", ")}）`);
  return { price: Math.round(v.price / 100), inStock: !!v.available, variantId: v.id };
}

async function fetchRakuten(item) {
  const url =
    "https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601?format=json&formatVersion=2" +
    `&applicationId=${encodeURIComponent(RAKUTEN_APP_ID)}&itemCode=${encodeURIComponent(item.source.itemCode)}`;
  const d = await getJson(url);
  const it = d.Items?.[0];
  if (!it) throw new Error("該当商品なし（販売終了の可能性）");
  return { price: Number(it.itemPrice), inStock: Number(it.availability) === 1 };
}

const FETCHERS = {
  // shopify: fetchShopify, // 相手が断っているので使わない（上の説明）。許可を得た店ができたら source.type を shopify に
  rakuten: RAKUTEN_APP_ID ? fetchRakuten : null,
};
if (!RAKUTEN_APP_ID) console.log("楽天のアプリIDが無いので、楽天は取得しない");

const db = JSON.parse(readFileSync(FILE, "utf8"));
let material = false;
const log = [];

for (const [tid, table] of Object.entries(db.tables)) {
  for (const item of table.items) {
    const fetcher = FETCHERS[item.source.type];
    if (!fetcher) continue;
    try {
      const r = await fetcher(item);
      if (r.variantId && item.source.variantId !== r.variantId) item.source.variantId = r.variantId;
      const jump = Math.abs(r.price - item.price) / item.price;
      if (r.price !== item.price && jump >= JUMP) {
        const msg = `価格が${item.price}円→${r.price}円に変わった（${Math.round(jump * 100)}%）`;
        if (item.needsReview !== msg) material = true;
        item.needsReview = msg;
        log.push(`要確認 ${tid} ${item.seller}: ${msg}`);
      } else {
        if (r.price !== item.price) {
          log.push(`価格 ${tid} ${item.seller}: ${item.price} → ${r.price}`);
          item.price = r.price;
          material = true;
        }
        if (item.needsReview) {
          delete item.needsReview;
          material = true;
        }
      }
      const stock = r.inStock ? "in" : "out";
      if (stock !== item.stock) {
        log.push(`在庫 ${tid} ${item.seller}: ${item.stock} → ${stock}`);
        item.stock = stock;
        material = true;
      }
      if (item.failCount >= 3) material = true; // 順位外から戻る
      item.failCount = 0;
      state[item.url] = 0;
      item.autoCheckedAt = today;
    } catch (e) {
      const n = (state[item.url] || 0) + 1;
      state[item.url] = n;
      if (n >= 3 && item.failCount < 3) material = true; // ここで順位外に回る
      if (n >= 3) item.failCount = n;
      log.push(`失敗 ${tid} ${item.seller}（${n}回目）: ${e.message}`);
    }
    await sleep(3000);
  }
}

if (!DRY) {
  mkdirSync(dirname(STATE), { recursive: true });
  writeFileSync(STATE, JSON.stringify(state, null, 2));
}

const daysSince = (iso) => (Date.parse(today) - Date.parse(iso)) / 86400e3;
const stale = daysSince(db.updatedAt) >= STALE_DAYS;
console.log(log.length ? log.join("\n") : "変化なし");

if (!material && !stale) {
  console.log(`書き込まない（変化なし・前回更新 ${db.updatedAt}）`);
  process.exit(0);
}
db.updatedAt = today;
if (DRY) {
  console.log("--dry-run のため書き込まない");
} else {
  writeFileSync(FILE, JSON.stringify(db, null, 2) + "\n");
  console.log(`更新した（${material ? "価格・在庫に変化あり" : "確認日の更新"}）`);
}
