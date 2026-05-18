'use client';

import { FormEvent, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEFAULT_TEAM, DEFAULT_PARTNERS, type TeamMember, type Partner } from '../lib/siteStore';

const PARTNER_STYLES = [
  { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
  { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' },
  { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-100' },
  { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-100' },
  { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100' },
  { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' },
];

const POST_JSON = { 'Content-Type': 'application/json' };

function PartnerModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement)?.value ?? '';
    const organization = (form.elements.namedItem('organization') as HTMLInputElement)?.value ?? '';
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value ?? '';
    const partnershipType = (form.elements.namedItem('partnershipType') as HTMLSelectElement)?.value ?? '';
    const messageText = (form.elements.namedItem('messageText') as HTMLTextAreaElement)?.value ?? '';
    await fetch('/api/messages', {
      method: 'POST',
      headers: POST_JSON,
      body: JSON.stringify({ type: 'partner_request', name, organization, email, partnershipType, messageText }),
    }).catch(() => {});
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-green-950/70 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 24 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-lg rounded-[2rem] border border-green-100 bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-green-600">
              Partenariat
            </p>
            <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-950">
              Devenir partenaire
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Rejoignez-nous pour transformer l'agriculture en Afrique. Remplissez ce formulaire et notre équipe vous contactera sous 48 heures.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-green-100 bg-green-50 text-lg text-gray-500 transition hover:bg-green-100"
          >
            ×
          </button>
        </div>

        {submitted ? (
          <div className="mt-8 rounded-[1.5rem] bg-green-50 p-6 text-center">
            <p className="text-3xl">🌱</p>
            <p className="mt-3 text-lg font-bold text-gray-950">Merci !</p>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Nous avons bien reçu votre demande et reviendrons vers vous sous 48 heures.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Nom complet *
                </label>
                <input
                  required
                  name="name"
                  type="text"
                  placeholder="Jean Dupont"
                  className="w-full rounded-2xl border border-green-200 bg-green-50/50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Organisation *
                </label>
                <input
                  required
                  name="organization"
                  type="text"
                  placeholder="Votre organisation"
                  className="w-full rounded-2xl border border-green-200 bg-green-50/50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                Email *
              </label>
              <input
                required
                name="email"
                type="email"
                placeholder="vous@organisation.com"
                className="w-full rounded-2xl border border-green-200 bg-green-50/50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                Type de partenariat
              </label>
              <select name="partnershipType" className="w-full rounded-2xl border border-green-200 bg-green-50/50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100">
                <option value="">Sélectionner un type</option>
                <option>Technologie & Intégration</option>
                <option>Recherche & Développement</option>
                <option>Distribution & Terrain</option>
                <option>Financement & Investissement</option>
                <option>Autre</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                Message
              </label>
              <textarea
                name="messageText"
                rows={3}
                placeholder="Parlez-nous de votre organisation et de la façon dont vous souhaitez collaborer avec nous..."
                className="w-full rounded-2xl border border-green-200 bg-green-50/50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-green-700 to-green-500 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-green-600 hover:to-green-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Envoi en cours…' : 'Envoyer la demande'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

export function TeamPartners() {
  const [modalOpen, setModalOpen] = useState(false);
  const [team, setTeam] = useState<TeamMember[]>(DEFAULT_TEAM);
  const [rawPartners, setRawPartners] = useState<Partner[]>(DEFAULT_PARTNERS);

  useEffect(() => {
    fetch('/api/team').then(r => r.json()).then(d => { if (d.team?.length) setTeam(d.team); }).catch(() => {});
    fetch('/api/partners').then(r => r.json()).then(d => { if (d.partners?.length) setRawPartners(d.partners); }).catch(() => {});
  }, []);

  const partners = rawPartners.map((p, i) => ({ ...p, ...PARTNER_STYLES[i % PARTNER_STYLES.length] }));

  return (
    <>
      <section className="bg-white px-6 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">

          {/* TEAM */}
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-green-600">
              Notre équipe
            </p>
            <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-gray-950">
              Les personnes derrière AI-Forest Planner.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-500">
              Une équipe d'agronomes, d'ingénieurs et de spécialistes terrain unis par la mission de rendre l'agriculture intelligente accessible à chaque agriculteur en Afrique.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-[2rem] border border-green-100 bg-green-50 p-6 text-center"
              >
                <img
                  src={member.src}
                  alt={member.name}
                  className="mx-auto h-20 w-20 rounded-full object-cover ring-4 ring-white shadow-md"
                  loading="lazy"
                />
                <h3 className="mt-4 text-base font-bold text-gray-950">{member.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-green-600">
                  {member.role}
                </p>
                {member.position && (
                  <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-medium text-green-700">
                    📍 {member.position}
                  </p>
                )}
                <p className="mt-3 text-sm leading-6 text-gray-600">{member.description}</p>
              </motion.div>
            ))}
          </div>

          {/* PARTNERS */}
          <div className="mt-20 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-green-600">
              Partenaires
            </p>
            <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-gray-950">
              La confiance d'organisations de référence.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-500">
              Nous collaborons avec des institutions mondiales et panafricaines pour apporter les meilleurs outils et connaissances aux communautés agricoles.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {partners.map((partner, i) => (
              <motion.a
                key={partner.name}
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className={`group flex h-24 w-40 flex-col items-center justify-center rounded-[1.5rem] border ${partner.border} ${partner.bg} shadow-sm transition hover:scale-105 hover:shadow-md`}
              >
                <p className={`text-xl font-extrabold ${partner.text}`}>{partner.name}</p>
                <p className="mt-1 px-3 text-center text-[10px] leading-4 text-gray-500">
                  {partner.description}
                </p>
              </motion.a>
            ))}
          </div>

          {/* BECOME A PARTNER CTA */}
          <div className="mt-12 flex justify-center">
            <motion.button
              type="button"
              onClick={() => setModalOpen(true)}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.3 }}
              className="inline-flex items-center gap-2 rounded-full border border-green-700 bg-green-950 px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-green-800"
            >
              <span className="text-green-300">✦</span>
              Devenir partenaire
            </motion.button>
          </div>

        </div>
      </section>

      <AnimatePresence>
        {modalOpen && <PartnerModal onClose={() => setModalOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
