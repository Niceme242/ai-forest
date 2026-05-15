import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth, unauthorized, serverError } from '@/lib/auth';

export async function GET() {
  try {
    const r = await pool.query('SELECT * FROM monitoring_cards ORDER BY sort_order ASC');
    return NextResponse.json({ cards: r.rows }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } });
  } catch (err) { return serverError(err); }
}

export async function POST(req: NextRequest) {
  if (!requireAuth(req)) return unauthorized();
  try {
    const { label, title, value, sort_order } = await req.json();
    const r = await pool.query(
      'INSERT INTO monitoring_cards (label, title, value, sort_order) VALUES ($1,$2,$3,$4) RETURNING *',
      [label ?? '', title, value, sort_order ?? 0]
    );
    return NextResponse.json({ card: r.rows[0] }, { status: 201 });
  } catch (err) { return serverError(err); }
}
