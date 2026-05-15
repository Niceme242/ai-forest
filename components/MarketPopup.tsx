'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { DEFAULT_MARKET, type MarketProduct } from '../lib/siteStore';

const POST_JSON = { 'Content-Type': 'application/json' };

const trendIcon: Record<string, { icon: string; color: string }> = {
  up:     { icon: '↑', color: 'text-green-600' },
  down:   { icon: '↓', color: 'text-red-500' },
  stable: { icon: '→', color: 'text-gray-400' },
};

const unitOptions = ['kg', 'tonne', 'sac (50 kg)', 'régime', 'unité', 'litre'];

export function MarketPopup() {
  const [open, setOpen]           = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [products, setProducts]   = useState<MarketProduct[]>(DEFAULT_MARKET);
  const wrapperRef                = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/market').then(r => r.json()).then(d => { if (d.products?.length) setProducts(d.products); }).catch(() => {});
  }, []);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form    = e.currentTarget;
    const product = (form.elements.namedItem('product') as HTMLInputElement)?.value;
    const unit    = (form.elements.namedItem('unit') as HTMLSelectElement)?.value;
    const price   = (form.elements.namedItem('price') as HTMLInputElement)?.value;
    const region  = (form.elements.namedItem('region') as HTMLInputElement)?.value;
    await fetch('/api/messages', {
      method: 'POST',
      headers: POST_JSON,
      body: JSON.stringify({ type: 'newsletter', email: 'report@market', message_text: `${product} — ${price} FCFA/${unit} — ${region}` }),
    }).catch(() => {});
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div ref={wrapperRef} className="relative">
      {/* Trigger — visible on all screen sizes */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-800 transition hover:bg-green-100"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
        <span>Marché</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-green-100 bg-white shadow-2xl shadow-green-950/15">
          <div className="flex items-center justify-between border-b border-green-100 px-4 py-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-green-600">Prix du marché</p>
              <p className="mt-0.5 text-[10px] text-gray-400">Actualisé par l'admin</p>
            </div>
            <Link href="/market" onClick={() => setOpen(false)} className="text-[10px] font-semibold text-green-700 hover:text-green-600">
              Voir tout →
            </Link>
          </div>

          <div className="max-h-52 divide-y divide-green-50 overflow-y-auto">
            {products.map(p => {
              const t = trendIcon[p.trend] ?? trendIcon.stable;
              return (
                <div key={p.id} className="flex items-center justify-between px-4 py-2.5">
                  <div>
                    <span className="text-sm font-semibold text-gray-900">{p.name}</span>
                    {p.category && <span className="ml-1.5 text-[10px] text-gray-400">{p.category}</span>}
                    <p className="text-[10px] text-gray-400">/{p.unit}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-900">{p.price}</span>
                    <span className={`ml-1 text-xs font-bold ${t.color}`}>{t.icon}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-green-100 px-4 py-3">
            {submitted ? (
              <p className="text-center text-sm font-semibold text-green-700">Merci pour votre signalement !</p>
            ) : (
              <>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-green-600">Signaler un prix</p>
                <form onSubmit={handleSubmit} className="space-y-2">
                  <input name="product" required placeholder="Produit" className="w-full rounded-xl border border-green-100 bg-green-50 px-3 py-2 text-xs text-gray-800 outline-none focus:border-green-400" />
                  <div className="grid grid-cols-2 gap-2">
                    <select name="unit" className="rounded-xl border border-green-100 bg-green-50 px-3 py-2 text-xs text-gray-800 outline-none focus:border-green-400">
                      {unitOptions.map(u => <option key={u}>{u}</option>)}
                    </select>
                    <input name="price" required placeholder="Prix (FCFA)" className="rounded-xl border border-green-100 bg-green-50 px-3 py-2 text-xs text-gray-800 outline-none focus:border-green-400" />
                  </div>
                  <input name="region" placeholder="Région / Marché" className="w-full rounded-xl border border-green-100 bg-green-50 px-3 py-2 text-xs text-gray-800 outline-none focus:border-green-400" />
                  <button type="submit" disabled={loading} className="w-full rounded-xl bg-green-950 py-2 text-xs font-bold text-white transition hover:bg-green-800 disabled:opacity-60">
                    {loading ? 'Envoi…' : 'Signaler'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
