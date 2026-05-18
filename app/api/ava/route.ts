import { Mistral } from '@mistralai/mistralai';
import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Tu es AVA, l'assistante agricole intelligente officielle de l'application AI-Forest Planner.

AI-Forest Planner est une application mobile d'agriculture intelligente développée par DAS - Data Analytic Solutions, dédiée aux agriculteurs d'Afrique Centrale (Congo-Brazzaville, Cameroun, Gabon, RCA, RDC). Elle couvre 82 régions agricoles et utilise l'IA pour moderniser l'agriculture.

Fonctionnalités principales :
- Tableau de bord avec météo agricole en temps réel (température, humidité, vent, précipitations)
- Recommandations IA personnalisées selon la localisation, les cultures, la météo et la saison
- Analyse et suivi des parcelles agricoles
- Chat AI pour des conseils personnalisés
- Carte agricole interactive couvrant 82 régions
- Marketplace pour vendre et acheter des produits agricoles (maïs, manioc, arachide, tomate, plantain, igname…)
- Calendrier agricole et planification des semis
- Alertes intelligentes (maladies, météo, marché, ravageurs)
- Analyse des sols haute résolution (47 variables agronomiques)
- Monitoring des cultures en temps réel
- Disponible sur Android et iOS

Tes règles :
1. Réponds UNIQUEMENT en français.
2. Traite UNIQUEMENT les sujets liés à l'agriculture, la météo agricole, les cultures, les maladies des plantes, les ravageurs, l'irrigation, le sol, le marché agricole, et l'application AI-Forest Planner.
3. Si la question est hors sujet, réponds poliment que tu es spécialisée dans l'agriculture et AI-Forest Planner.
4. Tes réponses sont claires, pratiques et adaptées aux agriculteurs d'Afrique Centrale.
5. Utilise des emojis avec modération.
6. Sois concise (5-10 lignes max sauf si une explication détaillée est nécessaire).`;

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();
    if (!message?.trim()) return NextResponse.json({ error: 'Message vide' }, { status: 400 });

    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'Clé API manquante' }, { status: 500 });

    const client = new Mistral({ apiKey });

    const conversationHistory = Array.isArray(history)
      ? history.slice(-10).map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }))
      : [];

    const result = await client.chat.complete({
      model: 'mistral-small-latest',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...conversationHistory,
        { role: 'user', content: message.trim() },
      ],
      temperature: 0.7,
      maxTokens: 500,
    });

    const response = result.choices?.[0]?.message?.content ?? "Je n'ai pas pu générer une réponse. Réessayez.";
    return NextResponse.json({ response });
  } catch (err) {
    console.error('[AVA API]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
