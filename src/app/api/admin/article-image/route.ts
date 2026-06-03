import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const formData = await req.formData();
  const slug = formData.get('slug') as string;
  const file = formData.get('file') as File | null;
  const url = formData.get('url') as string | null;

  if (!slug) {
    return NextResponse.json({ error: 'slug is required' }, { status: 400 });
  }

  const contentDir = path.join(process.cwd(), 'content');
  const mdPath = path.join(contentDir, `${slug}.md`);

  if (!fs.existsSync(mdPath)) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  }

  const raw = fs.readFileSync(mdPath, 'utf-8');
  const { data, content } = matter(raw);

  let newImage: string;

  if (file) {
    const slugParts = slug.split('/');
    const baseName = slugParts[slugParts.length - 1];
    const filename = `${baseName}-header.jpg`;
    const destPath = path.join(process.cwd(), 'public', 'images', 'products', filename);

    const arrayBuffer = await file.arrayBuffer();
    fs.writeFileSync(destPath, Buffer.from(arrayBuffer));

    newImage = `/images/products/${filename}`;
  } else if (url) {
    newImage = url;
  } else {
    return NextResponse.json({ error: 'file or url is required' }, { status: 400 });
  }

  data.image = newImage;
  const updated = matter.stringify(content, data);
  fs.writeFileSync(mdPath, updated, 'utf-8');

  return NextResponse.json({ success: true, newImage });
}
