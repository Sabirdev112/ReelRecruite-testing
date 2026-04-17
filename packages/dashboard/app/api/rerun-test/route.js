import { NextResponse } from 'next/server';
import { rerunSingleTest } from '@/lib/runner';
import path from 'path';

export async function POST(req) {
  const { file, title, browser } = await req.json();

  if (!file || !title) {
    return NextResponse.json({ error: 'Missing file or title' }, { status: 400 });
  }

  const rootDir = process.env.TEST_ROOT_DIR || path.resolve(process.cwd(), '..');
  const playwrightCliPath = path.join(rootDir, 'node_modules/@playwright/test/cli.js');

  try {
    const result = await rerunSingleTest(file, title, playwrightCliPath, rootDir, browser);
    return NextResponse.json({ 
      success: true, 
      passed: result, 
      code: result ? 0 : 1 
    });
  } catch (err) {
    console.error('Rerun Error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}



