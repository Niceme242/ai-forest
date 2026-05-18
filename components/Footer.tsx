'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { DEFAULT_FOOTER, type FooterInfo } from '../lib/siteStore';

const quickLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Fonctionnalités', href: '/features' },
  { label: 'IA & Monitoring', href: '/monitoring' },
  { label: 'AVA — Assistante IA', href: '/ava' },
  { label: 'Communauté', href: '/community' },
  { label: 'Guide', href: '/guide' },
  { label: 'Actualités', href: '/news' },
];

const POST_JSON = { 'Content-Type': 'application/json' };

export function Footer() {
  const [info, setInfo] = useState<FooterInfo>(DEFAULT_FOOTER);
  const [subStatus, setSubStatus] = useState<'idle' | 'ok' | 'error'>('idle');

  useEffect(() => {
    fetch('/api/settings/footer').then(r => r.json()).then(d => { if (d.value) setInfo(d.value); }).catch(() => {});
  }, []);

  const socialLinks = info.socialLinks;

  const handleNewsletter = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value;
    if (!email) return;
    try {
      const res = await fetch('/api/messages', { method: 'POST', headers: POST_JSON, body: JSON.stringify({ type: 'newsletter', email }) });
      if (res.ok) {
        setSubStatus('ok');
        form.reset();
      } else {
        setSubStatus('error');
      }
    } catch {
      setSubStatus('error');
    }
  };

  return (
    <footer className="border-t border-green-200 bg-white py-16 text-gray-700">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 text-center sm:px-8 lg:px-10 lg:flex-row lg:items-start lg:justify-between lg:text-left">
        {/* Brand */}
        <div className="max-w-xs space-y-5">
          <div className="inline-flex items-center gap-3">
            <Link href="/" className="inline-flex h-10 w-10 items-center justify-center rounded-2xl overflow-hidden shadow-md shadow-green-600/30 hover:opacity-80 transition-opacity">
              <Image src="/logo.png" alt="Ai-Forest Planner" width={40} height={40} className="h-full w-full object-cover" />
            </Link>
            <div className="leading-tight">
              <p className="text-sm font-bold text-gray-900">Ai-Forest Planner</p>
              <p className="text-xs text-green-600 font-medium">Agriculture intelligente</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-7">{info.description}</p>
          <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
            {socialLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm text-gray-700 transition hover:bg-green-100 hover:border-green-300 hover:text-green-800 cursor-pointer"
                aria-label={`Suivez-nous sur ${item.label}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="grid gap-10 sm:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.28em] text-green-700">
              Liens rapides
            </h3>
            <div className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-gray-600 hover:text-green-700 transition-colors cursor-pointer"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.28em] text-green-700">Contact</h3>
            <p className="text-sm text-gray-600">{info.email}</p>
            <p className="text-sm text-gray-600">{info.phone}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.28em] text-green-700">
              Newsletter
            </h3>
            <p className="text-sm text-gray-600 leading-7">
              Recevez les nouveautés agricoles et les événements à venir.
            </p>
            <form className="flex flex-col gap-3" onSubmit={handleNewsletter}>
              {subStatus === 'ok' ? (
                <p className="rounded-full bg-green-100 px-4 py-2.5 text-center text-sm font-semibold text-green-800">
                  Merci, vous êtes inscrit !
                </p>
              ) : (
                <>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Votre email"
                    className="w-full rounded-full border border-green-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-green-400 focus:ring-2 focus:ring-green-100"
                    aria-label="Adresse email"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-500 cursor-pointer shadow-sm shadow-green-600/20"
                  >
                    S'abonner
                  </button>
                  {subStatus === 'error' && (
                    <p className="text-center text-xs text-red-600">Une erreur est survenue, réessayez.</p>
                  )}
                </>
              )}
            </form>
          </div>
        </div>
      </div>

      <div className="mt-14 border-t border-green-100 px-6 pt-8 text-center text-xs text-gray-500 sm:px-8 lg:px-10 flex flex-col items-center gap-3">
        <span>{info.copyright}</span>
        <span>
          <a href={info.websiteUrl} target="_blank" rel="noreferrer" className="hover:text-green-700 transition-colors">{info.websiteUrl.replace(/^https?:\/\//, '')}</a>
          {' · '}
          <a href={`mailto:${info.email}`} className="hover:text-green-700 transition-colors">{info.email}</a>
        </span>
      </div>
    </footer>
  );
}
