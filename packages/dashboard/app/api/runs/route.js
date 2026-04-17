import { NextResponse } from 'next/server';
import { getTestRuns, getApiRuns, getLoadRuns } from '../../../lib/db';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'ui';

  try {
    let runs = [];
    if (type === 'api') runs = await getApiRuns();
    else if (type === 'load') runs = await getLoadRuns();
    else runs = await getTestRuns();
    
    return NextResponse.json(runs);
    } catch (err) {
    console.error(`API Error /api/runs?type=${type}:`, err.message);
    return NextResponse.json([], { status: 500 });
  }
}



