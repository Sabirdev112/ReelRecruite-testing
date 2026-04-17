import { NextResponse } from 'next/server';
import { getLatestTests, getLatestApiTests, getLatestLoadTests, getTestRuns, getApiRuns, getLoadRuns } from '@/lib/db';

export async function GET() {
  try {
    // Phase 1: Fetch Latest Tests
    const [uiTests, apiTests, loadTests] = await Promise.all([
      getLatestTests().catch(e => (console.error('UI Tests fail:', e.message), [])),
      getLatestApiTests().catch(e => (console.error('API Tests fail:', e.message), [])),
      getLatestLoadTests().catch(e => (console.error('Load Tests fail:', e.message), []))
    ]);

    // Phase 2: Fetch Runs
    const [uiRuns, apiRuns, loadRuns] = await Promise.all([
      getTestRuns().catch(e => (console.error('UI Runs fail:', e.message), [])),
      getApiRuns().catch(e => (console.error('API Runs fail:', e.message), [])),
      getLoadRuns().catch(e => (console.error('Load Runs fail:', e.message), []))
    ]);

    const response = { uiTests, apiTests, loadTests, uiRuns, apiRuns, loadRuns };
    
    // Check if we actually got ANY data
    const hasData = Object.values(response).some(arr => Array.isArray(arr) && arr.length > 0);
    if (!hasData) {
        console.warn('[API] Telemetry returned empty for all nodes');
    }

    return NextResponse.json(response);
  } catch (err) {
    console.error('[API] Fatal telemetry crash:', err.message);
    
    // Return empty state instead of crashing the server
    return NextResponse.json({ 
        uiTests: [], apiTests: [], loadTests: [], 
        uiRuns: [], apiRuns: [], loadRuns: [] 
    }, { status: 200 });
  }
}
