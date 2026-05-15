'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { DownloadCta } from './DownloadCta';
import { MarketPopup } from './MarketPopup';

const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Fonctionnalités', href: '/features' },
  { label: 'IA & Monitoring', href: '/monitoring' },

  { label: 'Communauté', href: '/community' },
  { label: 'Guide', href: '/guide' },
  { label: 'Actualités', href: '/news' },
];

function isWhiteBg(el: Element): boolean {
  let current: Element = el;
  let bg = window.getComputedStyle(current).backgroundColor;
  while (
    (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') &&
    current.parentElement
  ) {
    current = current.parentElement;
    bg = window.getComputedStyle(current).backgroundColor;
  }
  const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return false;
  return +match[1] > 248 && +match[2] > 248 && +match[3] > 248;
}

export function Navbar() {
  const [overWhite, setOverWhite] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const checkBg = () => {
      const header = headerRef.current;
      if (!header) return;
      const x = window.innerWidth / 2;
      const y = header.getBoundingClientRect().bottom + 2;
      const els = document.elementsFromPoint(x, y);
      const behind = els.find(
        (el) =>
          !header.contains(el) &&
          el !== document.documentElement &&
          el !== document.body,
      );
      setOverWhite(behind ? isWhiteBg(behind) : false);
    };

    requestAnimationFrame(checkBg);
    window.addEventListener('scroll', checkBg, { passive: true });
    window.addEventListener('resize', checkBg, { passive: true });
    return () => {
      window.removeEventListener('scroll', checkBg);
      window.removeEventListener('resize', checkBg);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        overWhite
          ? 'bg-transparent'
          : 'border-b border-green-200/60 bg-white shadow-lg shadow-green-950/8 backdrop-blur-2xl'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        {/* Logo */}
        <div className="inline-flex items-center gap-3">
          <Link href="/" className="inline-flex h-10 w-10 items-center justify-center rounded-2xl overflow-hidden shadow-md shadow-green-600/30 transition-opacity hover:opacity-80">
            <Image src="/logo.png" alt="Ai-Forest Planner" width={40} height={40} className="h-full w-full object-cover" priority />
          </Link>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-bold tracking-tight text-gray-900">Ai-Forest Planner</span>
            <span className="text-xs font-medium text-green-600">Agriculture intelligente</span>
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="cursor-pointer rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-green-50 hover:text-green-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <MarketPopup />
          <div className="hidden sm:block">
            <DownloadCta label="Télécharger" variant="secondary" />
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-green-200 bg-green-50 text-green-800 transition hover:bg-green-100 lg:hidden"
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileOpen}
          >
            <span className="relative h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition ${
                  mobileOpen ? 'translate-y-[7px] rotate-45' : ''
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-current transition ${
                  mobileOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`absolute left-0 top-[14px] h-0.5 w-5 rounded-full bg-current transition ${
                  mobileOpen ? '-translate-y-[7px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-green-100 bg-white px-6 pb-6 pt-4 shadow-xl shadow-green-950/5 lg:hidden">
          <div className="flex flex-col items-center gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="w-full rounded-xl py-3 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-green-50 hover:text-green-700"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-col items-center gap-3 border-t border-green-100 pt-4">
            <MarketPopup />
            <DownloadCta label="Télécharger" variant="secondary" />
          </div>
        </nav>
      )}
    </header>
  );
}
