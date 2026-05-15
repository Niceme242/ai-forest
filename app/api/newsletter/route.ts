import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { serverError } from '../../../lib/apiAuth';

// Point d'entrée public — abonnement newsletter
export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email requis' }, { status: 400 });

    // Évite les doublons
    const existing = await pool.query('SELECT id FROM messages WHERE type=$1 AND email=$2', ['newsletter', email]);
    if (existing.rows.length) return NextResponse.json({ ok: true, duplicate: true });

    await pool.query(
      "INSERT INTO messages (type, email, status) VALUES ('newsletter', $1, 'unread')",
      [email]
    );
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) { return serverError(e); }
}
