'use client';

import { useState, useEffect, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Footer } from '../../components/Footer';
import { Navbar } from '../../components/Navbar';
import { DownloadCta } from '../../components/DownloadCta';
import { DEFAULT_MARKET, type MarketProduct } from '../../lib/siteStore';

const POST_JSON = { 'Content-Type': 'application/json' };

const trendIcon: Record<string, { icon: string; label: string; color: string; bg: string }> = {
  up:     { icon: '↑', label: 'En hausse',  color: 'text-green-700', bg: 'bg-green-100' },
  down:   { icon: '↓', label: 'En baisse',  color: 'text-red-600',   bg: 'bg-red-100'   },
  stable: { icon: '→', label: 'Stable',     color: 'text-gray-500',  bg: 'bg-gray-100'  },
};

const unitOptions = ['kg', 'tonne', 'sac (50 kg)', 'régime', 'unité', 'litre'];

export default function MarketPage() {
  const [products, setProducts]     = useState<MarketProduct[]>(DEFAULT_MARKET);
  const [activeCategory, setActive] = useState('Tous');
  const [submitted, setSubmitted]   = useState(false);
  const [loading, setLoading]       = useState(false);

  useEffect(() => {
    fetch('/api/market').then(r => r.json()).then(d => { if (d.products?.length) setProducts(d.products); }).catch(() => {});
  }, []);

  const categories = ['Tous', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];
  const filtered = activeCategory === 'Tous' ? products : products.filter(p => p.category === activeCategory);

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
    form.reset();
  };

  return (
    <div className="relative overflow-hidden bg-green-50 text-gray-900">
      <Navbar />
      <main>

        {/* HERO */}
        <section className="bg-green-950 px-6 pb-20 pt-36 text-white sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl text-center">
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="text-xs font-bold uppercase tracking-[0.32em] text-green-300">
              Marché agricole
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.07 }}
              className="mx-auto mt-4 max-w-3xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              Prix du marché en temps réel.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.14 }}
              className="mx-auto mt-5 max-w-2xl text-base leading-8 text-green-200">
              Consultez les prix agricoles actualisés par notre équipe et signalez les prix de votre région pour aider la communauté.
            </motion.p>
          </div>
        </section>

        {/* CATEGORY FILTERS */}
        <section className="sticky top-16 z-30 border-b border-green-100 bg-white/95 px-6 py-4 backdrop-blur-xl sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2">
            {categories.map(cat => (
              <button key={cat} type="button" onClick={() => setActive(cat)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${activeCategory === cat ? 'bg-green-950 text-white shadow-md' : 'border border-green-200 bg-green-50 text-gray-700 hover:border-green-400 hover:bg-green-100'}`}>
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* PRICE GRID */}
        <section className="bg-white px-6 py-16 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p, i) => {
                const t = trendIcon[p.trend] ?? trendIcon.stable;
                return (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.05 }}
                    className="flex flex-col gap-3 rounded-[1.5rem] border border-green-100 bg-green-50 p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-base font-extrabold text-gray-950">{p.name}</p>
                        {p.category && <p className="mt-0.5 text-xs text-green-600 font-semibold">{p.category}</p>}
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${t.bg} ${t.color}`}>
                        {t.icon} {t.label}
                      </span>
                    </div>
                    <div className="mt-auto">
                      <p className="text-2xl font-black text-gray-950">{p.price}</p>
                      <p className="text-xs text-gray-500">par {p.unit}</p>
                    </div>
                    {p.description && <p className="text-xs leading-5 text-gray-500">{p.description}</p>}
                  </motion.div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="py-24 text-center">
                <p className="text-4xl">🌾</p>
                <p className="mt-4 text-lg font-bold text-gray-950">Aucun produit dans cette catégorie.</p>
              </div>
            )}
          </div>
        </section>

        {/* REPORT FORM */}
        <section className="bg-green-50 px-6 py-20 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 rounded-[2rem] border border-green-200 bg-white p-8 shadow-sm lg:grid-cols-[1fr_1fr] lg:items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.32em] text-green-600">Signalement</p>
                <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-950">Signalez un prix de votre marché.</h2>
                <p className="mt-4 text-sm leading-7 text-gray-600">
                  Vous constatez un prix différent dans votre région ? Partagez-le pour aider les autres agriculteurs à mieux négocier.
                </p>
                <div className="mt-6">
                  <DownloadCta label="Télécharger l'app" variant="secondary" />
                </div>
              </div>

              <div>
                {submitted ? (
                  <div className="flex h-full items-center justify-center rounded-[1.5rem] bg-green-50 p-8 text-center">
                    <div>
                      <p className="text-3xl">✓</p>
                      <p className="mt-3 text-base font-extrabold text-green-800">Merci pour votre signalement !</p>
                      <p className="mt-2 text-sm text-gray-500">Notre équipe va vérifier et mettre à jour les prix.</p>
                      <button onClick={() => setSubmitted(false)} className="mt-5 rounded-full border border-green-200 px-5 py-2.5 text-sm font-semibold text-green-700 hover:bg-green-50">
                        Faire un autre signalement
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-gray-600">Produit *</label>
                      <input name="product" required placeholder="ex: Maïs, Tomate, Manioc…"
                        className="w-full rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-gray-600">Unité</label>
                        <select name="unit" className="w-full rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm outline-none focus:border-green-500">
                          {unitOptions.map(u => <option key={u}>{u}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-gray-600">Prix (FCFA) *</label>
                        <input name="price" required placeholder="ex: 350"
                          className="w-full rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100" />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-gray-600">Région / Marché</label>
                      <input name="region" placeholder="ex: Marché Total, Brazzaville"
                        className="w-full rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100" />
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full rounded-full bg-green-950 py-3 text-sm font-bold text-white shadow-md transition hover:bg-green-800 disabled:opacity-60">
                      {loading ? 'Envoi en cours…' : 'Envoyer le signalement'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
