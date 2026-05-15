import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth, unauthorized, serverError } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAuth(request)) return unauthorized();
  try {
    const { name, description, href, sort_order } = await request.json();
    const result = await pool.query(
      `UPDATE partners
       SET name = $1, description = $2, href = $3, sort_order = $4, updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [name, description ?? null, href ?? null, sort_order ?? 0, params.id]
    );
    if (!result.rows.length) return NextResponse.json({ error: 'Partenaire introuvable' }, { status: 404 });
    return NextResponse.json({ partner: result.rows[0] });
  } catch (err) { return serverError(err); }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAuth(request)) return unauthorized();
  try {
    const result = await pool.query('DELETE FROM partners WHERE id = $1 RETURNING id', [params.id]);
    if (!result.rows.length) return NextResponse.json({ error: 'Partenaire introuvable' }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (err) { return serverError(err); }
}
