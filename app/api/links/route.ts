import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { isValidUrl, isValidCode, generateRandomCode } from '@/lib/validation';

// GET /api/links - List all links
export async function GET() {
  try {
    const links = await sql`
      SELECT * FROM links 
      ORDER BY created_at DESC
    `;
    
    return NextResponse.json(links);
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    );
  }
}

// POST /api/links - Create a new link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { target_url, code: customCode } = body;

    // Validate target URL
    if (!target_url || !isValidUrl(target_url)) {
      return NextResponse.json(
        { error: 'Invalid or missing target URL' },
        { status: 400 }
      );
    }

    // Generate or validate custom code
    let code = customCode;
    if (code) {
      if (!isValidCode(code)) {
        return NextResponse.json(
          { error: 'Code must be 6-8 alphanumeric characters' },
          { status: 400 }
        );
      }

      // Check if code already exists
      const existing = await sql`
        SELECT code FROM links WHERE code = ${code}
      `;
      
      if (existing.length > 0) {
        return NextResponse.json(
          { error: 'Code already exists' },
          { status: 409 }
        );
      }
    } else {
      // Generate random code
      let attempts = 0;
      while (attempts < 10) {
        code = generateRandomCode();
        const existing = await sql`
          SELECT code FROM links WHERE code = ${code}
        `;
        if (existing.length === 0) break;
        attempts++;
      }
      
      if (attempts === 10) {
        return NextResponse.json(
          { error: 'Failed to generate unique code' },
          { status: 500 }
        );
      }
    }

    // Insert the link
    const result = await sql`
      INSERT INTO links (code, target_url)
      VALUES (${code}, ${target_url})
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json(
      { error: 'Failed to create link' },
      { status: 500 }
    );
  }
}
