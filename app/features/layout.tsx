import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fonctionnalités',
  description:
    "Découvrez les outils IA d'Ai-Forest Planner : monitoring des cultures, analyse des sols, alertes météo en temps réel et marketplace agricole pour l'Afrique.",
  keywords: ['fonctionnalités agriculture IA', 'monitoring cultures', 'analyse sols Afrique', 'alertes météo agricoles', 'marketplace agricole'],
  alternates: { canonical: 'https://www.das-congo.tech/features' },
  openGraph: {
    title: 'Fonctionnalités — Ai-Forest Planner',
    description: "Les outils IA essentiels pour piloter vos cultures : monitoring, analyse des sols, alertes météo et marketplace.",
    url: 'https://www.das-congo.tech/features',
  },
};

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
