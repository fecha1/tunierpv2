'use client';

import { usePathname } from 'next/navigation';

/**
 * Catch-all route for module pages.
 * Individual module UIs will be loaded dynamically here in future iterations.
 * For now, shows a placeholder indicating which module page is being accessed.
 */
export default function ModuleCatchAll() {
  const pathname = usePathname();

  // Extract module info from path
  const segments = pathname.split('/').filter(Boolean);
  // e.g. /dashboard/inventory/stock → ['dashboard', 'inventory', 'stock']
  const moduleName = segments[1] || 'unknown';
  const subPage = segments.slice(2).join(' / ') || 'Vue d\'ensemble';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 400,
      textAlign: 'center',
    }}>
      <div style={{
        width: 80,
        height: 80,
        borderRadius: 20,
        background: 'linear-gradient(135deg, #101c37, #264b8d)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
      }}>
        <span style={{ fontSize: 32 }}>📦</span>
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#101c37', marginBottom: 8 }}>
        Module: {moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}
      </h2>
      <p style={{ fontSize: 14, color: '#888', marginBottom: 4 }}>
        Page: {subPage}
      </p>
      <p style={{ fontSize: 13, color: '#bbb', maxWidth: 400, marginTop: 12 }}>
        Cette page de module sera bientôt disponible. L&apos;interface utilisateur pour chaque module
        sera construite dans les prochaines étapes du développement.
      </p>
    </div>
  );
}
