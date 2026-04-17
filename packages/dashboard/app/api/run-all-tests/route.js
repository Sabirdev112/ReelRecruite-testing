import { NextResponse } from 'next/server';
import { runAllTests } from '@/lib/runner';
import { uiTestOrder } from '@/lib/test-order';
import path from 'path';

export async function POST(req) {
    const { browser } = await req.json().catch(() => ({}));
    const rootDir = path.resolve(process.cwd(), process.env.TEST_ROOT_DIR || '..');
    const playwrightCliPath = path.join(rootDir, 'node_modules/@playwright/test/cli.js');

    // Use predefined test order from test-order.js
    const testFiles = uiTestOrder;

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



