import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth, unauthorized, serverError } from '@/lib/auth';

export async function GET(_request: NextRequest, { params }: { params: { key: string } }) {
  try {
    const result = await pool.query('SELECT value FROM settings WHERE key = $1', [params.key]);
    if (!result.rows.length) return NextResponse.json({ error: 'Clé introuvable' }, { status: 404 });
    return NextResponse.json({ value: result.rows[0].value }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } });
  } catch (err) { return serverError(err); }
}

export async function PUT(request: NextRequest, { params }: { params: { key: string } }) {
  if (!requireAuth(request)) return unauthorized();
  try {
    const { value } = await request.json();
    const result = await pool.query(
      `INSERT INTO settings (key, value)
       VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
       RETURNING *`,
      [params.key, JSON.stringify(value)]
    );
    return NextResponse.json({ setting: result.rows[0] });
  } catch (err) { return serverError(err); }
}
