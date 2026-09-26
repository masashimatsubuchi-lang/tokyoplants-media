/**
 * 記事本文（Markdown→HTML変換後）に埋め込まれた視覚ブロックのマーカーを解析する。
 *
 * 記法（Markdown側）:
 *   <!-- key-facts title="30秒でわかる" -->  - **ラベル**：値 ...  <!-- /key-facts -->
 *   <!-- stats -->                          - 15℃ | ラベル | 補足 ...  <!-- /stats -->
 *   <!-- steps title="手順" -->              1. **見出し**：本文 ...  <!-- /steps -->
 *   <!-- callout type="warning" title="…" --> 本文Markdown  <!-- /callout -->
 *   <!-- cards cols="3" -->                  #### カード見出し\n本文 ...  <!-- /cards -->
 *   <!-- calendar title="年間カレンダー" -->  | 作業 | 1 | 2 | … | 12 | のMarkdown表  <!-- /calendar -->
 *   <!-- mix title="バランス型" -->           - 素材名 | 割合(数値) ...  <!-- /mix -->
 *   <!-- amazon-cards title="..." -->        （中身は空。frontmatterのamazonProductsを描画） <!-- /amazon-cards -->
 *
 * 内側はremarkで既にHTML化されているので、ここでは <li> / <h4> / <table> を素朴に切り出す。
 * 入れ子のブロックには対応しない。
 */

export const BLOCK_NAMES = ["key-facts", "stats", "steps", "callout", "cards", "calendar", "mix", "amazon-cards"] as const;
export type BlockName = (typeof BLOCK_NAMES)[number];

export interface KeyFactItem {
  label: string;
  valueHtml: string;
}
export interface StatItem {
  value: string;
  label: string;
  note: string;
}
export interface StepItem {
  title: string;
  bodyHtml: string;
}
export interface CardItem {
  title: string;
  bodyHtml: string;
}
export interface MixItem {
  label: string;
  ratio: number;
}
export interface CalendarRow {
  label: string;
  cells: string[]; // 12個。◎ ○ △ × - のいずれか（それ以外はそのまま表示）
}

export type ParsedBlock =
  | { kind: "key-facts"; title: string; items: KeyFactItem[] }
  | { kind: "stats"; title: string; items: StatItem[] }
  | { kind: "steps"; title: string; items: StepItem[] }
  | { kind: "callout"; title: string; variant: "warning" | "tip" | "info"; bodyHtml: string }
  | { kind: "cards"; title: string; cols: 2 | 3; items: CardItem[] }
  | { kind: "calendar"; title: string; months: string[]; rows: CalendarRow[]; legend: string }
  | { kind: "mix"; title: string; items: MixItem[] }
  | { kind: "amazon-cards"; title: string; note: string };

export function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
}

function listItems(html: string): string[] {
  const items: string[] = [];
  const re = /<li[^>]*>([\s\S]*?)<\/li>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    // remark は緩いリストで <li><p>…</p></li> にすることがある
    items.push(m[1].replace(/^\s*<p>([\s\S]*?)<\/p>\s*$/, "$1").trim());
  }
  return items;
}

/** 「**ラベル**：値」形式の <li> を label / value に分ける */
function splitLabelValue(itemHtml: string): { label: string; valueHtml: string } {
  const m = itemHtml.match(/^<strong>([\s\S]*?)<\/strong>\s*[:：]?\s*([\s\S]*)$/);
  if (m) return { label: stripTags(m[1]), valueHtml: m[2].trim() };
  const idx = itemHtml.search(/[:：]/);
  if (idx > 0) return { label: stripTags(itemHtml.slice(0, idx)), valueHtml: itemHtml.slice(idx + 1).trim() };
  return { label: "", valueHtml: itemHtml };
}

export function parseBlock(name: BlockName, attrs: Record<string, string>, innerHtml: string): ParsedBlock {
  const title = attrs.title ?? "";
  switch (name) {
    case "key-facts":
      return { kind: "key-facts", title, items: listItems(innerHtml).map(splitLabelValue) };
    case "stats":
      return {
        kind: "stats",
        title,
        items: listItems(innerHtml).map((li) => {
          const [value = "", label = "", note = ""] = stripTags(li).split("|").map((s) => s.trim());
          return { value, label, note };
        }),
      };
    case "steps":
      return {
        kind: "steps",
        title,
        items: listItems(innerHtml).map((li) => {
          const { label, valueHtml } = splitLabelValue(li);
          return label ? { title: label, bodyHtml: valueHtml } : { title: "", bodyHtml: li };
        }),
      };
    case "callout": {
      const v = attrs.type === "warning" || attrs.type === "tip" ? attrs.type : "info";
      return { kind: "callout", title, variant: v, bodyHtml: innerHtml.trim() };
    }
    case "cards": {
      const cols = attrs.cols === "2" ? 2 : 3;
      const items: CardItem[] = [];
      const parts = innerHtml.split(/<h4[^>]*>/);
      for (const part of parts.slice(1)) {
        const end = part.indexOf("</h4>");
        if (end < 0) continue;
        items.push({ title: stripTags(part.slice(0, end)), bodyHtml: part.slice(end + 5).trim() });
      }
      return { kind: "cards", title, cols, items };
    }
    case "mix":
      return {
        kind: "mix",
        title,
        items: listItems(innerHtml)
          .map((li) => {
            const [label = "", ratio = ""] = stripTags(li).split("|").map((x) => x.trim());
            return { label, ratio: Number(ratio.replace(/[^0-9.]/g, "")) || 0 };
          })
          .filter((x) => x.label && x.ratio > 0),
      };
    case "amazon-cards":
      return { kind: "amazon-cards", title, note: attrs.note ?? "" };
    case "calendar": {
      const rows: CalendarRow[] = [];
      let months: string[] = [];
      const trRe = /<tr>([\s\S]*?)<\/tr>/g;
      let tr: RegExpExecArray | null;
      while ((tr = trRe.exec(innerHtml)) !== null) {
        const cells = [...tr[1].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/g)].map((c) => stripTags(c[1]));
        if (cells.length < 2) continue;
        if (/<th/.test(tr[1])) {
          months = cells.slice(1);
          continue;
        }
        rows.push({ label: cells[0], cells: cells.slice(1) });
      }
      if (months.length === 0) months = Array.from({ length: 12 }, (_, i) => String(i + 1));
      return { kind: "calendar", title, months, rows, legend: attrs.legend ?? "" };
    }
  }
}
