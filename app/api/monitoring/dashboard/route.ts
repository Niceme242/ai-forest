import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth, unauthorized, serverError } from '@/lib/auth';

export async function GET() {
  try {
    const r = await pool.query('SELECT * FROM dashboard_items ORDER BY sort_order ASC');
    return NextResponse.json({ items: r.rows }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } });
  } catch (err) { return serverError(err); }
}

export async function POST(req: NextRequest) {
  if (!requireAuth(req)) return unauthorized();
  try {
    const { label, value, description, sort_order } = await req.json();
    const r = await pool.query(
      'INSERT INTO dashboard_items (label, value, description, sort_order) VALUES ($1,$2,$3,$4) RETURNING *',
      [label ?? '', value ?? '', description ?? '', sort_order ?? 0]
    );
    return NextResponse.json({ item: r.rows[0] }, { status: 201 });
  } catch (err) { return serverError(err); }
}
