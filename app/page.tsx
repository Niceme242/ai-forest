'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DownloadCta } from '../components/DownloadCta';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { TeamPartners } from '../components/TeamPartners';
import { DEFAULT_GALLERY, DEFAULT_WORKFLOW, type GalleryImage, type WorkflowStep } from '../lib/siteStore';

const essentials = [
  {
    label: 'Parcelles',
    title: 'Analyse du sol',
    text: "Comprenez l'eau, la fertilité et les besoins de vos cultures.",
  },
  {
    label: 'Météo',
    title: 'Alertes utiles',
    text: 'Recevez les bons conseils avant la pluie, la chaleur ou les risques.',
  },
  {
    label: 'Rendement',
    title: 'Décisions IA',
    text: 'Choisissez les cultures et les actions les plus adaptées.',
  },
];

export default function Home() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(DEFAULT_GALLERY);
  const [workflow, setWorkflow] = useState<WorkflowStep[]>(DEFAULT_WORKFLOW);

  useEffect(() => {
    fetch('/api/gallery').then(r => r.json()).then(d => { if (d.images?.length) setGalleryImages(d.images); }).catch(() => {});
    fetch('/api/workflow').then(r => r.json()).then(d => { if (d.steps?.length) setWorkflow(d.steps); }).catch(() => {});
  }, []);

  return (
    <div className="relative overflow-hidden bg-green-50 text-gray-900">
      <Navbar />
      <main>
        <section className="relative min-h-screen overflow-hidden px-6 pt-28 pb-16 sm:px-8 lg:px-10">
          <Image
            src="/backend.jpg"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-950/75 via-green-900/45 to-green-950/70" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-green-50 to-transparent" />

          <div className="relative mx-auto flex min-h-[calc(100vh-8rem)] max-w-4xl flex-col items-center justify-center gap-12 text-center">
            <div className="mx-auto max-w-3xl">
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex rounded-full border border-green-300/40 bg-green-100/85 px-4 py-2 text-xs font-bold uppercase tracking-[0.32em] text-green-800 backdrop-blur"
              >
                Agriculture intelligente
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.08 }}
                className="mt-6 text-5xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl"
              >
                Cultivez mieux avec l'aide de l'IA.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.16 }}
                className="mx-auto mt-6 max-w-2xl text-base leading-8 text-green-50 sm:text-lg lg:mx-0"
              >
                AI-Forest Planner accompagne les producteurs dans le suivi des parcelles, la météo
                agricole et les décisions de culture.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.24 }}
                className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
              >
                <DownloadCta label="Télécharger l'application" />
                <Link
                  href="/features"
                  className="inline-flex items-center justify-center rounded-full border border-green-200/50 bg-white/15 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25"
                >
                  Découvrir les outils
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-20 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-10 text-center lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:text-left">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-green-600">
                Essentiel
              </p>
              <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-gray-950">
                Une application simple pour les décisions importantes.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {essentials.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[2rem] border border-green-100 bg-green-50 p-6"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-green-600">
                    {item.label}
                  </p>
                  <h3 className="mt-3 text-xl font-bold text-gray-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden bg-white px-6 py-20 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-green-600">
              Terrain
            </p>
            <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-gray-950">
              Une application pensée pour les réalités agricoles.
            </h2>
          </div>
          <div className="mt-10 flex overflow-hidden">
            <div className="animate-marquee flex min-w-full gap-5" style={{ willChange: 'transform' }}>
              {Array.from({ length: 2 }).map((_, block) => (
                <div key={block} className="flex gap-5">
                  {galleryImages.map((image) => (
                    <article
                      key={`${block}-${image.title}`}
                      className="relative h-72 w-[28rem] shrink-0 overflow-hidden rounded-[2rem] border border-green-100 bg-green-50 shadow-sm"
                    >
                      <img
                        src={image.src}
                        alt={image.title}
                        className="h-full w-full object-cover"
                        loading={block === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-green-950/70 via-green-950/10 to-transparent" />
                      <h3 className="absolute bottom-5 left-5 right-5 text-lg font-bold text-white">
                        {image.title}
                      </h3>
                    </article>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-green-950 px-6 py-20 text-white sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-green-300">
              Comment ça marche
            </p>
            <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight">
              Un parcours clair, du terrain à la décision.
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {workflow.map((item) => (
                <div
                  key={item.step}
                  className="rounded-[2rem] border border-green-800 bg-green-900/60 p-6 text-center"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-green-300">
                    {item.step}
                  </p>
                  <h3 className="mt-4 text-xl font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-green-100">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <TeamPartners />

        <section className="bg-green-50 px-6 py-20 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-8 rounded-[2rem] border border-green-200 bg-white p-8 text-center shadow-sm lg:grid-cols-[1fr_auto] lg:items-center lg:text-left">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-950">
                Commencez depuis l'application mobile.
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-600 lg:mx-0">
                Créez votre compte, ajoutez vos parcelles et laissez AVA vous guider.
              </p>
            </div>
            <DownloadCta label="Télécharger maintenant" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
