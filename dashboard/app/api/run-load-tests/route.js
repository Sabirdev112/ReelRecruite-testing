import { NextResponse } from 'next/server';
import { runLoadTests } from '@/lib/processManager';
import path from 'path';
import fs from 'fs';

export async function POST() {
  const rootDir = path.resolve(process.cwd(), '../');
  const loadTestDir = path.join(rootDir, 'tests/Load-Test');
  
  if (!fs.existsSync(loadTestDir)) {
    return NextResponse.json({ error: 'Load test directory not found' }, { status: 404 });
  }

  // Exact reproduction of the "Run Load Tests" logic from legacy server.js
  const testFiles = fs.readdirSync(loadTestDir)
    .filter(file => file.endsWith('.js'))
    .map(file => path.join('tests', 'Load-Test', file));

  try {
    const initiated = await runLoadTests(testFiles, rootDir, 'Load Intensity Session');
    if (initiated) {
      return NextResponse.json({ success: true, message: 'Load tests initiated' });
    } else {
      return NextResponse.json({ success: false, message: 'A run is already in progress' }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
