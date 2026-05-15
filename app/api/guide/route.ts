import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth, unauthorized, serverError } from '@/lib/auth';

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, number, title, text, image, points, sort_order, created_at, updated_at
       FROM guide_sections
       ORDER BY sort_order ASC`
    );
    return NextResponse.json({ sections: result.rows }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } });
  } catch (err) { return serverError(err); }
}

export async function POST(request: NextRequest) {
  if (!requireAuth(request)) return unauthorized();
  try {
    const { number, title, text, image, points, sort_order } = await request.json();
    const result = await pool.query(
      `INSERT INTO guide_sections (number, title, text, image, points, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [number, title, text ?? null, image ?? null, JSON.stringify(points ?? []), sort_order ?? 0]
    );
    return NextResponse.json({ section: result.rows[0] }, { status: 201 });
  } catch (err) { return serverError(err); }
}
