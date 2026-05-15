import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth, unauthorized, serverError } from '@/lib/auth';

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, label, href, value, sort_order, created_at, updated_at
       FROM community_links ORDER BY sort_order ASC`
    );
    return NextResponse.json({ links: result.rows }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch (err) { return serverError(err); }
}

export async function POST(request: NextRequest) {
  if (!requireAuth(request)) return unauthorized();
  try {
    const { label, href, value, sort_order } = await request.json();
    const result = await pool.query(
      `INSERT INTO community_links (label, href, value, sort_order)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [label, href, value ?? '', sort_order ?? 0]
    );
    return NextResponse.json({ link: result.rows[0] }, { status: 201 });
  } catch (err) { return serverError(err); }
}
