/**
 * 主要記事にハッシュタグを追加するスクリプト
 * Usage: node scripts/add-hashtags.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, "../content");

// ファイルパス → 追加するタグ のマッピング
const tagMap = {
  // ── guide ──────────────────────────────────────────────
  "guide/monstera-care.md":                          ["観葉植物", "モンステラ", "育て方"],
  "guide/monstera-repotting-guide.md":               ["観葉植物", "モンステラ", "植え替え"],
  "guide/monstera-hydroculture.md":                  ["モンステラ", "ハイドロカルチャー"],
  "guide/monstera-grow-light-guide.md":              ["モンステラ", "育成ライト"],
  "guide/alocasia-care-guide.md":                    ["観葉植物", "アロカシア", "育て方", "完全ガイド"],
  "guide/alocasia-repotting-guide.md":               ["アロカシア", "植え替え"],
  "guide/alocasia-summer-care.md":                   ["アロカシア", "夏の管理"],
  "guide/alocasia-hydroculture.md":                  ["アロカシア", "ハイドロカルチャー"],
  "guide/jewel-alocasia-types-comparison.md":        ["アロカシア", "希少植物"],
  "guide/anthurium-care-for-beginners.md":           ["観葉植物", "アンスリウム", "育て方", "初心者"],
  "guide/anthurium-warocqueanum-care-guide.md":      ["アンスリウム", "育て方", "希少植物"],
  "guide/anthurium-regale-care-guide.md":            ["アンスリウム", "育て方", "希少植物"],
  "guide/anthurium-regale-vs-warocqueanum.md":       ["アンスリウム", "希少植物"],
  "guide/anthurium-warocqueanum-humidity-setup.md":  ["アンスリウム", "希少植物"],
  "guide/anthurium-grow-light-guide.md":             ["アンスリウム", "育成ライト"],
  "guide/anthurium-summer-rainy-season-care.md":     ["アンスリウム", "夏の管理"],
  "guide/philodendron-for-beginners.md":             ["フィロデンドロン", "育て方", "初心者"],
  "guide/philodendron-repotting-guide.md":           ["フィロデンドロン", "植え替え"],
  "guide/philodendron-hydroculture.md":              ["フィロデンドロン", "ハイドロカルチャー"],
  "guide/platycerium-grow-light-guide.md":           ["ビカクシダ", "育成ライト"],
  "guide/repotting-houseplants-complete-guide.md":   ["観葉植物", "植え替え", "完全ガイド", "初心者"],
  "guide/repotting-after-purchase.md":               ["観葉植物", "植え替え", "初心者"],
  "guide/root-rot-causes-and-recovery.md":           ["観葉植物", "根腐れ"],
  "guide/rainy-season-root-rot-prevention.md":       ["観葉植物", "根腐れ", "水やり"],
  "guide/rainy-season-watering-tips.md":             ["観葉植物", "水やり"],
  "guide/rainy-season-houseplant-care.md":           ["観葉植物", "害虫対策"],
  "guide/bottom-watering-houseplants.md":            ["観葉植物", "ハイドロカルチャー", "水やり"],
  "guide/summer-houseplant-care-guide.md":           ["観葉植物", "夏の管理", "完全ガイド"],
  "guide/summer-houseplant-care.md":                 ["観葉植物", "夏の管理"],
  "guide/summer-watering-guide.md":                  ["観葉植物", "水やり", "夏の管理"],
  "guide/winter-watering-houseplants.md":            ["観葉植物", "水やり", "冬の管理"],
  "guide/winter-emergency-repotting-guide.md":       ["観葉植物", "植え替え", "冬の管理"],
  "guide/spider-mites-houseplants-control.md":       ["観葉植物", "害虫対策"],
  "guide/scale-insects-houseplants-control.md":      ["観葉植物", "害虫対策"],
  "guide/spring-pest-prevention-houseplants.md":     ["観葉植物", "害虫対策"],
  "guide/fungus-gnat-prevention-rainy-season.md":    ["観葉植物", "害虫対策"],
  "guide/houseplant-grow-light-guide.md":            ["観葉植物", "育成ライト"],
  "guide/stephania-kaweesakii-care.md":              ["希少植物"],
  "guide/stephania-kaweesakii-complete-guide.md":    ["希少植物", "完全ガイド"],
  "guide/alocasia-holy-grail-care-guide.md":         ["アロカシア", "希少植物"],
  "guide/alocasia-root-rot-treatment.md":            ["アロカシア", "根腐れ"],
  "guide/yellow-leaves-houseplants-checklist.md":    ["観葉植物", "育て方"],
  "guide/root-bound-signs-and-solutions.md":         ["観葉植物", "植え替え"],
  "guide/how-to-trim-roots-when-repotting.md":       ["観葉植物", "植え替え"],
  "guide/choosing-pot-size-for-repotting.md":        ["観葉植物", "植え替え"],
  "guide/repotting-failure-patterns.md":             ["観葉植物", "植え替え"],
  "guide/plant-not-recovering-after-repotting.md":   ["観葉植物", "植え替え"],
  "guide/after-repotting-watering-and-fertilizer.md":["観葉植物", "植え替え", "水やり"],
  "guide/hydroculture-to-soil-transition.md":        ["観葉植物", "ハイドロカルチャー"],
  "guide/no-bugs-houseplant-growing.md":             ["観葉植物", "ハイドロカルチャー"],
  "guide/sansevieria-care.md":                       ["観葉植物", "育て方", "初心者"],
  "guide/pachira-care.md":                           ["観葉植物", "育て方", "初心者"],
  "guide/umbellata-care.md":                         ["観葉植物", "育て方", "初心者"],
  "guide/pothos-care.md":                            ["観葉植物", "育て方", "初心者"],
  "guide/gajumaru-care.md":                          ["観葉植物", "育て方", "初心者"],
  "guide/umbellata-repotting-guide.md":              ["観葉植物", "植え替え"],
  "guide/pothos-repotting-guide.md":                 ["観葉植物", "植え替え"],
  "guide/spring-repotting-checklist-march-april.md": ["観葉植物", "植え替え"],
  "guide/march-houseplant-care-reset.md":            ["観葉植物", "育て方"],

  // ── soil ───────────────────────────────────────────────
  "soil/recommended-soil-for-houseplants.md":        ["観葉植物", "用土", "初心者"],
  "soil/best-soil-for-monstera.md":                  ["モンステラ", "用土", "植え替え"],
  "soil/best-soil-for-alocasia.md":                  ["アロカシア", "用土", "植え替え"],
  "soil/best-soil-for-philodendron.md":              ["フィロデンドロン", "用土", "植え替え"],
  "soil/best-soil-for-pothos.md":                    ["観葉植物", "用土", "植え替え", "初心者"],
  "soil/best-soil-for-pachira.md":                   ["観葉植物", "用土", "植え替え"],
  "soil/best-soil-for-sansevieria.md":               ["観葉植物", "用土", "植え替え"],
  "soil/hydroculture-medium-comparison.md":          ["ハイドロカルチャー", "用土"],
  "soil/hydroculture-vs-soil.md":                    ["観葉植物", "ハイドロカルチャー", "用土"],
  "soil/lava-rock-for-houseplants.md":               ["ハイドロカルチャー", "用土"],
  "soil/zeolite-for-houseplants.md":                 ["ハイドロカルチャー", "用土"],
  "soil/mold-on-houseplant-soil.md":                 ["観葉植物", "用土"],
  "soil/bugs-in-houseplant-soil.md":                 ["観葉植物", "用土", "害虫対策"],
  "soil/when-to-replace-soil.md":                    ["観葉植物", "用土", "植え替え"],
  "soil/repotting-soil-guide.md":                    ["観葉植物", "用土", "植え替え", "初心者"],
  "soil/basic-soil-mix.md":                          ["観葉植物", "用土", "初心者"],
  "soil/how-to-mix-soil-for-houseplants.md":         ["観葉植物", "用土"],
  "soil/commercial-soil-ingredients.md":             ["観葉植物", "用土", "初心者"],
  "soil/drainage-stones-guide.md":                   ["観葉植物", "用土", "植え替え"],
  "soil/improve-drainage-for-houseplants.md":        ["観葉植物", "用土", "根腐れ"],
  "soil/reusing-houseplant-soil.md":                 ["観葉植物", "用土"],
  "soil/white-particles-in-soil.md":                 ["観葉植物", "用土"],
  "soil/cheap-vs-quality-soil.md":                   ["観葉植物", "用土"],

  // ── research ───────────────────────────────────────────
  "research/variegated-chimera-science.md":          ["斑入り", "希少植物"],
  "research/rare-plant-price-bubble.md":             ["希少植物", "斑入り"],
  "research/tokyo-rare-houseplant-specialty-shops.md":["希少植物"],
  "research/root-rot-mechanism-science.md":          ["観葉植物", "根腐れ"],
  "research/why-houseplants-die-5-factors.md":       ["観葉植物", "育て方"],
  "research/air-purifying-plants.md":                ["観葉植物", "育て方", "初心者"],

  // ── species ────────────────────────────────────────────
  "species/monstera-deliciosa.md":                   ["モンステラ", "育て方", "完全ガイド"],
  "species/genus-monstera.md":                       ["モンステラ", "完全ガイド"],
  "species/pothos-epipremnum-aureum.md":             ["観葉植物", "育て方", "初心者"],
  "species/sansevieria.md":                          ["観葉植物", "育て方", "初心者"],
  "species/ficus-umbellata.md":                      ["観葉植物", "育て方"],
  "species/zamioculcas-zamiifolia.md":               ["観葉植物", "育て方"],

  // ── review ─────────────────────────────────────────────
  "review/plant-light-review.md":                    ["観葉植物", "育成ライト", "ビカクシダ"],
};

let updated = 0;
let skipped = 0;
let errors = 0;

for (const [relPath, newTags] of Object.entries(tagMap)) {
  const filePath = path.join(contentDir, relPath);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  not found: ${relPath}`);
    skipped++;
    continue;
  }

  const raw = fs.readFileSync(filePath, "utf8");

  // frontmatter の tags 行を探す
  const tagsMatch = raw.match(/^tags:\s*\[([^\]]*)\]/m);
  if (!tagsMatch) {
    // tags フィールドがない場合はスキップ（別途対応）
    console.log(`⚠️  no tags field: ${relPath}`);
    skipped++;
    continue;
  }

  const existingTagsRaw = tagsMatch[1];
  // 既存タグをパース
  const existingTags = existingTagsRaw
    .split(",")
    .map((t) => t.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);

  // 重複しないタグのみ追加
  const toAdd = newTags.filter((t) => !existingTags.includes(t));
  if (toAdd.length === 0) {
    // console.log(`  already tagged: ${relPath}`);
    continue;
  }

  const mergedTags = [...existingTags, ...toAdd];
  const newTagsLine = `tags: [${mergedTags.map((t) => `"${t}"`).join(", ")}]`;
  const newRaw = raw.replace(/^tags:\s*\[[^\]]*\]/m, newTagsLine);

  fs.writeFileSync(filePath, newRaw, "utf8");
  console.log(`✅ ${relPath}  +[${toAdd.join(", ")}]`);
  updated++;
}

console.log(`\nDone: ${updated} updated, ${skipped} skipped, ${errors} errors`);
