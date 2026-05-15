import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth, unauthorized, serverError } from '@/lib/auth';

export async function GET() {
  try {
    const result = await pool.query(`SELECT key, value, updated_at FROM settings ORDER BY key ASC`);
    const settings: Record<string, unknown> = {};
    for (const row of result.rows) {
      settings[row.key] = row.value;
    }
    return NextResponse.json({ settings });
  } catch (err) { return serverError(err); }
}

export async function PUT(request: NextRequest) {
  if (!requireAuth(request)) return unauthorized();
  try {
    const { key, value } = await request.json();
    if (!key) return NextResponse.json({ error: 'Clé requise' }, { status: 400 });
    const result = await pool.query(
      `INSERT INTO settings (key, value)
       VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
       RETURNING *`,
      [key, JSON.stringify(value)]
    );
    return NextResponse.json({ setting: result.rows[0] });
  } catch (err) { return serverError(err); }
}
