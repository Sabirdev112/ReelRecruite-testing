import { NextResponse } from 'next/server';
import { getLatestTests, getLatestApiTests, getLatestLoadTests } from '@/lib/supabase';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'ui';

  try {
    let tests = [];
    if (type === 'api') tests = await getLatestApiTests();
    else if (type === 'load') tests = await getLatestLoadTests();
    else tests = await getLatestTests();

    return NextResponse.json(tests);
  } catch (err) {
    console.error(`API Error /api/latest-tests?type=${type}:`, err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
