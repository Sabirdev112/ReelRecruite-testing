import { NextResponse } from 'next/server';
import { stopRun } from '../../../lib/runner';

export async function POST() {
  const success = stopRun();
  if (!success) return NextResponse.json({ error: 'No test run in progress' }, { status: 400 });
  return NextResponse.json({ success: true, message: 'Test run stopped' });
}



