import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth, unauthorized, serverError } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAuth(request)) return unauthorized();
  try {
    const { step, title, text, sort_order } = await request.json();
    const result = await pool.query(
      `UPDATE workflow_steps
       SET step = $1, title = $2, text = $3, sort_order = $4, updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [step, title, text ?? null, sort_order ?? 0, params.id]
    );
    if (!result.rows.length) return NextResponse.json({ error: 'Étape introuvable' }, { status: 404 });
    return NextResponse.json({ step: result.rows[0] });
  } catch (err) { return serverError(err); }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAuth(request)) return unauthorized();
  try {
    const result = await pool.query('DELETE FROM workflow_steps WHERE id = $1 RETURNING id', [params.id]);
    if (!result.rows.length) return NextResponse.json({ error: 'Étape introuvable' }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (err) { return serverError(err); }
}
