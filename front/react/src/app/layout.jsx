import PropTypes from 'prop-types';

// @next
import { Inter } from 'next/font/google';

// @style
import './globals.css';

// @mui
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';

// @project
import ProviderWrapper from './ProviderWrapper';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif']
});

/***************************  METADATA - MAIN  ***************************/

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#101c37'
};

export const metadata = {
  title: 'TuniERP — Plateforme ERP Modulaire',
  description: 'TuniERP est une plateforme ERP modulaire conçue pour les entreprises tunisiennes. Gestion des ventes, stocks, facturation, CRM et plus.',
  keywords: ['ERP', 'Tunisie', 'gestion commerciale', 'facturation', 'POS', 'CRM', 'TuniERP'],
  authors: [{ name: 'TuniERP' }],
  metadataBase: new URL('https://tunierp.tn'),
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'TuniERP — Plateforme ERP Modulaire',
    description: 'Solution ERP complète pour les entreprises tunisiennes.',
    url: 'https://tunierp.tn',
    siteName: 'TuniERP',
    type: 'website',
    locale: 'fr_TN'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TuniERP — Plateforme ERP Modulaire',
    description: 'Solution ERP complète pour les entreprises tunisiennes.'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};

// JSON-LD structured data for SEO
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'TuniERP',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: 'Plateforme ERP modulaire conçue pour les entreprises tunisiennes.',
  url: 'https://tunierp.tn',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'TND',
    description: 'Essai gratuit disponible'
  },
  creator: {
    '@type': 'Organization',
    name: 'TuniERP',
    url: 'https://tunierp.tn'
  }
};

/***************************  LAYOUT - MAIN  ***************************/

// Root layout component that wraps the entire application
export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={inter.variable} suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ProviderWrapper>{children}</ProviderWrapper>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

RootLayout.propTypes = { children: PropTypes.any };
