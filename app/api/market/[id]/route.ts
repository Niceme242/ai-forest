import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth, unauthorized, serverError } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAuth(request)) return unauthorized();
  try {
    const { name, unit, price, trend, category, description, sort_order } = await request.json();
    const result = await pool.query(
      `UPDATE market_products
       SET name=$1, unit=$2, price=$3, trend=$4, category=$5, description=$6, sort_order=$7, updated_at=NOW()
       WHERE id=$8 RETURNING *`,
      [name, unit ?? 'kg', price, trend ?? 'stable', category ?? '', description ?? '', sort_order ?? 0, params.id]
    );
    if (!result.rows.length) return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 });
    return NextResponse.json({ product: result.rows[0] });
  } catch (err) { return serverError(err); }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAuth(request)) return unauthorized();
  try {
    const result = await pool.query('DELETE FROM market_products WHERE id=$1 RETURNING id', [params.id]);
    if (!result.rows.length) return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (err) { return serverError(err); }
}
