import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth, unauthorized, serverError } from '@/lib/auth';

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, name, description, href, sort_order, created_at, updated_at
       FROM partners
       ORDER BY sort_order ASC`
    );
    return NextResponse.json({ partners: result.rows }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } });
  } catch (err) { return serverError(err); }
}

export async function POST(request: NextRequest) {
  if (!requireAuth(request)) return unauthorized();
  try {
    const { name, description, href, sort_order } = await request.json();
    const result = await pool.query(
      `INSERT INTO partners (name, description, href, sort_order)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, description ?? null, href ?? null, sort_order ?? 0]
    );
    return NextResponse.json({ partner: result.rows[0] }, { status: 201 });
  } catch (err) { return serverError(err); }
}
