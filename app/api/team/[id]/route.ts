import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth, unauthorized, serverError } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAuth(request)) return unauthorized();
  try {
    const { name, role, position, description, src, sort_order } = await request.json();
    const result = await pool.query(
      `UPDATE team_members
       SET name = $1, role = $2, position = $3, description = $4, src = $5, sort_order = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [name, role, position ?? '', description ?? null, src ?? null, sort_order ?? 0, params.id]
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
