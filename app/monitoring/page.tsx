'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { DownloadCta } from '../../components/DownloadCta';
import { StatCounter } from '../../components/StatCounter';
import {
  DEFAULT_MONITORING_CARDS, DEFAULT_MONITORING_STATS,
  DEFAULT_DASHBOARD_ITEMS, DEFAULT_MONITORING_SETTINGS,
  type MonitoringCard, type MonitoringStat,
  type DashboardItem, type MonitoringSettings,
} from '../../lib/siteStore';

export default function MonitoringPage() {
  const [cards,    setCards]    = useState<MonitoringCard[]>(DEFAULT_MONITORING_CARDS);
  const [stats,    setStats]    = useState<MonitoringStat[]>(DEFAULT_MONITORING_STATS);
  const [items,    setItems]    = useState<DashboardItem[]>(DEFAULT_DASHBOARD_ITEMS);
  const [settings, setSettings] = useState<MonitoringSettings>(DEFAULT_MONITORING_SETTINGS);

  useEffect(() => {
    fetch('/api/monitoring/cards').then(r => r.json()).then(d => { if (d.cards?.length) setCards(d.cards); }).catch(() => {});
    fetch('/api/monitoring/stats').then(r => r.json()).then(d => { if (d.stats?.length) setStats(d.stats); }).catch(() => {});
    fetch('/api/monitoring/dashboard').then(r => r.json()).then(d => { if (d.items?.length) setItems(d.items); }).catch(() => {});
    fetch('/api/settings/monitoring').then(r => r.json()).then(d => { if (d.value) setSettings(s => ({ ...s, ...d.value })); }).catch(() => {});
  }, []);

  return (
    <div className="relative overflow-hidden bg-green-50 text-gray-900">
      <Navbar />
      <main>

        {/* HERO */}
        <section className="relative overflow-hidden bg-green-950 px-6 pt-28 pb-20 sm:px-8 lg:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.22),_transparent_40%),radial-gradient(circle_at_80%_20%,_rgba(16,185,129,0.14),_transparent_30%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-green-400">IA & Monitoring</p>
              <h1 className="mt-5 text-5xl font-bold leading-tight tracking-[-0.03em] text-white sm:text-6xl">
                {settings.hero_title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-green-200">{settings.hero_description}</p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <DownloadCta label="Télécharger" />
                <Link href="/features" className="inline-flex items-center justify-center rounded-full border border-green-700 bg-green-900/70 px-6 py-3 text-sm font-semibold text-green-200 transition hover:bg-green-800">
                  Voir les fonctionnalités
                </Link>
              </div>
            </div>

            {/* Dashboard widget */}
            <div className="rounded-[2rem] border border-green-800/40 bg-green-900/50 p-5 shadow-2xl shadow-green-950/30 backdrop-blur-xl">
              <div className="rounded-[1.5rem] border border-green-800/40 bg-green-950/70 p-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-green-700">Dashboard</span>
                  <span className="text-sm font-medium text-green-200">Live</span>
                </div>

                {/* Dashboard items grid */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {items.slice(0, 6).map(item => (
                    <div key={item.id} className="flex flex-col items-center justify-center rounded-2xl bg-green-700/40 px-2 py-3 text-center">
                      <span className="text-sm font-bold text-white leading-tight">{item.value}</span>
                      <span className="mt-0.5 text-[10px] text-green-300 leading-tight">{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* Main metric */}
                <div className="mt-6 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-4xl font-bold text-white">{settings.metric_value}</p>
                    <p className="text-sm text-green-300">{settings.metric_label}</p>
                  </div>
                  <div className="h-16 w-16 rounded-3xl bg-green-500/25" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KPI CARDS */}
        <section className="bg-white px-6 py-20 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 md:grid-cols-3">
              {cards.map((card, index) => (
                <motion.div key={card.id}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="rounded-[2rem] border border-green-200 bg-white p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-green-600">{card.label}</p>
                  <p className="mt-4 text-3xl font-bold text-gray-950">{card.value}</p>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{card.title}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="relative px-6 py-20 sm:px-8 lg:px-10">
          <div className="absolute inset-0 bg-green-950/75" />
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${settings.bg_image})` }} />
          <div className="absolute inset-0 bg-green-950/75 backdrop-blur-sm" />
          <div className="relative mx-auto max-w-7xl rounded-[2rem] border border-green-700/30 bg-green-900/70 p-8 shadow-2xl shadow-green-950/50 backdrop-blur-xl">
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-green-400">Statistiques</p>
                <h2 className="mt-4 text-4xl font-bold leading-tight text-white">{settings.stats_title}</h2>
                {settings.stats_description && <p className="mt-3 text-sm leading-7 text-green-200">{settings.stats_description}</p>}
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {stats.map(s => (
                  <StatCounter key={s.id} label={s.label} target={s.target} suffix={s.suffix} />
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
