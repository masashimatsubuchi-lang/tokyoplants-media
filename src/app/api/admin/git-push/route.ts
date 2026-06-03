import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

export async function POST() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const output = execSync(
      'git add content/ public/images/products/ && git commit -m "Update article images via admin" && git push',
      { cwd: process.cwd(), encoding: 'utf-8' }
    );
    return NextResponse.json({ success: true, output });
  } catch (err: unknown) {
    const error = err as { message?: string; stderr?: string; stdout?: string };
    return NextResponse.json(
      { success: false, error: error.message, stderr: error.stderr, stdout: error.stdout },
      { status: 500 }
    );
  }
}
