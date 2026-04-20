import { NextResponse } from 'next/server';
import { runApiTests } from '@/lib/runner';
import { getDynamicTestOrder } from '@/lib/scanner';
import path from 'path';
import fs from 'fs';

export async function POST() {
    const dashboardDir = process.cwd();
    const monorepoRoot = path.resolve(dashboardDir, '..', '..');
    const testingPackageDir = path.resolve(monorepoRoot, 'packages/testing');
    
    const rootDir = testingPackageDir;
    const playwrightCliPath = path.join(monorepoRoot, 'node_modules', '@playwright', 'test', 'cli.js');

    console.log(`[DASHBOARD] Scanning for API tests in: ${path.join(rootDir, 'tests/api')}`);
    const testFiles = getDynamicTestOrder(path.join(rootDir, 'tests/api'), rootDir);

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
    } catch (err) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}



