import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth, unauthorized, serverError } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAuth(req)) return unauthorized();
  try {
    const { label, target, suffix, sort_order } = await req.json();
    const r = await pool.query(
      'UPDATE monitoring_stats SET label=$1,target=$2,suffix=$3,sort_order=$4,updated_at=NOW() WHERE id=$5 RETURNING *',
      [label, target ?? 0, suffix ?? '+', sort_order ?? 0, params.id]
    );
    if (!r.rows.length) return NextResponse.json({ error: 'Introuvable' }, { status: 404 });
    return NextResponse.json({ stat: r.rows[0] });
  } catch (err) { return serverError(err); }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAuth(req)) return unauthorized();
  try {
    const r = await pool.query('DELETE FROM monitoring_stats WHERE id=$1 RETURNING id', [params.id]);
    if (!r.rows.length) return NextResponse.json({ error: 'Introuvable' }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (err) { return serverError(err); }
}
