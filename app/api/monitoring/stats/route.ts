import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth, unauthorized, serverError } from '@/lib/auth';

export async function GET() {
  try {
    const r = await pool.query('SELECT * FROM monitoring_stats ORDER BY sort_order ASC');
    return NextResponse.json({ stats: r.rows }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } });
  } catch (err) { return serverError(err); }
}

export async function POST(req: NextRequest) {
  if (!requireAuth(req)) return unauthorized();
  try {
    const { label, target, suffix, sort_order } = await req.json();
    const r = await pool.query(
      'INSERT INTO monitoring_stats (label, target, suffix, sort_order) VALUES ($1,$2,$3,$4) RETURNING *',
      [label, target ?? 0, suffix ?? '+', sort_order ?? 0]
    );
    return NextResponse.json({ stat: r.rows[0] }, { status: 201 });
  } catch (err) { return serverError(err); }
}
