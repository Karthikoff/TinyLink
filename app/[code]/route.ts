import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(
  request: NextRequest,
 context:any
) {
  try {
    const { code } = await context.params;
    
    // Get the link
    const result = await sql`
      SELECT * FROM links WHERE code = ${code}
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    const link = result[0];

    // Update click count and last clicked time
    await sql`
      UPDATE links 
      SET total_clicks = total_clicks + 1,
          last_clicked_at = NOW()
      WHERE code = ${code}
    `;

    // Return 302 redirect
    return NextResponse.redirect(link.target_url, 302);
  } catch (error) {
    console.error('Error redirecting:', error);
    return NextResponse.json(
      { error: 'Redirect failed' },
      { status: 500 }
    );
  }
}