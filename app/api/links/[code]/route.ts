import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// GET /api/links/:code - Get stats for a single link
export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;
    
    const result = await sql`
      SELECT * FROM links WHERE code = ${code}
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error fetching link:', error);
    return NextResponse.json(
      { error: 'Failed to fetch link' },
      { status: 500 }
    );
  }
}

// DELETE /api/links/:code - Delete a link
export async function DELETE(request: NextRequest, context: any) {
  const { code } = await context.params;

  try {
    const result = await sql`
      DELETE FROM links WHERE code = ${code}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting link:', error);
    return NextResponse.json(
      { error: 'Failed to delete link' },
      { status: 500 }
    );
  }
}


