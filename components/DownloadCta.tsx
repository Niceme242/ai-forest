'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { DEFAULT_DOWNLOADS, type DownloadLinks } from '../lib/siteStore';

type DownloadCtaProps = {
  label?: string;
  variant?: 'primary' | 'secondary';
};

export function DownloadCta({ label = "Télécharger l'app", variant = 'primary' }: DownloadCtaProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [stores, setStores] = useState<DownloadLinks>(DEFAULT_DOWNLOADS);

  useEffect(() => {
    setMounted(true);
    fetch('/api/settings/downloads').then(r => r.json()).then(d => { if (d.value) setStores(d.value); }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setModalOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [modalOpen]);

  const handleClick = () => {
    setModalOpen(true);
  };

  const modal =
    mounted && modalOpen
      ? createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-green-950/80 p-4 backdrop-blur-xl sm:items-center"
            onClick={(event) => event.target === event.currentTarget && setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative my-6 w-full max-w-2xl rounded-[2rem] border border-green-200 bg-white p-5 text-gray-900 shadow-2xl shadow-green-950/50 sm:p-7"
            >
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-green-200 bg-green-50 text-2xl leading-none text-green-900 transition hover:bg-green-100"
                aria-label="Fermer"
              >
                ×
              </button>

              <div className="pr-12">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-green-600">
                  Télécharger l'application
                </p>
                <h2 className="mt-4 text-3xl font-bold leading-tight text-gray-950 sm:text-4xl">
                  Créez votre compte depuis l'app.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-gray-600">
                  Téléchargez AI-Forest Planner, créez votre compte, puis connectez-vous avec vos
                  identifiants sur le site.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {(['android', 'ios'] as const).map((platform) => (
                  <a
                    key={platform}
                    href={stores[platform].url}
                    target="_blank"
                    rel="noreferrer"
                    className="group rounded-2xl border border-green-200 bg-green-50 p-5 transition hover:-translate-y-0.5 hover:border-green-300 hover:bg-white hover:shadow-xl hover:shadow-green-100"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-green-600">
                          {stores[platform].label}
                        </p>
                        <p className="mt-2 text-lg font-bold text-gray-950">
                          {platform === 'android' ? 'Télécharger Android' : 'Télécharger iOS'}
                        </p>
                      </div>
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600 text-sm font-black text-white shadow-sm shadow-green-600/30">
                        {platform === 'android' ? 'Play' : 'iOS'}
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-gray-600">
                      Ouvrir dans {stores[platform].label}
                    </p>
                  </a>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-green-200 bg-white px-5 py-3 text-sm font-semibold text-green-800 transition hover:bg-green-50"
              >
                Fermer
              </button>
            </motion.div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 cursor-pointer ${
          variant === 'primary'
            ? 'bg-green-600 text-white shadow-lg shadow-green-600/30 hover:bg-green-500 hover:-translate-y-0.5 active:translate-y-0'
            : 'border border-green-300 bg-green-50 text-green-800 hover:bg-green-100 hover:border-green-400'
        }`}
      >
        {label}
      </button>
      {modal}
    </>
  );
}
