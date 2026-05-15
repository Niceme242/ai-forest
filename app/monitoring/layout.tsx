import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IA & Monitoring',
  description:
    "Suivez vos terres agricoles en temps réel avec Ai-Forest Planner. Indicateurs clairs, alertes intelligentes et données de précision pour une meilleure gestion agricole en Afrique.",
  keywords: ['monitoring agricole', 'suivi cultures temps réel', 'données agricoles', 'IA monitoring Afrique', 'indicateurs agricoles'],
  alternates: { canonical: 'https://www.das-congo.tech/monitoring' },
  openGraph: {
    title: 'IA & Monitoring — Ai-Forest Planner',
    description: "Suivez vos terres en temps réel avec des indicateurs agricoles clairs et des alertes intelligentes.",
    url: 'https://www.das-congo.tech/monitoring',
  },
};

export default function MonitoringLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
