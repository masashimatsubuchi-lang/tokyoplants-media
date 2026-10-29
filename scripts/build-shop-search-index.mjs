#!/usr/bin/env node
/**
 * ショップ横断検索（/api/shop-search）用の索引を作る。
 *
 *   node scripts/build-shop-search-index.mjs
 *
 * 書き出すファイル
 *   src/data/shop-search-products.json  BASE の商品（公開してよい項目だけ: ID・名前・価格・販売中か・代表画像）
 *   src/data/plant-name-aliases.json    学名と和名の組（Green Collection の植物カタログ 1,025 種から）
 *
 * 商品は出品・売り切れで変わるので、定期的に作り直す（API ルートは環境変数 BASE_API_TOKEN があれば
 * BASE から直接取り、無ければこのファイルを使う）。
 *
 * 認証: BASE API v2 の PAT（items.read）。~/.config/base-api/token か環境変数 BASE_API_TOKEN。
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const CATALOG = join(homedir(), "my-green-shelf", "shared", "catalog", "plant_species.json");
const TOKEN_FILE = join(homedir(), ".config", "base-api", "token");

function token() {
  if (process.env.BASE_API_TOKEN) return process.env.BASE_API_TOKEN.trim();
  if (existsSync(TOKEN_FILE)) return readFileSync(TOKEN_FILE, "utf8").trim();
  throw new Error("BASE の PAT が見つかりません");
}

async function fetchProducts() {
  const items = [];
  for (let offset = 0; ; offset += 100) {
    const res = await fetch(`https://apiv2.thebase.com/api/items?limit=100&offset=${offset}&visible=true`, {
      headers: { Authorization: `Bearer ${token()}` },
    });
    if (!res.ok) throw new Error(`GET /api/items ${res.status}`);
    const page = await res.json();
    items.push(...page);
    if (page.length < 100) break;
  }
  return items.map((i) => ({
    id: i.id,
    name: i.name,
    price: i.price,
    available: i.sales_status === "item_now_on_sale" && i.stock > 0,
    image: i.images?.[0]?.url ?? null,
  }));
}

function buildAliases() {
  const { species } = JSON.parse(readFileSync(CATALOG, "utf8"));
  const groups = [];
  for (const s of species) {
    const ja = s.i18n?.ja?.displayName?.replace(/（種類不明）$/, "");
    const sci = s.scientificName.replace(/\s+spp\.$/, "");
    const names = [sci, ...(s.scientificNameAliases ?? []), ja].filter(Boolean);
    if (names.length > 1) groups.push([...new Set(names)]);
  }
  return groups;
}

const products = await fetchProducts();
writeFileSync("src/data/shop-search-products.json",
  JSON.stringify({ generatedAt: new Date().toISOString(), products }, null, 0) + "\n");
const aliases = buildAliases();
writeFileSync("src/data/plant-name-aliases.json", JSON.stringify(aliases) + "\n");
console.log(`商品 ${products.length} 件（販売中 ${products.filter((p) => p.available).length}）、別名の組 ${aliases.length}`);
