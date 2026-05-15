import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth, unauthorized, serverError } from '@/lib/auth';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await pool.query(
      `SELECT id, category, tag, date, title, excerpt, body,
              src, author_name, author_role, created_at, updated_at
       FROM articles WHERE id = $1`,
      [params.id]
    );
    if (!result.rows.length) return NextResponse.json({ error: 'Article introuvable' }, { status: 404 });
    return NextResponse.json({ article: result.rows[0] });
  } catch (err) { return serverError(err); }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAuth(request)) return unauthorized();
  try {
    const { category, tag, date, title, excerpt, body, src, author_name, author_role } = await request.json();
    const result = await pool.query(
      `UPDATE articles
       SET category = $1, tag = $2, date = $3, title = $4, excerpt = $5,
           body = $6, src = $7, author_name = $8, author_role = $9, updated_at = NOW()
       WHERE id = $10
       RETURNING *`,
      [category, tag, date, title, excerpt, JSON.stringify(body), src, author_name, author_role, params.id]
    );
    if (!result.rows.length) return NextResponse.json({ error: 'Article introuvable' }, { status: 404 });
    return NextResponse.json({ article: result.rows[0] });
  } catch (err) { return serverError(err); }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAuth(request)) return unauthorized();
  try {
    const result = await pool.query('DELETE FROM articles WHERE id = $1 RETURNING id', [params.id]);
    if (!result.rows.length) return NextResponse.json({ error: 'Article introuvable' }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (err) { return serverError(err); }
}
