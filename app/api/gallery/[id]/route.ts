import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth, unauthorized, serverError } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAuth(request)) return unauthorized();
  try {
    const { title, src, sort_order } = await request.json();
    const result = await pool.query(
      `UPDATE gallery_images
       SET title = $1, src = $2, sort_order = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [title ?? null, src, sort_order ?? 0, params.id]
    );
    if (!result.rows.length) return NextResponse.json({ error: 'Image introuvable' }, { status: 404 });
    return NextResponse.json({ image: result.rows[0] });
  } catch (err) { return serverError(err); }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAuth(request)) return unauthorized();
  try {
    const result = await pool.query('DELETE FROM gallery_images WHERE id = $1 RETURNING id', [params.id]);
    if (!result.rows.length) return NextResponse.json({ error: 'Image introuvable' }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (err) { return serverError(err); }
}
