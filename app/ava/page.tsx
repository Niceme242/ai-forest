'use client';

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { DownloadCta } from '../../components/DownloadCta';

type Role = 'user' | 'assistant';

type Message = {
  id: string;
  role: 'user' | 'ava';
  content: string;
};

const SUGGESTIONS = [
  "C'est quoi AI-Forest Planner ?",
  "Comment fonctionne la météo agricole ?",
  "Comment vendre sur le Marketplace ?",
  "Quelles cultures sont recommandées ?",
  "Comment créer mon compte ?",
  "Qu'est-ce que la Carte Agricole ?",
];

const WELCOME: Message = {
  id: 'welcome',
  role: 'ava',
  content: "Bonjour ! Je suis AVA 🌱, votre assistante agricole AI-Forest Planner.\n\nPosez-moi vos questions sur l'application, les cultures, la météo agricole, le Marketplace et bien plus encore. Je suis disponible 24h/24 pour vous aider.",
};

export default function AvaPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text: string) => {
    const message = text.trim();
    if (!message || loading) return;

    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: message };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const history: { role: Role; content: string }[] = messages
      .filter(m => m.id !== 'welcome')
      .map(m => ({ role: m.role === 'ava' ? 'assistant' : 'user', content: m.content }));

    try {
      const res = await fetch('/api/ava', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
      });
      const data = await res.json();
      const reply = data.response ?? "Je n'ai pas pu générer une réponse. Veuillez réessayer.";
      setMessages(prev => [...prev, { id: `a-${Date.now()}`, role: 'ava', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { id: `e-${Date.now()}`, role: 'ava', content: "Une erreur est survenue. Vérifiez votre connexion et réessayez." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => { e.preventDefault(); send(input); };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Navbar />

      <main className="flex flex-1 flex-col">

        {/* HERO */}
        <section className="bg-green-950 px-6 pt-28 pb-10 sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-green-400">
                Assistant IA
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                AVA <span className="text-green-400">🌱</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-green-200">
                Votre assistante agricole intelligente propulsée par Mistral AI. Posez vos questions sur AI-Forest Planner, les cultures, la météo et le Marketplace — disponible 24h/24.
              </p>
            </div>
            <div className="hidden shrink-0 sm:block">
              <DownloadCta label="Télécharger l'app" />
            </div>
          </div>
        </section>

        {/* CHAT LAYOUT */}
        <section className="flex flex-1 px-4 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto flex w-full max-w-7xl gap-6">

            {/* SIDEBAR */}
            <aside className="hidden w-72 shrink-0 lg:block">
              <div className="sticky top-24 space-y-4">

                <div className="rounded-[1.5rem] border border-green-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-green-600">
                    Questions rapides
                  </p>
                  <div className="mt-4 space-y-2">
                    {SUGGESTIONS.map(s => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        disabled={loading}
                        className="w-full rounded-xl border border-green-100 bg-green-50 px-3 py-2.5 text-left text-xs font-medium text-gray-700 transition hover:border-green-400 hover:bg-green-100 hover:text-green-800 disabled:opacity-50"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-green-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-green-600">
                    Explorer l'app
                  </p>
                  <div className="mt-4 space-y-2">
                    {[
                      { label: 'Fonctionnalités', href: '/features' },
                      { label: 'Guide complet', href: '/guide' },
                      { label: 'IA & Monitoring', href: '/monitoring' },
                      { label: 'Communauté', href: '/community' },
                    ].map(l => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className="flex items-center justify-between rounded-xl border border-green-100 bg-green-50 px-3 py-2.5 text-xs font-medium text-gray-700 transition hover:border-green-400 hover:bg-green-100 hover:text-green-800"
                      >
                        {l.label}
                        <svg className="h-3.5 w-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-green-100 bg-green-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-green-700">
                    Propulsé par
                  </p>
                  <p className="mt-2 text-sm font-semibold text-gray-800">Mistral AI</p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    AVA utilise un modèle de langage avancé spécialisé pour l'agriculture en Afrique Centrale.
                  </p>
                </div>

              </div>
            </aside>

            {/* CHAT WINDOW */}
            <div className="flex flex-1 flex-col overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-lg">

              {/* Header */}
              <div className="flex items-center gap-3 border-b border-green-900/20 bg-gradient-to-r from-green-950 to-green-800 px-6 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-400/20 text-xl ring-2 ring-green-400/30">
                  🌱
                </div>
                <div>
                  <p className="text-sm font-bold text-white">AVA</p>
                  <p className="text-xs text-green-300">Assistante Agricole · IA active</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80]" />
                  <span className="text-xs font-medium text-green-300">En ligne</span>
                </div>
              </div>

              {/* Messages */}
              <div
                className="flex-1 space-y-5 overflow-y-auto bg-gradient-to-b from-gray-50 to-white p-6"
                style={{ minHeight: '420px', maxHeight: '62vh' }}
              >
                <AnimatePresence initial={false}>
                  {messages.map(msg => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.22 }}
                      className={`flex items-end gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'ava' && (
                        <span className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-base shadow-sm">
                          🌱
                        </span>
                      )}
                      <div
                        className={`max-w-[78%] whitespace-pre-line rounded-3xl px-5 py-3.5 text-sm leading-relaxed shadow-sm ${
                          msg.role === 'user'
                            ? 'rounded-br-md bg-green-600 text-white'
                            : 'rounded-bl-md border border-gray-100 bg-white text-gray-700'
                        }`}
                      >
                        {msg.content}
                      </div>
                      {msg.role === 'user' && (
                        <span className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white shadow-sm">
                          Moi
                        </span>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-end gap-2.5 justify-start"
                  >
                    <span className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-base shadow-sm">
                      🌱
                    </span>
                    <div className="rounded-3xl rounded-bl-md border border-gray-100 bg-white px-5 py-4 shadow-sm">
                      <span className="inline-flex gap-1">
                        <span className="h-2 w-2 rounded-full bg-green-400 animate-bounce" />
                        <span className="h-2 w-2 rounded-full bg-green-400 animate-bounce [animation-delay:0.15s]" />
                        <span className="h-2 w-2 rounded-full bg-green-400 animate-bounce [animation-delay:0.3s]" />
                      </span>
                    </div>
                  </motion.div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* Mobile suggestions */}
              <div className="flex gap-2 overflow-x-auto border-t border-gray-100 px-4 py-2.5 lg:hidden">
                {SUGGESTIONS.slice(0, 3).map(s => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    disabled={loading}
                    className="shrink-0 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-green-100 disabled:opacity-50"
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="border-t border-gray-100 bg-white p-4">
                <div className="flex items-end gap-3">
                  <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Posez votre question à AVA... (Entrée pour envoyer)"
                    rows={1}
                    className="min-w-0 flex-1 resize-none rounded-2xl border border-green-200 bg-green-50/60 px-5 py-3.5 text-sm leading-relaxed outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                    style={{ maxHeight: '120px' }}
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={loading || input.trim().length === 0}
                    className="shrink-0 rounded-2xl bg-gradient-to-r from-green-700 to-green-500 p-3.5 text-white shadow-lg transition hover:scale-105 hover:shadow-green-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </button>
                </div>
                <p className="mt-2 text-center text-[10px] text-gray-400">
                  AVA est spécialisée en agriculture africaine et AI-Forest Planner
                </p>
              </form>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
