import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

const CATS = ["guide", "soil", "research", "review", "species"];
const root = process.argv[2] ?? ".";

// 実在する記事 slug の集合
const exists = new Set();
for (const c of CATS)
  for (const f of readdirSync(join(root, "content", c)).filter((x) => x.endsWith(".md")))
    exists.add(`${c}/${f.replace(/\.md$/, "")}`);

// 記事以外の実在ルート（app配下の静的ページ）
const staticRoutes = new Set(["", "about", "contact", "items", "app", "tags", "search", "legal", ...CATS]);

const broken = new Map(); // target -> [{file, kind}]
const note = (target, file, kind) => {
  if (!broken.has(target)) broken.set(target, []);
  broken.get(target).push({ file, kind });
};

for (const c of CATS) {
  for (const f of readdirSync(join(root, "content", c)).filter((x) => x.endsWith(".md"))) {
    const self = `${c}/${f.replace(/\.md$/, "")}`;
    const src = readFileSync(join(root, "content", c, f), "utf8");
    const { data, content } = matter(src);

    // 1. 本文中の内部リンク [..](/category/slug)
    for (const m of content.matchAll(/\]\((\/[^)\s#]*)(#[^)\s]*)?\)/g)) {
      const p = m[1].replace(/\/$/, "");
      const seg = p.split("/").filter(Boolean);
      if (seg.length === 2 && CATS.includes(seg[0])) {
        if (!exists.has(seg.join("/"))) note(p, self, "本文リンク");
      } else if (seg.length <= 1 && !staticRoutes.has(seg[0] ?? "")) {
        note(p, self, "本文リンク");
      }
    }
    // 2. relatedSlugs
    for (const r of data.relatedSlugs ?? [])
      if (!exists.has(String(r).replace(/^\//, "").replace(/\/$/, ""))) note("/" + r, self, "relatedSlugs");
    // 3. siblings
    for (const s of data.siblings ?? [])
      if (s?.slug && !exists.has(String(s.slug).replace(/^\//, ""))) note("/" + s.slug, self, "siblings");
  }
}

const rows = [...broken.entries()].sort((a, b) => b[1].length - a[1].length);
console.log(`実在記事 ${exists.size} 本 / リンク切れ ${rows.length} 件\n`);
for (const [target, refs] of rows) {
  console.log(`${target}  （${refs.length}箇所）`);
  for (const r of refs.slice(0, 6)) console.log(`    ${r.kind}  ← ${r.file}`);
  if (refs.length > 6) console.log(`    …ほか${refs.length - 6}箇所`);
}
