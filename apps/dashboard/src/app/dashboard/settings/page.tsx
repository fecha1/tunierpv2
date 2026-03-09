'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth';

export default function SettingsPage() {
  const { tenant } = useAuthStore();
  const [modules, setModules] = useState<any[]>([]);
  const [activeModules, setActiveModules] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModules();
  }, []);

  async function loadModules() {
    try {
      const [catalogRes, activeRes] = await Promise.all([
        api.get('/modules/catalog'),
        api.get('/modules/active'),
      ]);
      setModules(catalogRes.data);
      setActiveModules(activeRes.data.map((m: any) => m.code));
    } catch {
      // skip
    } finally {
      setLoading(false);
    }
  }



  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#101c37', marginBottom: 8 }}>
        Paramètres
      </h2>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 32 }}>
        Gérez les modules et la configuration de {tenant?.name}
      </p>

      {/* Info banner */}
      <div style={{
        background: '#eef2ff',
        border: '1px solid #c5cae9',
        borderRadius: 12,
        padding: '16px 20px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}>
        <div>
          <p style={{ fontSize: 13, color: '#264b8d', fontWeight: 600, marginBottom: 4 }}>
            Besoin d&apos;un module supplémentaire ?
          </p>
          <p style={{ fontSize: 12, color: '#666' }}>
            Contactez l&apos;administrateur de la plateforme pour activer des modules payants.
          </p>
        </div>
        <a
          href="mailto:contact@tunierp.tn?subject=Demande d'activation de module"
          style={{
            padding: '8px 20px',
            borderRadius: 8,
            background: '#264b8d',
            color: '#fff',
            fontSize: 12,
            fontWeight: 600,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          Demander un module
        </a>
      </div>

      {/* Modules management */}
      <div style={{
        background: '#fff',
        borderRadius: 14,
        border: '1px solid #e8ecf1',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e8ecf1' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#333' }}>Modules disponibles</h3>
          <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
            Les modules sont gérés par l&apos;administrateur de la plateforme
          </p>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Chargement...</div>
        ) : (
          <div style={{ padding: '16px 24px' }}>
            {modules.map((mod) => {
              const isActive = activeModules.includes(mod.code);
              return (
                <div
                  key={mod.code}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 0',
                    borderBottom: '1px solid #f0f2f5',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>
                      {mod.name}
                      {mod.isCore && (
                        <span style={{
                          marginLeft: 8,
                          fontSize: 10,
                          padding: '2px 8px',
                          background: '#e8ecf1',
                          borderRadius: 4,
                          color: '#666',
                          fontWeight: 500,
                        }}>
                          MODULE DE BASE
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{mod.description}</div>
                    {mod.monthlyPrice > 0 && (
                      <div style={{ fontSize: 12, color: '#264b8d', fontWeight: 500, marginTop: 4 }}>
                        {mod.monthlyPrice} TND/mois
                      </div>
                    )}
                  </div>

                  <span
                    style={{
                      padding: '8px 20px',
                      borderRadius: 8,
                      border: isActive ? '1px solid #2e7d32' : '1px solid #bbb',
                      background: isActive ? '#e8f5e9' : '#f5f5f5',
                      color: isActive ? '#2e7d32' : '#888',
                      fontWeight: 600,
                      fontSize: 12,
                    }}
                  >
                    {mod.isCore ? 'Inclus' : isActive ? 'Activé' : 'Non activé'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
