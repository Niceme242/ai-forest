import { NextResponse } from 'next/server';

export function requireAuth(request: Request): boolean {
  const auth = request.headers.get('Authorization');
  const token = auth?.replace('Bearer ', '').trim();
  return !!token && token === process.env.ADMIN_SECRET;
}

export function unauthorized() {
  return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
}

export function serverError(error: unknown) {
  console.error(error);
  return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
}
