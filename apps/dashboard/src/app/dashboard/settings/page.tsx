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

  async function toggleModule(code: string, isActive: boolean) {
    try {
      if (isActive) {
        await api.post(`/modules/${code}/deactivate`);
      } else {
        await api.post(`/modules/${code}/activate`);
      }
      await loadModules();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur lors de la modification du module');
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
            Activez ou désactivez les modules selon vos besoins
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

                  <button
                    onClick={() => !mod.isCore && toggleModule(mod.code, isActive)}
                    disabled={mod.isCore}
                    style={{
                      padding: '8px 20px',
                      borderRadius: 8,
                      border: isActive ? '1px solid #e53935' : '1px solid #264b8d',
                      background: isActive ? '#fff0f0' : '#eef2ff',
                      color: isActive ? '#e53935' : '#264b8d',
                      fontWeight: 600,
                      fontSize: 12,
                      cursor: mod.isCore ? 'default' : 'pointer',
                      opacity: mod.isCore ? 0.5 : 1,
                    }}
                  >
                    {mod.isCore ? 'Inclus' : isActive ? 'Désactiver' : 'Activer'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
