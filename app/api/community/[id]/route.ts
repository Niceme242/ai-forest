import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth, unauthorized, serverError } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAuth(request)) return unauthorized();
  try {
    const { label, href, value, sort_order } = await request.json();
    const result = await pool.query(
      `UPDATE community_links
       SET label=$1, href=$2, value=$3, sort_order=$4, updated_at=NOW()
       WHERE id=$5 RETURNING *`,
      [label, href, value ?? '', sort_order ?? 0, params.id]
    );
    if (!result.rows.length) return NextResponse.json({ error: 'Lien introuvable' }, { status: 404 });
    return NextResponse.json({ link: result.rows[0] });
  } catch (err) { return serverError(err); }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAuth(request)) return unauthorized();
  try {
    const result = await pool.query('DELETE FROM community_links WHERE id=$1 RETURNING id', [params.id]);
    if (!result.rows.length) return NextResponse.json({ error: 'Lien introuvable' }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (err) { return serverError(err); }
}
