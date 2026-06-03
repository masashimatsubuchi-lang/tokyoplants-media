import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

function getAllMarkdownFiles(dir: string, baseDir: string): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllMarkdownFiles(fullPath, baseDir));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const contentDir = path.join(process.cwd(), 'content');
  const files = getAllMarkdownFiles(contentDir, contentDir);

  const articles = files.map((filePath) => {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(raw);
    const relative = path.relative(contentDir, filePath);
    const slug = relative.replace(/\.md$/, '').replace(/\\/g, '/');
    return {
      slug,
      title: data.title ?? '',
      image: data.image ?? '',
      category: data.category ?? '',
      date: data.date ?? '',
    };
  });

  // Sort by date descending
  articles.sort((a, b) => (a.date < b.date ? 1 : -1));

  return NextResponse.json({ articles });
}
