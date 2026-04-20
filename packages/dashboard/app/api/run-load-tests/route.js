import { NextResponse } from 'next/server';
import { runLoadTests } from '@/lib/runner';
import path from 'path';
import fs from 'fs';

export async function POST() {
  
  // Match UI/API routes: resolve relative paths from the dashboard cwd; absolute TEST_ROOT_DIR is unchanged
      const rootDir = path.resolve(process.cwd(), 'packages/testing');
      const loadTestDir = path.join(rootDir, 'tests', 'Load-Test');

  if (!fs.existsSync(loadTestDir)) {
      return NextResponse.json(
      {
        error: 'Load test directory not found',
        rootDir,
        expectedDir: loadTestDir,
        hint: 'Set TEST_ROOT_DIR in .env to the absolute path of your Playwright repo (folder containing tests/Load-Test).',
      },
      { status: 404 },
      );
}

  // Exact reproduction of the "Run Load Tests" logic from legacy server.js
  const testFiles = fs.readdirSync(loadTestDir)
        .filter(file => file.endsWith('.js'))
        .map(file => path.join('tests', 'Load-Test', file));

  try {
       const initiated = await runLoadTests(testFiles, rootDir, 'Load Intensity Session');
       if (initiated) {
        return NextResponse.json({ success: true, message: 'Load tests initiated' });
        } else
        {
        return NextResponse.json({ success: false, message: 'A run is already in progress' }, { status: 400 });
        }
        } catch (err) 
        {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}



