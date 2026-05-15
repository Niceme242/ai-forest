import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth, unauthorized, serverError } from '@/lib/auth';

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, category, tag, date, title, excerpt, body,
              src, author_name, author_role, created_at, updated_at
       FROM articles
       ORDER BY created_at DESC`
    );
    return NextResponse.json({ articles: result.rows }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } });
  } catch (err) { return serverError(err); }
}

export async function POST(request: NextRequest) {
  if (!requireAuth(request)) return unauthorized();
  try {
    const { category, tag, date, title, excerpt, body, src, author_name, author_role } = await request.json();
    const result = await pool.query(
      `INSERT INTO articles (category, tag, date, title, excerpt, body, src, author_name, author_role)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [category, tag, date, title, excerpt, JSON.stringify(body), src, author_name, author_role]
    );
    return NextResponse.json({ article: result.rows[0] }, { status: 201 });
  } catch (err) { return serverError(err); }
}
