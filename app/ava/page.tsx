'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { DownloadCta } from '../../components/DownloadCta';

// ─── TYPES ───────────────────────────────────────────────────────────────────

type AvaMessage = {
  id: string;
  role: 'ava' | 'user';
  content: string;
};

// ─── KNOWLEDGE BASE ───────────────────────────────────────────────────────────

const AI_FOREST_KEYWORDS = [
  'ai-forest', 'ai forest', 'aiforest', 'ava', 'application', 'app',
  'fonctionnalité', 'fonctionnalites', 'fonctionnalités', 'fonction',
  'aide', 'aider', 'assistant', 'agriculture', 'agricole', 'culture',
  'cultures', 'plantation', 'plantations', 'météo', 'meteo', 'marketplace',
  'chat ai', 'recommandation', 'recommandations', 'sol', 'irrigation',
  'manioc', 'arachide', 'maïs', 'mais', 'climat', 'parcelle', 'engrais',
  'récolte', 'recolte', 'profil', 'compte', 'connexion', 'inscription',
  'carte', 'carte agricole', 'dashboard', 'planning', 'calendrier',
  'diagnostic', 'maladie', 'ravageur', 'monitoring', 'alerte', 'alertes',
  'suivi', 'rendement', 'télécharger', 'telecharger', 'download',
  'prix', 'marché', 'marche', 'vendre', 'acheter', 'produit',
  'congo', 'cameroun', 'gabon', 'afrique', 'rca', 'rdc',
];

const SUGGESTIONS = [
  "C'est quoi AI-Forest Planner ?",
  "Comment fonctionne la météo ?",
  "Comment vendre sur le Marketplace ?",
  "Quelles cultures sont recommandées ?",
  "Comment créer un compte ?",
  "Qu'est-ce que la Carte Agricole ?",
];

function isGreeting(msg: string) {
  return ['salut', 'bonjour', 'bonsoir', 'hello', 'hi', 'cc', 'coucou'].includes(msg.toLowerCase().trim());
}

function isAgricultureQuestion(msg: string) {
  const low = msg.toLowerCase();
  return AI_FOREST_KEYWORDS.some(k => low.includes(k));
}

async function sendMessageToAva(message: string): Promise<string> {
  const low = message.toLowerCase();

  if (isGreeting(message)) return `Bonjour 👋\nJe suis AVA 🌱\nComment puis-je vous aider sur AI-Forest Planner ?`;

  if (low.includes('ai-forest') || low.includes('ai forest') || low.includes('c quoi') || low.includes('c\'est quoi'))
    return `🌱 AI-Forest Planner est une application agricole intelligente pour l'Afrique Centrale.\n\nElle permet :\n• Obtenir des recommandations IA pour vos cultures\n• Suivre la météo agricole en temps réel\n• Gérer vos parcelles et plantations\n• Utiliser le Chat AI pour des conseils personnalisés\n• Accéder à une carte de 82 régions agricoles\n• Vendre et acheter sur le Marketplace\n\nDisponible sur Android et iOS 📱`;

  if (low.includes('télécharger') || low.includes('telecharger') || low.includes('download') || low.includes('installer'))
    return `📱 Téléchargez AI-Forest Planner :\n\n• Google Play Store — Android\n• App Store — iOS\n\nRecherchez "AI-Forest Planner" ou cliquez sur le bouton Télécharger en haut de la page.`;

  if (low.includes('aide') || low.includes('help'))
    return `🤖 Je peux vous aider sur :\n\n• 🌦️ La météo agricole\n• 🤖 Les recommandations IA\n• 🛒 Le Marketplace\n• 🗺️ La carte agricole\n• 🌱 Les cultures et maladies\n• 📅 Le calendrier agricole\n• 👤 Votre compte et profil\n• 💬 Le Chat AI\n• 📊 Le tableau de bord\n\nPosez votre question !`;

  if (low.includes('météo') || low.includes('meteo') || low.includes('climat') || low.includes('pluie') || low.includes('température'))
    return `🌦️ La météo agricole dans AI-Forest Planner affiche :\n\n• 🌡️ La température en temps réel\n• 💧 Le taux d'humidité\n• 🌬️ La vitesse du vent\n• 🌧️ Les précipitations prévues\n\nCes données sont actualisées en continu et permettent d'optimiser l'irrigation, les traitements et la planification des récoltes.`;

  if (low.includes('marketplace') || low.includes('vendre') || low.includes('acheter') || low.includes('produit') || low.includes('prix') || low.includes('marché'))
    return `🛒 Le Marketplace AI-Forest Planner :\n\n Pour vendre :\n1. Ouvrez le Marketplace\n2. Appuyez sur "+"\n3. Ajoutez jusqu'à 5 photos\n4. Définissez le prix et l'unité\n5. Activez le prix négociable si besoin\n6. Publiez votre annonce\n\n Pour acheter :\n• Parcourez les annonces par catégorie\n• Contactez le vendeur directement\n\n🤖 L'IA peut estimer les prix du marché pour vous.`;

  if (low.includes('carte') || low.includes('région') || low.includes('region') || low.includes('zone'))
    return `🗺️ La Carte Agricole Interactive couvre :\n\n• 82 régions en Afrique Centrale\n• Cameroun, Congo-Brazzaville, Gabon, RCA, RDC\n\nFonctionnalités :\n• Recherche rapide par nom de région\n• Filtres par pays\n• Marqueurs interactifs sur les zones agricoles\n• Visualisation des opportunités par zone`;

  if (low.includes('recommandation') || low.includes('ia') || low.includes('intelligence artificielle'))
    return `🌱 Les recommandations IA sont personnalisées selon :\n\n• Votre localisation (département, pays)\n• Vos cultures déclarées\n• La météo du moment\n• La saison agricole en cours\n• Votre historique d'activité\n\nElles sont classées par priorité :\n🔴 Urgent · 🟡 Important · 🔵 Information · 🟢 Conseil`;

  if (low.includes('maladie') || low.includes('ravageur') || low.includes('insecte') || low.includes('parasite'))
    return `🔬 Pour diagnostiquer une maladie ou un ravageur :\n\n1. Ouvrez le Chat AI dans l'application\n2. Décrivez les symptômes observés\n3. L'IA identifie la cause et propose un traitement\n\nMaladies courantes gérées :\n• Mildiou, rouille, fusariose\n• Chenilles, pucerons, nématodes\n• Pourriture des racines\n\n💡 Ajoutez une photo pour un diagnostic plus précis.`;

  if (low.includes('irrigation') || low.includes('eau') || low.includes('arrosage'))
    return `💧 Conseils d'irrigation avec AI-Forest Planner :\n\n• L'IA analyse l'humidité du sol et la météo\n• Elle vous indique le moment optimal pour irriguer\n• Elle calcule la quantité d'eau recommandée\n• Elle alerte en cas de risque de sécheresse ou excès d'eau\n\n🌱 Objectif : réduire le gaspillage d'eau de 20 à 30%.`;

  if (low.includes('calendrier') || low.includes('planning') || low.includes('saison') || low.includes('période'))
    return `📅 Le Calendrier Agricole vous aide à :\n\n• Planifier les semis selon la saison\n• Programmer les traitements\n• Suivre le cycle de croissance\n• Anticiper les récoltes\n• Gérer les tâches quotidiennes\n\nL'IA suggère les meilleures périodes selon votre localisation.`;

  if (low.includes('connexion') || low.includes('compte') || low.includes('inscription') || low.includes('créer') || low.includes('creer') || low.includes('profil'))
    return `👤 Gestion du compte AI-Forest Planner :\n\n Créer un compte :\n1. Téléchargez l'application\n2. Renseignez nom, pays, département, téléphone\n3. Définissez un mot de passe\n4. Acceptez les conditions\n\n Se connecter :\n• Email/téléphone + mot de passe\n• Accès limité possible sans compte\n\n Mot de passe oublié :\n• Réinitialisez via le code envoyé par email`;

  if (low.includes('sol') || low.includes('fertilité') || low.includes('engrais') || low.includes('fertilisant'))
    return `🌍 Analyse des sols dans AI-Forest Planner :\n\n• Cartographie haute résolution (10 m)\n• Évaluation de la fertilité par parcelle\n• Recommandations d'engrais personnalisées\n• 47 variables agronomiques analysées\n• Conseils pour améliorer la qualité du sol\n\n💡 Mettez à jour votre localisation pour des résultats précis.`;

  if (low.includes('parcelle') || low.includes('suivi') || low.includes('tableau de bord') || low.includes('dashboard'))
    return `📊 Tableau de bord & Suivi des parcelles :\n\n• Ajoutez vos parcelles avec localisation et surface\n• Suivez l'état de chaque culture en temps réel\n• Visualisez les alertes et recommandations par parcelle\n• Consultez l'historique de croissance\n• Estimez la date de récolte\n\nTout en un seul endroit 🌱`;

  if (low.includes('monitoring') || low.includes('alerte') || low.includes('notification'))
    return `🔔 Système de monitoring AI-Forest Planner :\n\n• Alertes météo personnalisées (pluie, chaleur, vent)\n• Notifications de maladies détectées\n• Rappels d'irrigation et traitement\n• Alertes de marché (prix favorables)\n• Suivi en temps réel de vos cultures\n\nLes alertes sont envoyées directement sur votre téléphone 📱`;

  if (low.includes('congo') || low.includes('cameroun') || low.includes('gabon') || low.includes('afrique') || low.includes('rca') || low.includes('rdc'))
    return `🌍 AI-Forest Planner couvre l'Afrique Centrale :\n\n• 🇨🇬 Congo-Brazzaville\n• 🇨🇲 Cameroun\n• 🇬🇦 Gabon\n• 🇨🇫 République Centrafricaine\n• 🇨🇩 RDC\n\n82 régions agricoles couvertes avec des recommandations adaptées au contexte local de chaque zone.`;

  if (!isAgricultureQuestion(message))
    return `Je suis AVA 🌱\n\nJe réponds uniquement aux questions sur AI-Forest Planner et l'agriculture.\n\nEssayez par exemple :\n• "Comment fonctionne la météo ?"\n• "Comment vendre sur le Marketplace ?"\n• "Quelles cultures me recommandez-vous ?"`;

  return `🌱 Bonne question !\n\nJe n'ai pas encore de réponse précise sur ce sujet.\nPosez-moi une question sur :\n• La météo agricole\n• Les recommandations IA\n• Le Marketplace\n• La carte agricole\n• Votre compte`;
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function AvaPage() {
  const [messages, setMessages] = useState<AvaMessage[]>([
    { id: 'welcome', role: 'ava', content: 'Bonjour 👋\nJe suis AVA 🌱, votre assistante agricole AI-Forest Planner.\n\nJe peux répondre à toutes vos questions sur l\'application, les cultures, la météo, le Marketplace et bien plus encore.\n\nComment puis-je vous aider ?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text: string) => {
    const message = text.trim();
    if (!message || loading) return;

    setMessages(prev => [...prev, { id: `user-${Date.now()}`, role: 'user', content: message }]);
    setInput('');
    setLoading(true);

    try {
      const reply = await sendMessageToAva(message);
      setMessages(prev => [...prev, { id: `ava-${Date.now()}`, role: 'ava', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { id: `err-${Date.now()}`, role: 'ava', content: '⚠️ Une erreur est survenue. Réessayez.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => { e.preventDefault(); send(input); };

  return (
    <div className="flex min-h-screen flex-col bg-green-50 text-gray-900">
      <Navbar />

      <main className="flex flex-1 flex-col">

        {/* HERO */}
        <section className="bg-green-950 px-6 pt-28 pb-10 sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-green-400">Assistant IA</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                AVA <span className="text-green-400">🌱</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-green-200">
                Votre assistante agricole intelligente. Posez vos questions sur AI-Forest Planner, les cultures, la météo, le Marketplace et plus encore — disponible 24h/24.
              </p>
            </div>
            <div className="hidden shrink-0 sm:block">
              <DownloadCta label="Télécharger l'app" />
            </div>
          </div>
        </section>

        {/* CHAT + SIDEBAR */}
        <section className="flex flex-1 px-4 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto flex w-full max-w-7xl gap-6">

            {/* SIDEBAR — suggestions */}
            <aside className="hidden w-64 shrink-0 lg:block">
              <div className="sticky top-24 space-y-4">
                <div className="rounded-[1.5rem] border border-green-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-green-600">Questions rapides</p>
                  <div className="mt-4 space-y-2">
                    {SUGGESTIONS.map(s => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        disabled={loading}
                        className="w-full rounded-xl border border-green-100 bg-green-50 px-3 py-2.5 text-left text-xs font-medium text-gray-700 transition hover:border-green-300 hover:bg-green-100 disabled:opacity-50"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-green-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-green-600">En savoir plus</p>
                  <div className="mt-4 space-y-2">
                    {[
                      { label: 'Fonctionnalités', href: '/features' },
                      { label: 'Guide complet', href: '/guide' },
                      { label: 'IA & Monitoring', href: '/monitoring' },
                      { label: 'Communauté', href: '/community' },
                    ].map(l => (
                      <Link key={l.href} href={l.href}
                        className="flex items-center justify-between rounded-xl border border-green-100 bg-green-50 px-3 py-2.5 text-xs font-medium text-gray-700 transition hover:border-green-300 hover:bg-green-100">
                        {l.label}
                        <svg className="h-3.5 w-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* CHAT WINDOW */}
            <div className="flex flex-1 flex-col overflow-hidden rounded-[2rem] border border-green-200 bg-white shadow-sm">

              {/* Chat header */}
              <div className="flex items-center gap-3 border-b border-green-100 bg-gradient-to-r from-green-950 to-green-800 px-6 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20 text-lg font-bold text-white ring-2 ring-green-400/30">
                  🌱
                </div>
                <div>
                  <p className="text-sm font-bold text-white">AVA</p>
                  <p className="text-xs text-green-300">Assistante Agricole · En ligne</p>
                </div>
                <span className="ml-auto flex items-center gap-1.5 text-xs text-green-300">
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  Disponible
                </span>
              </div>

              {/* Messages */}
              <div className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-green-50/60 to-white p-5" style={{ minHeight: '400px', maxHeight: '60vh' }}>
                <AnimatePresence initial={false}>
                  {messages.map(msg => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'ava' && (
                        <span className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm">🌱</span>
                      )}
                      <div className={`max-w-[80%] whitespace-pre-line rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm ${
                        msg.role === 'user'
                          ? 'rounded-br-lg bg-green-600 text-white'
                          : 'rounded-bl-lg border border-green-100 bg-white text-gray-700'
                      }`}>
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <span className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm">🌱</span>
                    <div className="rounded-3xl rounded-bl-lg border border-green-100 bg-white px-4 py-3 text-sm text-gray-400 shadow-sm">
                      <span className="inline-flex gap-1">
                        <span className="animate-bounce">•</span>
                        <span className="animate-bounce [animation-delay:0.15s]">•</span>
                        <span className="animate-bounce [animation-delay:0.3s]">•</span>
                      </span>
                    </div>
                  </motion.div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Mobile suggestions */}
              <div className="flex gap-2 overflow-x-auto border-t border-green-50 px-4 py-2 lg:hidden">
                {SUGGESTIONS.slice(0, 3).map(s => (
                  <button key={s} onClick={() => send(s)} disabled={loading}
                    className="shrink-0 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-green-100 disabled:opacity-50">
                    {s}
                  </button>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="border-t border-green-100 bg-white p-4">
                <div className="flex items-center gap-3">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Posez votre question à AVA..."
                    className="min-w-0 flex-1 rounded-full border border-green-200 bg-green-50 px-5 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={loading || input.trim().length === 0}
                    className="shrink-0 rounded-full bg-gradient-to-r from-green-700 to-green-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
