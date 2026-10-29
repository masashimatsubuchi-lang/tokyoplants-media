/**
 * ショップ（www.tokyoplants.com）の検索窓から使う横断検索の中身（仕様 Q62・Q87・Q97）。
 * 商品・カテゴリー・media の記事を、学名・和名・表記ゆれをまたいで探す。
 * 並び順は「完全一致 → 関連性 → 販売中」。通常の検索では売り切れの商品を出さない。
 *
 * このファイルは import を持たない純粋な関数だけにしている（node で直接テストできるように）。
 */

export interface SearchProduct {
  id: number;
  name: string;
  price: number | null;
  available: boolean;
  image: string | null;
}

export interface SearchCategory {
  id: string;
  name: string;
  /** 検索に当てる別名（学名・和名・カタカナなど） */
  keys: string[];
}

export interface SearchArticle {
  path: string;
  title: string;
  description: string;
  image?: string;
}

/** 学名と和名などを結ぶ別名の組。どれか1つに当たったら、組の全部で探し直す */
export type AliasGroup = string[];

export interface SearchData {
  products: SearchProduct[];
  categories: SearchCategory[];
  articles: SearchArticle[];
  aliases: AliasGroup[];
}

export interface SearchResult<T> {
  item: T;
  score: number;
}

/**
 * 表記ゆれをそろえる: 全角半角（NFKC）、大文字小文字、ひらがな→カタカナ、
 * 空白・中黒・引用符・ハイフン・括弧を除く。「モンステラ・デリシオーサ」と「monstera deliciosa」を同じ土俵に乗せるため。
 */
export function normalize(text: string): string {
  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[ぁ-ゖ]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0x60))
    // 長音「ー」と英字の x は意味があるので残す
    .replace(/[\s・･'’‘"“”`´\-‐－_.,、。()（）［］[\]<>＜＞｜|│/／×]/g, "");
}

/** 検索語を、別名の組を使って広げる（例: 「アンスリウム」→ anthurium も） */
export function expandQuery(query: string, aliases: AliasGroup[]): string[] {
  const q = normalize(query);
  if (!q) return [];
  const terms = new Set([q]);
  for (const group of aliases) {
    const normalized = group.map(normalize).filter(Boolean);
    if (normalized.some((a) => a === q || (q.length >= 3 && (a.includes(q) || q.includes(a))))) {
      normalized.forEach((a) => terms.add(a));
    }
  }
  return [...terms];
}

/** 1つの文字列に対する当たり具合。完全一致 100、前方一致 70、部分一致 45、別名での部分一致 30 */
function scoreText(text: string, query: string, expanded: string[]): number {
  const t = normalize(text);
  if (!t) return 0;
  if (t === query) return 100;
  if (t.startsWith(query)) return 70;
  if (t.includes(query)) return 45;
  if (expanded.some((e) => e !== query && e.length >= 3 && t.includes(e))) return 30;
  return 0;
}

/** 商品名は「<SELECT STOCK> Anthurium Regale｜アンスリウム・レガレ｜観葉植物」の形なので、区切りごとにも当てる */
function nameParts(name: string): string[] {
  const stripped = name.replace(/^\s*<[^>]*>\s*/, "");
  return [stripped, ...stripped.split(/[｜│|]/)];
}

export function searchAll(
  query: string,
  data: SearchData,
  options: { includeSoldOut?: boolean; limit?: number } = {},
) {
  const limit = options.limit ?? 12;
  const q = normalize(query);
  if (!q) return { query, products: [], categories: [], articles: [] };
  const expanded = expandQuery(query, data.aliases);

  const products: SearchResult<SearchProduct>[] = [];
  for (const p of data.products) {
    if (!p.available && !options.includeSoldOut) continue;
    const base = Math.max(...nameParts(p.name).map((part) => scoreText(part, q, expanded)));
    if (base > 0) products.push({ item: p, score: base + (p.available ? 20 : 0) });
  }

  const categories: SearchResult<SearchCategory>[] = [];
  for (const c of data.categories) {
    const score = Math.max(...[c.name, ...c.keys].map((k) => scoreText(k, q, expanded)));
    if (score > 0) categories.push({ item: c, score });
  }

  const articles: SearchResult<SearchArticle>[] = [];
  for (const a of data.articles) {
    const title = scoreText(a.title, q, expanded);
    const desc = scoreText(a.description, q, expanded) * 0.5;
    const score = Math.max(title, desc);
    if (score > 0) articles.push({ item: a, score });
  }

  const byScore = <T>(list: SearchResult<T>[]) => list.sort((a, b) => b.score - a.score);
  return {
    query,
    categories: byScore(categories).slice(0, 4).map((r) => r.item),
    products: byScore(products).slice(0, limit).map((r) => r.item),
    articles: byScore(articles).slice(0, 6).map((r) => r.item),
  };
}
