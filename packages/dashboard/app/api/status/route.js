import { NextResponse } from 'next/server';
import { getStatus } from '../../../lib/runner';

export async function GET() {
  return NextResponse.json(getStatus());
}



