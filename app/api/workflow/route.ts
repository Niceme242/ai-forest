import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth, unauthorized, serverError } from '@/lib/auth';

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, step, title, text, sort_order, created_at, updated_at
       FROM workflow_steps
       ORDER BY sort_order ASC`
    );
    return NextResponse.json({ steps: result.rows }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } });
  } catch (err) { return serverError(err); }
}

export async function POST(request: NextRequest) {
  if (!requireAuth(request)) return unauthorized();
  try {
    const { step, title, text, sort_order } = await request.json();
    const result = await pool.query(
      `INSERT INTO workflow_steps (step, title, text, sort_order)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [step, title, text ?? null, sort_order ?? 0]
    );
    return NextResponse.json({ step: result.rows[0] }, { status: 201 });
  } catch (err) { return serverError(err); }
}
