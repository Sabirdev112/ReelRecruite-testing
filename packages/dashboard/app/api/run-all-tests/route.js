import { NextResponse } from 'next/server';
import { runAllTests } from '@/lib/runner';
import { getDynamicTestOrder } from '@/lib/scanner';
import path from 'path';

export async function POST(req) {
  const { browser } = await req.json().catch(() => ({}));

  const monorepoRoot = process.env.TEST_ROOT_DIR || path.resolve(process.cwd(), '..', '..');
  const testingPackageDir = path.resolve(monorepoRoot, 'packages', 'testing');
  const playwrightCliPath = path.join(monorepoRoot, 'node_modules', '@playwright', 'test', 'cli.js');
  
  const rootDir = testingPackageDir;

  // Scan for tests
  console.log(`[DASHBOARD] Scanning for UI tests in: ${path.join(rootDir, 'tests/e2e')}`);
  const testFiles = getDynamicTestOrder(path.join(rootDir, 'tests/e2e'), rootDir);

  if (testFiles.length === 0) {
    return NextResponse.json(
      {
        success: false,
        message: 'No UI tests found',
        hint: 'Either add tests to uiTestOrder in lib/test-order.js or ensure test files exist in tests/e2e/',
      },
      { status: 200 },
    );
  }

  try {
    const initiated = await runAllTests(testFiles, playwrightCliPath, rootDir, 'Full E2E Suite', browser);

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



