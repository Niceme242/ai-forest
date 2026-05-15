import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth, unauthorized, serverError } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAuth(request)) return unauthorized();
  try {
    const { name, role, description, src, sort_order } = await request.json();
    const result = await pool.query(
      `UPDATE team_members
       SET name = $1, role = $2, description = $3, src = $4, sort_order = $5, updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [name, role, description ?? null, src ?? null, sort_order ?? 0, params.id]
    );
    if (!result.rows.length) return NextResponse.json({ error: 'Membre introuvable' }, { status: 404 });
    return NextResponse.json({ member: result.rows[0] });
  } catch (err) { return serverError(err); }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAuth(request)) return unauthorized();
  try {
    const result = await pool.query('DELETE FROM team_members WHERE id = $1 RETURNING id', [params.id]);
    if (!result.rows.length) return NextResponse.json({ error: 'Membre introuvable' }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (err) { return serverError(err); }
}
