import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { serverError } from '../../../lib/apiAuth';

// Point d'entrée public — formulaire "Devenir partenaire"
export async function POST(req: Request) {
  try {
    const b = await req.json();
    if (!b.email) return NextResponse.json({ error: 'Email requis' }, { status: 400 });

    await pool.query(`
      INSERT INTO messages (type, name, organization, email, partnership_type, message_text, status)
      VALUES ('partner_request', $1, $2, $3, $4, $5, 'unread')
    `, [b.name ?? null, b.organization ?? null, b.email, b.partnershipType ?? null, b.messageText ?? null]);

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) { return serverError(e); }
}
