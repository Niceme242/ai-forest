'use client';

import { FormEvent, useMemo, useState } from 'react';

type AvaMessage = {
  id: string;
  role: 'ava' | 'user';
  content: string;
};

const AVA_WELCOME_MESSAGE = `
Bonjour 👋
Je suis AVA 🌱
Comment puis-je vous aider sur AI-Forest Planner ?
`;

const AI_FOREST_KEYWORDS = [
  'ai-forest',
  'ai forest',
  'aiforest',
  'ava',
  'application',
  'app',
  'fonctionnalité',
  'fonctionnalites',
  'fonctionnalités',
  'fonction',
  'aide',
  'aider',
  'assistant',
  'agriculture',
  'agricole',
  'culture',
  'cultures',
  'plantation',
  'plantations',
  'météo',
  'meteo',
  'marketplace',
  'chat ai',
  'recommandation',
  'recommandations',
  'sol',
  'irrigation',
  'manioc',
  'arachide',
  'maïs',
  'mais',
  'climat',
  'parcelle',
  'engrais',
  'récolte',
  'recolte',
  'profil',
  'compte',
  'connexion',
  'inscription',
  'carte',
  'carte agricole',
  'dashboard',
  'planning',
  'calendrier',
  'diagnostic',
  'maladie',
  'ravageur',
];

function isGreeting(message: string) {
  const greetings = [
    'salut',
    'bonjour',
    'bonsoir',
    'hello',
    'hi',
    'cc',
    'coucou',
  ];

  return greetings.includes(message.toLowerCase().trim());
}

function isAgricultureQuestion(message: string) {
  const lowerMessage = message.toLowerCase();

  return AI_FOREST_KEYWORDS.some((keyword) =>
    lowerMessage.includes(keyword),
  );
}

async function sendMessageToAva(message: string): Promise<string> {
  const lowerMessage = message.toLowerCase();

  // Salutations
  if (isGreeting(message)) {
    return `
Bonjour 👋
Je suis AVA 🌱
Comment puis-je vous aider sur AI-Forest Planner ?
    `;
  }

  // Présentation AI-Forest
  if (
    lowerMessage.includes('c quoi ai-forest') ||
    lowerMessage.includes('c’est quoi ai-forest') ||
    lowerMessage.includes('c est quoi ai-forest') ||
    lowerMessage.includes('c quoi ai forest') ||
    lowerMessage.includes('ai-forest') ||
    lowerMessage.includes('ai forest')
  ) {
    return `
🌱 AI-Forest Planner est une application agricole intelligente utilisant l’intelligence artificielle.

Elle permet :
• d’obtenir des recommandations agricoles,
• suivre la météo,
• gérer les plantations,
• utiliser le Chat AI,
• accéder à une carte agricole,
• vendre des produits agricoles.

AI-Forest Planner aide à moderniser l’agriculture en Afrique 🌍
    `;
  }

  // Demande d’aide
  if (
    lowerMessage.includes('aide') ||
    lowerMessage.includes('aider') ||
    lowerMessage.includes('help')
  ) {
    return `
🤖 Je peux vous aider concernant :

• 🌦️ la météo agricole
• 🤖 les recommandations IA
• 🛒 le Marketplace
• 🗺️ la carte agricole
• 🌱 les cultures
• 📅 le calendrier agricole
• 👤 votre compte
• 💬 le Chat AI
    `;
  }

  // Hors sujet
  if (!isAgricultureQuestion(message)) {
    return `
Je suis AVA 🌱

Je peux uniquement répondre aux questions liées à AI-Forest Planner.
    `;
  }

  // Météo
  if (
    lowerMessage.includes('météo') ||
    lowerMessage.includes('meteo')
  ) {
    return `
🌦️ La météo agricole affiche :
• la température,
• l’humidité,
• le vent,
• et les précipitations en temps réel.

Ces données aident à optimiser vos activités agricoles.
    `;
  }

  // Marketplace
  if (
    lowerMessage.includes('marketplace') ||
    lowerMessage.includes('vendre') ||
    lowerMessage.includes('produit')
  ) {
    return `
🛒 Pour publier un produit :

1. Ouvrez le Marketplace
2. Cliquez sur +
3. Ajoutez vos photos
4. Définissez le prix
5. Ajoutez une description
6. Publiez votre annonce
    `;
  }

  // Carte
  if (
    lowerMessage.includes('carte') ||
    lowerMessage.includes('région') ||
    lowerMessage.includes('region')
  ) {
    return `
🗺️ La Carte Agricole Interactive couvre 82 régions agricoles en Afrique Centrale.

Vous pouvez :
• rechercher une région,
• filtrer les zones,
• explorer les opportunités agricoles.
    `;
  }

  // Chat AI
  if (
    lowerMessage.includes('chat ai') ||
    lowerMessage.includes('assistant')
  ) {
    return `
🤖 Le Chat AI peut vous aider pour :
• les maladies agricoles,
• les plantations,
• les rendements,
• les prix du marché,
• les conseils agricoles intelligents.
    `;
  }

  // IA
  if (
    lowerMessage.includes('recommandation') ||
    lowerMessage.includes('ia')
  ) {
    return `
🌱 Les recommandations IA sont générées selon :
• votre localisation,
• vos cultures,
• la météo,
• la saison agricole.
    `;
  }

  // Connexion
  if (
    lowerMessage.includes('connexion') ||
    lowerMessage.includes('compte') ||
    lowerMessage.includes('inscription')
  ) {
    return `
🔐 Pour utiliser toutes les fonctionnalités :

1. Créez un compte
2. Connectez-vous
3. Accédez au Chat AI, Marketplace et recommandations IA.
    `;
  }

  // Webhook n8n
  try {
    /*
    const response = await fetch('https://votre-webhook.com/webhook/ava', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    return data.reply;
    */

    return `
🌱 Posez-moi une question sur AI-Forest Planner.
    `;
  } catch {
    return `
⚠️ Impossible de répondre pour le moment.
Veuillez réessayer plus tard.
    `;
  }
}

export function AvaPopup() {
  const initialMessages = useMemo<AvaMessage[]>(
    () => [
      {
        id: 'welcome',
        role: 'ava',
        content: AVA_WELCOME_MESSAGE,
      },
    ],
    [],
  );

  // Chat fermé au chargement
  const [open, setOpen] = useState(false);

  const [input, setInput] = useState('');

  const [messages, setMessages] =
    useState<AvaMessage[]>(initialMessages);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const message = input.trim();

    if (!message || loading) return;

    const userMessage: AvaMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message,
    };

    setMessages((current) => [...current, userMessage]);

    setInput('');
    setLoading(true);

    try {
      const reply = await sendMessageToAva(message);

      setMessages((current) => [
        ...current,
        {
          id: `ava-${Date.now()}`,
          role: 'ava',
          content: reply,
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `ava-error-${Date.now()}`,
          role: 'ava',
          content:
            "⚠️ Une erreur est survenue.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999] max-w-[calc(100vw-2rem)]">

      {/* CHAT */}
      {open && (
        <div className="mb-4 flex h-[560px] w-[370px] max-w-full flex-col overflow-hidden rounded-[2rem] border border-green-200/50 bg-white shadow-2xl backdrop-blur-xl">

          {/* HEADER */}
          <div className="flex items-center justify-between bg-gradient-to-r from-green-950 via-green-900 to-green-700 px-5 py-4 text-white">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-green-300">
                AVA
              </p>

              <p className="mt-1 text-sm font-semibold">
                Assistant Agricole
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xl transition hover:bg-white/20"
            >
              ×
            </button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-green-50 to-white p-4">

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-green-600 text-white'
                      : 'border border-green-100 bg-white text-gray-700'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-3xl border border-green-100 bg-white px-4 py-3 text-sm text-gray-500 shadow-sm">
                  🌱 AVA écrit...
                </div>
              </div>
            )}
          </div>

          {/* INPUT */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-green-100 bg-white p-3"
          >
            <div className="flex items-center gap-2">

              <input
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                placeholder="Posez votre question..."
                className="min-w-0 flex-1 rounded-full border border-green-200 bg-green-50/50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
              />

              <button
                type="submit"
                disabled={
                  loading || input.trim().length === 0
                }
                className="rounded-full bg-gradient-to-r from-green-700 to-green-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Envoyer
              </button>

            </div>
          </form>
        </div>
      )}

      {/* FLOATING BUTTON */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="ml-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-700 to-green-500 text-sm font-bold text-white shadow-2xl shadow-green-900/30 transition hover:scale-110"
  aria-label="Ouvrir AVA"
      >
        AVA
      </button>
    </div>
  );
}