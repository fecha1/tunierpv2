import PropTypes from 'prop-types';

// @style
import './globals.css';

// @mui
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';

// @project
import branding from '@/branding.json';
import ProviderWrapper from './ProviderWrapper';

/***************************  METADATA - MAIN  ***************************/

// Configures the viewport settings for the application.
export const viewport = {
  userScalable: false // Disables user scaling of the viewport.
};

export const metadata = {
  title: `${branding.brandName} — Plateforme ERP Modulaire`,
  description: 'TuniERP : solution ERP modulaire pour les entreprises tunisiennes. Gestion des ventes, inventaire, facturation, CRM et plus.'
};

/***************************  LAYOUT - ROOT  ***************************/

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
