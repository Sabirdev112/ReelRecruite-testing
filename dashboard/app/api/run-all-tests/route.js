import { NextResponse } from 'next/server';
import { runAllTests } from '../../../lib/runner';
import path from 'path';
import fs from 'fs';

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });
  return arrayOfFiles;
}

export async function POST() {
  const rootDir = path.resolve(process.cwd(), process.env.TEST_ROOT_DIR || '..');
  const playwrightCliPath = path.join(rootDir, 'node_modules/@playwright/test/cli.js');

  const e2eDir = path.join(rootDir, 'tests/e2e');
  let testFiles = [];

  if (fs.existsSync(e2eDir)) {
    testFiles = getAllFiles(e2eDir)
      .filter(f => f.endsWith('.spec.js') || f.endsWith('.test.js'))
      .map(f => path.relative(rootDir, f).replace(/\\/g, '/'));
  }

  if (testFiles.length === 0) {
    return NextResponse.json({ success: false, message: 'No UI tests found in tests/e2e' }, { status: 404 });
  }

  try {
    const initiated = await runAllTests(testFiles, playwrightCliPath, rootDir, 'Full E2E Suite');
    
    if (initiated) {
      return NextResponse.json({ success: true, message: 'Full suite initiated' });
    } else {
      return NextResponse.json({ success: false, message: 'A run is already in progress' }, { status: 409 });
    }
  } catch (err) {
    console.error('API Error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}



