import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth, unauthorized, serverError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  if (!requireAuth(request)) return unauthorized();
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type   = searchParams.get('type');
    let query  = 'SELECT * FROM messages';
    const conditions: string[] = [];
    const values: string[]     = [];
    let   idx = 1;
    if (status) { conditions.push(`status = $${idx++}`); values.push(status); }
    if (type)   { conditions.push(`type = $${idx++}`);   values.push(type);   }
    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, values);
    const unreadResult = await pool.query("SELECT COUNT(*) FROM messages WHERE status = 'unread'");
    return NextResponse.json({ messages: result.rows, unreadCount: parseInt(unreadResult.rows[0].count) });
  } catch (err) { return serverError(err); }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, name, organization, email, partnershipType, messageText } = body;
    if (!type || !email) return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    const result = await pool.query(
      `INSERT INTO messages (type, name, organization, email, partnership_type, message_text) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [type, name ?? null, organization ?? null, email, partnershipType ?? null, messageText ?? null]
    );
    return NextResponse.json({ message: result.rows[0] }, { status: 201 });
  } catch (err) { return serverError(err); }
}
