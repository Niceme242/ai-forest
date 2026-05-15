'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { FeatureCard } from '../../components/FeatureCard';
import { DownloadCta } from '../../components/DownloadCta';
import { DEFAULT_FEATURES, type Feature } from '../../lib/siteStore';

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>(DEFAULT_FEATURES);

  useEffect(() => {
    fetch('/api/features').then(r => r.json()).then(d => { if (d.features?.length) setFeatures(d.features); }).catch(() => {});
  }, []);

  return (
    <div className="relative overflow-hidden bg-green-50 text-gray-900">
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-green-950 px-6 pt-28 pb-20 sm:px-8 lg:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.22),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.15),_transparent_35%)]" />
          <div className="relative mx-auto max-w-7xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-green-400">Fonctionnalités</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-bold leading-tight tracking-[-0.03em] text-white sm:text-6xl">
              Les outils essentiels pour piloter vos cultures.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-green-200">
              Moins de bruit, plus d'actions utiles pour chaque parcelle.
            </p>
          </div>
        </section>

        <section className="bg-white px-6 py-20 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {features.map(feature => (
                <FeatureCard key={feature.id} {...feature} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-green-50 px-6 py-20 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="mx-auto grid max-w-7xl gap-8 rounded-[2rem] border border-green-200 bg-white p-8 shadow-sm lg:grid-cols-[1fr_auto] lg:items-center"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-950">Prêt à essayer ?</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600">Téléchargez l'application ou continuez vers le monitoring IA.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <DownloadCta label="Télécharger" />
              <Link href="/monitoring" className="inline-flex items-center justify-center rounded-full border border-green-200 bg-green-50 px-6 py-3 text-sm font-semibold text-green-800 transition hover:bg-green-100">
                IA & Monitoring
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
