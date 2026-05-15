import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Outfit } from 'next/font/google';
import './globals.css';

const AvaPopup = dynamic(() => import('../components/AvaPopup').then(m => ({ default: m.AvaPopup })), { ssr: false });

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-outfit',
});

const BASE_URL = 'https://www.das-congo.tech';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  title: {
    default: 'Ai-Forest Planner — Agriculture intelligente en Afrique',
    template: '%s | Ai-Forest Planner',
  },
  description:
    "Ai-Forest Planner est la plateforme panafricaine d'agriculture intelligente. Planifiez, suivez et optimisez vos cultures grâce à l'IA. Développé par DAS - Data Analytic Solutions.",
  keywords: [
    'agriculture intelligente',
    'IA agriculture',
    'planification agricole',
    'gestion agricole Afrique',
    'monitoring agricole',
    'agriculture Congo',
    'agriculture panafricaine',
    'Ai-Forest Planner',
    'DAS Data Analytic Solutions',
    'das-congo.tech',
    'application agricole',
    'analyse sols',
    'alertes météo agriculture',
    'marketplace agricole',
  ],
  authors: [{ name: 'DAS - Data Analytic Solutions', url: BASE_URL }],
  creator: 'DAS - Data Analytic Solutions',
  publisher: 'DAS - Data Analytic Solutions',
  alternates: { canonical: BASE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: BASE_URL,
    siteName: 'Ai-Forest Planner',
    title: 'Ai-Forest Planner — Agriculture intelligente en Afrique',
    description:
      "La plateforme IA pour planifier, suivre et sécuriser vos projets agricoles en Afrique. Développé par DAS - Data Analytic Solutions.",
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Ai-Forest Planner — Agriculture intelligente' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@aiforestplanner',
    creator: '@das_congo',
    title: 'Ai-Forest Planner — Agriculture intelligente en Afrique',
    description: "Planifiez et optimisez vos cultures grâce à l'IA. Plateforme panafricaine par DAS - Data Analytic Solutions.",
    images: ['/og-image.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Ai-Forest Planner',
  description:
    "Plateforme panafricaine d'agriculture intelligente permettant de planifier, suivre et optimiser les cultures grâce à l'IA.",
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, Android, iOS',
  url: BASE_URL,
  author: {
    '@type': 'Organization',
    name: 'DAS - Data Analytic Solutions',
    url: BASE_URL,
    email: 'info@das-congo.tech',
    sameAs: [BASE_URL],
  },
  inLanguage: 'fr',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preload" as="image" href="/backend.jpg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${outfit.className} min-h-screen bg-green-50 text-gray-900 antialiased`}>
        {children}
        <AvaPopup />
      </body>
    </html>
  );
}
