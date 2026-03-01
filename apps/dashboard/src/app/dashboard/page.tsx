'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth';

interface DashboardStats {
  tenant: any;
  subscription: any;
}

export default function DashboardPage() {
  const { user, tenant } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [tenantRes, subRes] = await Promise.all([
          api.get('/tenants/current'),
          api.get('/tenants/current/subscription'),
        ]);
        setStats({ tenant: tenantRes.data, subscription: subRes.data });
      } catch {
        // skip
      }
    }
    load();
  }, []);

  return (
    <div>
      {/* Welcome card */}
      <div style={{
        background: 'linear-gradient(135deg, #101c37 0%, #264b8d 100%)',
        borderRadius: 16,
        padding: '32px 40px',
        color: '#fff',
        marginBottom: 32,
      }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
          Bonjour, {user?.firstName} 👋
        </h1>
        <p style={{ fontSize: 14, opacity: 0.85 }}>
          Bienvenue sur le tableau de bord de {tenant?.name || 'votre entreprise'}
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
        <StatCard
          title="Plan actuel"
          value={stats?.subscription?.plan?.name || '—'}
          subtitle={`Statut: ${stats?.subscription?.status || '—'}`}
          color="#264b8d"
        />
        <StatCard
          title="Utilisateurs"
          value={`${stats?.subscription?.usage?.users || 0} / ${stats?.subscription?.usage?.maxUsers || '∞'}`}
          subtitle="Comptes actifs"
          color="#2e7d32"
        />
        <StatCard
          title="Produits"
          value={`${stats?.subscription?.usage?.products || 0}`}
          subtitle={`Max: ${stats?.subscription?.usage?.maxProducts || '∞'}`}
          color="#e65100"
        />
        <StatCard
          title="Modules actifs"
          value={`${stats?.subscription?.activeModules?.length || 0}`}
          subtitle="Modules activés"
          color="#6a1b9a"
        />
      </div>

      {/* Active modules list */}
      {stats?.subscription?.activeModules && (
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#333' }}>
            Modules activés
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {stats.subscription.activeModules.map((mod: any) => (
              <div
                key={mod.code}
                style={{
                  background: '#fff',
                  border: '1px solid #e8ecf1',
                  borderRadius: 10,
                  padding: '14px 20px',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#264b8d',
                }}
              >
                {mod.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, subtitle, color }: {
  title: string;
  value: string;
  subtitle: string;
  color: string;
}) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 14,
      padding: '24px',
      border: '1px solid #e8ecf1',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    }}>
      <p style={{ fontSize: 12, fontWeight: 500, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {title}
      </p>
      <p style={{ fontSize: 28, fontWeight: 700, color, margin: '8px 0 4px' }}>
        {value}
      </p>
      <p style={{ fontSize: 12, color: '#999' }}>{subtitle}</p>
    </div>
  );
}
