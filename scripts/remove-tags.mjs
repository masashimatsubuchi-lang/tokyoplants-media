import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const contentDir = '/Users/masashimatsubuchi/my-first-project/content';

// Find all .md files
function findMdFiles(dir) {
  const files = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      files.push(...findMdFiles(full));
    } else if (name.endsWith('.md')) {
      files.push(full);
    }
  }
  return files;
}

const mdFiles = findMdFiles(contentDir);

// Parse tags from frontmatter
function parseTags(content) {
  const tags = [];
  // Block format: lines like "  - タグ" after "tags:"
  const blockMatch = content.match(/^tags:\s*\n((?:  - .+\n?)+)/m);
  if (blockMatch) {
    const lines = blockMatch[1].match(/  - (.+)/g) || [];
    for (const line of lines) {
      tags.push(line.replace(/^  - /, '').trim());
    }
    return { format: 'block', tags };
  }
  // Inline format: tags: ["a", "b"]
  const inlineMatch = content.match(/^tags:\s*\[(.+)\]/m);
  if (inlineMatch) {
    const raw = inlineMatch[1];
    const items = raw.split(',').map(s => s.trim().replace(/^["']|["']$/g, '').trim());
    return { format: 'inline', tags: items };
  }
  return { format: 'none', tags: [] };
}

// Count tag occurrences across all files
const tagCount = {};
for (const file of mdFiles) {
  const content = readFileSync(file, 'utf-8');
  const { tags } = parseTags(content);
  for (const tag of tags) {
    if (!tag) continue;
    tagCount[tag] = (tagCount[tag] || 0) + 1;
  }
}

// Build set of tags to remove
const alwaysRemove = new Set(['観葉植物', '図鑑']);
const singleUseTags = new Set(Object.entries(tagCount).filter(([, c]) => c === 1).map(([t]) => t));
const removeSet = new Set([...alwaysRemove, ...singleUseTags]);

console.log(`Total unique tags: ${Object.keys(tagCount).length}`);
console.log(`Always remove: ${[...alwaysRemove].join(', ')}`);
console.log(`Single-use tags to remove: ${singleUseTags.size}`);
console.log(`Total tags to remove: ${removeSet.size}`);

// Process files
let modifiedCount = 0;
for (const file of mdFiles) {
  let content = readFileSync(file, 'utf-8');
  const { format, tags } = parseTags(content);
  if (format === 'none' || tags.length === 0) continue;

  const filteredTags = tags.filter(t => !removeSet.has(t));
  if (filteredTags.length === tags.length) continue; // nothing removed

  // Reconstruct
  if (format === 'block') {
    // Find the tags block and replace
    const newBlock = filteredTags.length > 0
      ? `tags:\n${filteredTags.map(t => `  - ${t}`).join('\n')}\n`
      : `tags: []\n`;
    content = content.replace(/^tags:\s*\n(?:  - .+\n?)+/m, newBlock);
  } else if (format === 'inline') {
    const newInline = filteredTags.length > 0
      ? `tags: [${filteredTags.map(t => `"${t}"`).join(', ')}]`
      : `tags: []`;
    content = content.replace(/^tags:\s*\[.+\]/m, newInline);
  }

  writeFileSync(file, content, 'utf-8');
  modifiedCount++;
  const rel = file.replace(contentDir + '/', '');
  const removed = tags.filter(t => removeSet.has(t));
  console.log(`  ${rel}: removed [${removed.join(', ')}]`);
}

console.log(`\nDone. Modified ${modifiedCount} files.`);
