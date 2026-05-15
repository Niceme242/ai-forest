import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth, unauthorized, serverError } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAuth(request)) return unauthorized();
  try {
    const { number, title, text, image, points, sort_order } = await request.json();
    const result = await pool.query(
      `UPDATE guide_sections
       SET number = $1, title = $2, text = $3, image = $4, points = $5, sort_order = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [number, title, text ?? null, image ?? null, JSON.stringify(points ?? []), sort_order ?? 0, params.id]
    );
    if (!result.rows.length) return NextResponse.json({ error: 'Section introuvable' }, { status: 404 });
    return NextResponse.json({ section: result.rows[0] });
  } catch (err) { return serverError(err); }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAuth(request)) return unauthorized();
  try {
    const result = await pool.query('DELETE FROM guide_sections WHERE id = $1 RETURNING id', [params.id]);
    if (!result.rows.length) return NextResponse.json({ error: 'Section introuvable' }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (err) { return serverError(err); }
}
