import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth, unauthorized, serverError } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAuth(request)) return unauthorized();
  try {
    const { icon, accent, title, description, image, sort_order } = await request.json();
    const result = await pool.query(
      `UPDATE features
       SET icon=$1, accent=$2, title=$3, description=$4, image=$5, sort_order=$6, updated_at=NOW()
       WHERE id=$7 RETURNING *`,
      [icon ?? '', accent ?? '', title, description ?? '', image ?? '', sort_order ?? 0, params.id]
    );
    if (!result.rows.length) return NextResponse.json({ error: 'Fonctionnalité introuvable' }, { status: 404 });
    return NextResponse.json({ feature: result.rows[0] });
  } catch (err) { return serverError(err); }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAuth(request)) return unauthorized();
  try {
    const result = await pool.query('DELETE FROM features WHERE id=$1 RETURNING id', [params.id]);
    if (!result.rows.length) return NextResponse.json({ error: 'Fonctionnalité introuvable' }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (err) { return serverError(err); }
}
