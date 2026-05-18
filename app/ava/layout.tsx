import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AVA — Assistante Agricole IA',
  description: "Posez toutes vos questions sur AI-Forest Planner à AVA, votre assistante agricole intelligente disponible 24h/24.",
};

export default function AvaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
