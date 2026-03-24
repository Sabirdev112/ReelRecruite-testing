import { NextResponse } from 'next/server';
import { getStatus } from '@/lib/processManager';

export async function GET() {
  return NextResponse.json(getStatus());
}
