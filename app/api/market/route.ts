import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth, unauthorized, serverError } from '@/lib/auth';

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, name, unit, price, trend, category, description, sort_order, created_at, updated_at
       FROM market_products ORDER BY sort_order ASC`
    );
    return NextResponse.json({ products: result.rows }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch (err) { return serverError(err); }
}

export async function POST(request: NextRequest) {
  if (!requireAuth(request)) return unauthorized();
  try {
    const { name, unit, price, trend, category, description, sort_order } = await request.json();
    const result = await pool.query(
      `INSERT INTO market_products (name, unit, price, trend, category, description, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, unit ?? 'kg', price, trend ?? 'stable', category ?? '', description ?? '', sort_order ?? 0]
    );
    return NextResponse.json({ product: result.rows[0] }, { status: 201 });
  } catch (err) { return serverError(err); }
}
