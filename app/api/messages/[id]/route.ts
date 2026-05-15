import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth, unauthorized, serverError } from '@/lib/auth';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAuth(request)) return unauthorized();
  try {
    const { status } = await request.json();
    if (!['unread', 'read', 'archived'].includes(status)) return NextResponse.json({ error: 'Statut invalide' }, { status: 400 });
    const result = await pool.query('UPDATE messages SET status = $1 WHERE id = $2 RETURNING *', [status, params.id]);
    if (!result.rows.length) return NextResponse.json({ error: 'Message introuvable' }, { status: 404 });
    return NextResponse.json({ message: result.rows[0] });
  } catch (err) { return serverError(err); }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAuth(request)) return unauthorized();
  try {
    const result = await pool.query('DELETE FROM messages WHERE id = $1 RETURNING id', [params.id]);
    if (!result.rows.length) return NextResponse.json({ error: 'Message introuvable' }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (err) { return serverError(err); }
}
