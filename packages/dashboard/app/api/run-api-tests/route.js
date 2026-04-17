import { NextResponse } from 'next/server';
import { runApiTests } from '@/lib/runner';
import { apiTestOrder } from '@/lib/test-order';
import path from 'path';
import fs from 'fs';

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else
        {
        arrayOfFiles.push(path.join(dirPath, "/", file));
        }
        });
        return arrayOfFiles;
}

export async function POST() {
    const rootDir = path.resolve(process.cwd(), process.env.TEST_ROOT_DIR || '..');
    const playwrightCliPath = path.join(rootDir, 'node_modules/@playwright/test/cli.js');

    // Use predefined test order from test-order.js, or fallback to directory scan
    let testFiles = apiTestOrder;
  
    if (testFiles.length === 0) {
       // Fallback: scan tests/api directory
        const apiTestsDir = path.join(rootDir, 'tests/api');
    if (fs.existsSync(apiTestsDir)) {
       testFiles = getAllFiles(apiTestsDir)
       .filter(f => f.endsWith('.spec.js') || f.endsWith('.test.js'))
       .map(f => path.relative(rootDir, f).replace(/\\/g, '/'));
       }
}

    if (testFiles.length === 0) {
      return NextResponse.json(
      {
      success: false,
      message: 'No API tests found',
      hint: 'Either add API tests to apiTestOrder in lib/test-order.js or create test files in tests/api/',
      },
      { status: 200 },
      );
}

  try {
      const initiated = await runApiTests(testFiles, playwrightCliPath, rootDir, 'API Full Suite Audit');
      if (initiated) {
      return NextResponse.json({ success: true, message: 'API Full suite initiated' });
      } else {
      return NextResponse.json({ success: false, message: 'A run is already in progress' }, { status: 409 });
      }
      } catch (err) 
      {
      return NextResponse.json({ success: false, error: err.message }, { status: 500 });
      }
}



