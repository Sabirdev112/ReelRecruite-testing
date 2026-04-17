import { NextResponse } from 'next/server';
import { getRunDetails, getApiRunDetails, getLoadRunDetails } from '../../../../lib/db';

export async function GET(req, { params }) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'ui';

  if (!id) {
    return NextResponse.json({ error: 'Missing run identifier' }, { status: 400 });
  }

  try {
    let details = null;
    console.log(`[API] Fetching report details for ID: ${id}, Type: ${type}`);
    
    if (type === 'api') details = await getApiRunDetails(id);
    else if (type === 'load') details = await getLoadRunDetails(id);
    else details = await getRunDetails(id);
    
    if (!details) {
    console.warn(`[API] Report not found for ID: ${id}, Type: ${type}`);
    return NextResponse.json({ error: 'Technical validation not found' }, { status: 404 });
    }

    return NextResponse.json(details);
    } catch (err) {
    console.error(`[API] Metadata error for ${id}:`, err.message);
    return NextResponse.json({ error: 'Internal telemetry retrieval failed' }, { status: 500 });
  }
}
