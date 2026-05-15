import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth, unauthorized, serverError } from '@/lib/auth';

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, icon, accent, title, description, image, sort_order, created_at, updated_at
       FROM features ORDER BY sort_order ASC`
    );
    return NextResponse.json({ features: result.rows }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch (err) { return serverError(err); }
}

export async function POST(request: NextRequest) {
  if (!requireAuth(request)) return unauthorized();
  try {
    const { icon, accent, title, description, image, sort_order } = await request.json();
    const result = await pool.query(
      `INSERT INTO features (icon, accent, title, description, image, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [icon ?? '', accent ?? '', title, description ?? '', image ?? '', sort_order ?? 0]
    );
    return NextResponse.json({ feature: result.rows[0] }, { status: 201 });
  } catch (err) { return serverError(err); }
}
