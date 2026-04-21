import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET({ params }) {
  const { filename } = await params;
  
  try {
    // Look in the public/screenshots directory
    const screenshotPath = path.join(process.cwd(), 'public', 'screenshots', filename);
    
    if (!fs.existsSync(screenshotPath)) {
      console.warn(`[SNAPSHOT-API] File not found: ${screenshotPath}`);
      return new NextResponse('Not Found', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(screenshotPath);
    
    // Determine content type based on extension
    let contentType = 'image/png';
    if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) contentType = 'image/jpeg';
    if (filename.endsWith('.webp')) contentType = 'image/webp';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err) {
    console.error('[SNAPSHOT-API] Error serving snapshot:', err.message);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
