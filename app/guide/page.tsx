'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DownloadCta } from '../../components/DownloadCta';
import { Footer } from '../../components/Footer';
import { Navbar } from '../../components/Navbar';
import { DEFAULT_GUIDE, type GuideSection } from '../../lib/siteStore';

const faqs = [
  {
    question: 'Sur quelles plateformes est disponible AI Forest Planner ?',
    answer:
      'AI Forest Planner est disponible sur Google Play. Une version iOS est prévue dans les prochaines évolutions.',
  },
  {
    question: "L'application est-elle gratuite ?",
    answer:
      'Les fonctionnalités de base comme le tableau de bord, la météo, les cultures populaires et les actualités sont gratuites. Certaines fonctionnalités avancées peuvent nécessiter une offre premium.',
  },
  {
    question: "L'application fonctionne-t-elle avec une connexion limitée ?",
    answer:
      'Oui, partiellement. Les données déjà chargées restent accessibles hors ligne. Le Chat AI, la mise à jour météo et la carte interactive nécessitent une connexion internet.',
  },
  {
    question: 'Mes données agricoles sont-elles partagées ?',
    answer:
      'Non. Les données agricoles personnelles ne sont pas vendues ni partagées sans consentement explicite. Les données agrégées peuvent aider à améliorer le modèle IA.',
  },
];

const glossary = [
  ['IA', "Technologie qui analyse les données et aide à produire des conseils intelligents."],
  ['Chat AI', "Interface de conversation avec l'assistant agricole intelligent."],
  ['Recommandations IA', 'Conseils personnalisés selon le profil, la localisation et les cultures.'],
  ['Marketplace', 'Place de marché numérique pour acheter et vendre des produits agricoles.'],
  ['Carte agricole', 'Visualisation cartographique des zones de culture et opportunités.'],
  ['DAS', 'Data Analytic Solutions, société développeuse de AI Forest Planner à Brazzaville.'],
];

export default function GuidePage() {
  const [guideSections, setGuideSections] = useState<GuideSection[]>(DEFAULT_GUIDE);

  useEffect(() => {
    fetch('/api/guide').then(r => r.json()).then(d => { if (d.sections?.length) setGuideSections(d.sections); }).catch(() => {});
  }, []);

  return (
    <div className="relative overflow-hidden bg-green-50 text-gray-900">
      <Navbar />
      <main className="relative">
        <section className="relative overflow-hidden bg-green-950 px-6 pt-28 pb-24 sm:px-8 lg:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,197,94,0.20),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.12),_transparent_35%)]" />
          <div className="absolute right-16 top-32 h-48 w-48 rounded-full bg-green-400/10 blur-3xl" />

          <div className="relative mx-auto max-w-5xl text-center space-y-8">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block rounded-full border border-green-800 bg-green-900/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.4em] text-green-400"
            >
              Guide d'utilisation
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl font-bold text-white leading-tight tracking-[-0.03em] sm:text-6xl"
            >
              Prenez en main Ai-Forest Planner en quelques étapes
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mx-auto max-w-2xl text-lg text-green-200 leading-8"
            >
              Tout ce qu'il faut savoir pour configurer votre compte, analyser vos parcelles et
              tirer le meilleur parti de l'intelligence artificielle agricole.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:items-center"
            >
              <DownloadCta label="Télécharger l'app" />
              <Link
                href="/community"
                className="inline-flex items-center justify-center rounded-full border border-green-700 bg-green-900/70 px-6 py-3 text-sm font-semibold text-green-200 transition hover:bg-green-800 cursor-pointer"
              >
                Rejoindre la communauté
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="bg-white px-6 py-20 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-green-600">
                Contenu du guide
              </p>
              <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-gray-950">
                Les bases pour utiliser l'application sur le terrain.
              </h2>
            </div>

            <div className="space-y-10">
              {guideSections.map((section, index) => (
                <motion.article
                  key={section.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.04 }}
                  className={`overflow-hidden rounded-[2rem] border border-green-100 bg-white shadow-sm lg:grid lg:grid-cols-2 ${
                    index % 2 === 1 ? 'lg:[&_.guide-image]:order-2' : ''
                  }`}
                >
                  <div className="guide-image relative min-h-[280px]">
                    <img
                      src={section.image}
                      alt={section.title}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-950/60 via-green-950/10 to-transparent" />
                    <div className="absolute left-5 top-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sm font-black text-green-700 shadow-lg shadow-green-950/20">
                      {section.number}
                    </div>
                  </div>

                  <div className="flex flex-col justify-center p-6 text-center lg:p-8 lg:text-left">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-green-600">
                      {section.number}
                    </p>
                    <h3 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-950">
                      {section.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-gray-600">{section.text}</p>
                    <ul className="mx-auto mt-5 max-w-xl space-y-3 text-left lg:mx-0">
                      {section.points.map((point) => (
                        <li key={point} className="flex gap-3 text-sm leading-6 text-gray-700">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green-600" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-green-50 px-6 py-20 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="text-center lg:text-left">
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-green-600">FAQ</p>
              <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-gray-950">
                Questions fréquentes du guide.
              </h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="rounded-2xl border border-green-200 bg-white p-6 shadow-sm"
                >
                  <summary className="cursor-pointer font-bold text-gray-950">{faq.question}</summary>
                  <p className="mt-4 text-sm leading-7 text-gray-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-20 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-green-600">
                Glossaire
              </p>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-950">
                Les termes à connaître.
              </h2>
            </div>
            <div className="overflow-hidden rounded-[2rem] border border-green-200 bg-white">
              {glossary.map(([term, definition], index) => (
                <div
                  key={term}
                  className={`grid gap-3 px-6 py-5 md:grid-cols-[0.35fr_0.65fr] ${
                    index % 2 === 0 ? 'bg-green-50' : 'bg-white'
                  }`}
                >
                  <p className="font-bold text-green-700">{term}</p>
                  <p className="text-sm leading-7 text-gray-600">{definition}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
