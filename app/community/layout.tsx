import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Communauté',
  description:
    "Rejoignez la communauté Ai-Forest Planner. Connectez-vous avec des milliers d'agriculteurs et de collectifs à travers toute l'Afrique pour partager, apprendre et progresser ensemble.",
  keywords: ['communauté agriculteurs Afrique', 'réseau agricole', 'collectifs agricoles', 'partage agriculteurs', 'communauté agriculture intelligente'],
  alternates: { canonical: 'https://www.das-congo.tech/community' },
  openGraph: {
    title: 'Communauté — Ai-Forest Planner',
    description: "Connectez-vous avec des milliers d'agriculteurs et collectifs africains sur Ai-Forest Planner.",
    url: 'https://www.das-congo.tech/community',
  },
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
