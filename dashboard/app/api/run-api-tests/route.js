import { NextResponse } from 'next/server';
import { runApiTests } from '../../../lib/runner';
import fs from 'fs';
import path from 'path';

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

  const apiTestsDir = path.join(rootDir, 'tests/api');
  let testFiles = [];

  if (fs.existsSync(apiTestsDir)) {
    testFiles = getAllFiles(apiTestsDir)
      .filter(f => f.endsWith('.spec.js') || f.endsWith('.test.js'))
      .map(f => path.relative(rootDir, f).replace(/\\/g, '/'));
  }

  if (testFiles.length === 0) {
    return NextResponse.json({ success: false, message: 'No API tests found in tests/api' }, { status: 404 });
  }

  try {
    const initiated = await runApiTests(testFiles, playwrightCliPath, rootDir, 'API Full Suite Audit');
    if (initiated) {
      return NextResponse.json({ success: true, message: 'API Full suite initiated' });
    } else {
      return NextResponse.json({ success: false, message: 'A run is already in progress' }, { status: 409 });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}



