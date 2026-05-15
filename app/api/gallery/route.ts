import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth, unauthorized, serverError } from '@/lib/auth';

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, title, src, sort_order, created_at, updated_at
       FROM gallery_images
       ORDER BY sort_order ASC`
    );
    return NextResponse.json({ images: result.rows }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } });
  } catch (err) { return serverError(err); }
}

export async function POST(request: NextRequest) {
  if (!requireAuth(request)) return unauthorized();
  try {
    const { title, src, sort_order } = await request.json();
    const result = await pool.query(
      `INSERT INTO gallery_images (title, src, sort_order)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title ?? null, src, sort_order ?? 0]
    );
    return NextResponse.json({ image: result.rows[0] }, { status: 201 });
  } catch (err) { return serverError(err); }
}
