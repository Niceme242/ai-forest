'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DownloadCta } from '../../components/DownloadCta';
import { Footer } from '../../components/Footer';
import { Navbar } from '../../components/Navbar';
import { DEFAULT_COMMUNITY_LINKS, type CommunityLink } from '../../lib/siteStore';

export default function CommunityPage() {
  const [communityLinks, setCommunityLinks] = useState<CommunityLink[]>(DEFAULT_COMMUNITY_LINKS);

  useEffect(() => {
    fetch('/api/community').then(r => r.json()).then(d => { if (d.links?.length) setCommunityLinks(d.links); }).catch(() => {});
  }, []);

  return (
    <div className="relative bg-green-50 text-gray-900">
      <Navbar />
      <main className="relative min-h-screen overflow-hidden px-6 pt-28 pb-10 text-white sm:px-8 lg:px-10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=1080&fit=crop&crop=center)' }}
        />
        <div className="absolute inset-0 bg-green-950/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-green-950/30 via-green-950/10 to-green-950/70" />

        {/* Info cards — desktop only */}
        {[
          { position: 'left-10 top-32',    label: 'Accès',      title: 'Espace producteurs', text: 'Retrouvez vos parcelles, alertes et discussions agricoles.' },
          { position: 'right-10 top-32',   label: 'Compte',     title: 'Identifiants app',   text: 'Utilisez les mêmes identifiants AI-Forest Planner.' },
          { position: 'bottom-12 left-10', label: 'Mobile',     title: 'Créer un compte',    text: "La création de compte se fait depuis l'application." },
          { position: 'bottom-12 right-10',label: 'Communauté', title: 'Support terrain',    text: 'Échangez avec producteurs, agronomes et coopératives.' },
        ].map(card => (
          <motion.div key={card.title} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
            className={`pointer-events-none absolute hidden max-w-[230px] rounded-2xl border border-white/15 bg-white/12 p-4 text-white shadow-2xl backdrop-blur-xl lg:block ${card.position}`}>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-green-200">{card.label}</p>
            <h2 className="mt-3 text-lg font-bold leading-tight">{card.title}</h2>
            <p className="mt-2 text-xs leading-5 text-green-50/85">{card.text}</p>
          </motion.div>
        ))}

        <section className="relative mx-auto flex min-h-[calc(100vh-9rem)] max-w-7xl items-center justify-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}
            className="w-full max-w-md rounded-[2rem] border border-white/20 bg-white/95 p-6 text-gray-950 shadow-2xl shadow-green-950/50 backdrop-blur-xl sm:p-8">

            <div className="mb-7 text-center">
              <span className="mx-auto inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl shadow-lg shadow-green-600/30">
                <img src="/logo.png" alt="Ai-Forest Planner" className="h-full w-full object-cover" />
              </span>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.32em] text-green-600">Communauté</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950">Connectez-vous</h1>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Connectez-vous avec vos identifiants AI-Forest Planner ou créez un compte depuis l'application.
              </p>
            </div>

            <form className="space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-gray-800">Email ou téléphone</span>
                <input type="text" placeholder="ex: awa@email.com"
                  className="mt-2 w-full rounded-2xl border border-green-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-gray-800">Mot de passe</span>
                <input type="password" placeholder="Votre mot de passe"
                  className="mt-2 w-full rounded-2xl border border-green-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100" />
              </label>

              <div className="flex items-center justify-between gap-3 text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" className="h-4 w-4 rounded border-green-300 text-green-600" />
                  Se souvenir
                </label>
                <Link href="/guide" className="font-semibold text-green-700 hover:text-green-600">Besoin d'aide ?</Link>
              </div>

              <button type="submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-600/25 transition hover:bg-green-500">
                Se connecter
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-4">
              <p className="text-sm font-semibold text-gray-950">Pas encore de compte ?</p>
              <p className="mt-1 text-xs leading-5 text-gray-600">Téléchargez l'application pour créer votre profil producteur.</p>
              <div className="mt-4">
                <DownloadCta label="Télécharger l'application" variant="secondary" />
              </div>
            </div>

            {/* Community links — from DB */}
            {communityLinks.length > 0 && (
              <div className="mt-5 border-t border-green-100 pt-5">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-green-600">Communautés</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {communityLinks.map(item => (
                    <a key={item.id} href={item.href} target="_blank" rel="noreferrer"
                      className="rounded-2xl border border-green-100 bg-white px-4 py-3 transition hover:border-green-300 hover:bg-green-50">
                      <span className="block text-sm font-bold text-gray-950">{item.label}</span>
                      {item.value && <span className="mt-1 block text-xs text-gray-500">{item.value}</span>}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
