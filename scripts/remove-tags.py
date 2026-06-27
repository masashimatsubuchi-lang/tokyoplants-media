#!/usr/bin/env python3
import os
import re
from collections import defaultdict

content_dir = '/Users/masashimatsubuchi/my-first-project/content'

def find_md_files(directory):
    files = []
    for root, dirs, filenames in os.walk(directory):
        for filename in filenames:
            if filename.endswith('.md'):
                files.append(os.path.join(root, filename))
    return sorted(files)

def parse_tags_from_content(content):
    # Block format: tags:\n  - tag1\n  - tag2
    block_match = re.search(r'^tags:\s*\n((?:  - .+\n?)+)', content, re.MULTILINE)
    if block_match:
        lines = re.findall(r'  - (.+)', block_match.group(1))
        return 'block', [t.strip() for t in lines]
    # Inline format: tags: ["a", "b"] or tags: ['a', 'b']
    inline_match = re.search(r'^tags:\s*\[(.+)\]', content, re.MULTILINE)
    if inline_match:
        raw = inline_match.group(1)
        items = [s.strip().strip('"\'') for s in raw.split(',')]
        return 'inline', [t for t in items if t]
    return 'none', []

md_files = find_md_files(content_dir)
print(f"Found {len(md_files)} markdown files")

# Count tags
tag_count = defaultdict(int)
for filepath in md_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    _, tags = parse_tags_from_content(content)
    for tag in tags:
        if tag:
            tag_count[tag] += 1

# Build remove set
always_remove = {'観葉植物', '図鑑'}
single_use = {tag for tag, count in tag_count.items() if count == 1}
remove_set = always_remove | single_use

print(f"Always remove: {always_remove}")
print(f"Single-use tags: {len(single_use)}")
print(f"Total tags to remove: {len(remove_set)}")

# Process files
modified = 0
for filepath in md_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    fmt, tags = parse_tags_from_content(content)
    if fmt == 'none' or not tags:
        continue

    filtered = [t for t in tags if t not in remove_set]
    if len(filtered) == len(tags):
        continue

    removed = [t for t in tags if t in remove_set]
    rel = filepath.replace(content_dir + '/', '')

    if fmt == 'block':
        if filtered:
            new_block = 'tags:\n' + '\n'.join(f'  - {t}' for t in filtered) + '\n'
        else:
            new_block = 'tags: []\n'
        new_content = re.sub(r'^tags:\s*\n(?:  - .+\n?)+', new_block, content, flags=re.MULTILINE)
    elif fmt == 'inline':
        if filtered:
            new_inline = 'tags: [' + ', '.join(f'"{t}"' for t in filtered) + ']'
        else:
            new_inline = 'tags: []'
        new_content = re.sub(r'^tags:\s*\[.+\]', new_inline, content, flags=re.MULTILINE)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    modified += 1
    print(f"  {rel}: removed [{', '.join(removed)}]")

print(f"\nDone. Modified {modified} files.")
