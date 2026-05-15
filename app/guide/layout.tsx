import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guide d\'utilisation',
  description:
    "Guide complet pour prendre en main Ai-Forest Planner en quelques étapes. Authentification, dashboard, IA, carte et marketplace expliqués simplement pour les agriculteurs africains.",
  keywords: ['guide agriculture IA', 'tutoriel Ai-Forest Planner', 'comment utiliser application agricole', 'démarrer agriculture intelligente', 'FAQ agriculture'],
  alternates: { canonical: 'https://www.das-congo.tech/guide' },
  openGraph: {
    title: "Guide d'utilisation — Ai-Forest Planner",
    description: "Apprenez à utiliser Ai-Forest Planner en quelques étapes. Guide complet pour agriculteurs africains.",
    url: 'https://www.das-congo.tech/guide',
  },
};

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
