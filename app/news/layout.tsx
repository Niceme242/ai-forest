import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Actualités',
  description:
    "Suivez les dernières actualités d'Ai-Forest Planner : mises à jour, nouveautés, partenariats et innovations pour l'agriculture intelligente en Afrique centrale.",
  keywords: ['actualités agriculture IA', 'news Ai-Forest Planner', 'innovations agricoles Afrique', 'mises à jour agriculture intelligente', 'partenariats agricoles'],
  alternates: { canonical: 'https://www.das-congo.tech/news' },
  openGraph: {
    title: 'Actualités — Ai-Forest Planner',
    description: "Les dernières nouvelles et innovations d'Ai-Forest Planner pour l'agriculture intelligente en Afrique.",
    url: 'https://www.das-congo.tech/news',
  },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
