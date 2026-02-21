import PropTypes from 'prop-types';

// @style
import './globals.css';

// @mui
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

// @project
import ProviderWrapper from './ProviderWrapper';

/***************************  METADATA - MAIN  ***************************/

export const metadata = {
  title: 'TuniERP — Plateforme ERP Modulaire',
  description: 'TuniERP est une plateforme ERP modulaire conçue pour les entreprises tunisiennes. Gestion des ventes, stocks, facturation, CRM et plus.',
  keywords: ['ERP', 'Tunisie', 'gestion commerciale', 'facturation', 'POS', 'CRM', 'TuniERP'],
  authors: [{ name: 'TuniERP' }],
  openGraph: {
    title: 'TuniERP — Plateforme ERP Modulaire',
    description: 'Solution ERP complète pour les entreprises tunisiennes.',
    url: 'https://tunierp.com',
    siteName: 'TuniERP',
    type: 'website'
  }
};

/***************************  LAYOUT - MAIN  ***************************/

// Root layout component that wraps the entire application
export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ProviderWrapper>{children}</ProviderWrapper>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

RootLayout.propTypes = { children: PropTypes.any };
