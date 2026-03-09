'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { IconShoppingCart, IconTruck, IconUsers, IconCash } from '@tabler/icons-react';

interface Stats {
  monthlyPurchases: number;
  pendingOrders: number;
  supplierCount: number;
}

interface Purchase {
  id: string;
  number: string;
  type: string;
  status: string;
  subtotal: number;
  total: number;
  createdAt: string;
  supplier?: { id: string; name: string } | null;
}

const STATUS_LABELS: Record<string, string> = {
  draft: 'Brouillon', confirmed: 'Confirmé', sent: 'Envoyé', received: 'Reçu', cancelled: 'Annulé',
};
const STATUS_COLORS: Record<string, { bg: string; fg: string }> = {
  draft: { bg: '#f0f2f5', fg: '#666' },
  confirmed: { bg: '#e3f2fd', fg: '#1565c0' },
  sent: { bg: '#fff3e0', fg: '#e65100' },
  received: { bg: '#e8f5e9', fg: '#2e7d32' },
  cancelled: { bg: '#ffebee', fg: '#c62828' },
};

export default function PurchasesPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { loadData(); }, []);
  useEffect(() => { loadOrders(); }, [statusFilter]);

  async function loadData() {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        api.get('/purchases/stats'),
        api.get('/purchases/orders', { params: { limit: '50' } }),
      ]);
      setStats(statsRes.data);
      setOrders(ordersRes.data.data || ordersRes.data);
    } catch { /* skip */ } finally {
      setLoading(false);
    }
  }

  async function loadOrders() {
    try {
      const params: Record<string, string> = { limit: '50' };
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/purchases/orders', { params });
      setOrders(res.data.data || res.data);
    } catch { /* skip */ }
  }

  async function receiveOrder(id: string) {
    const warehouseId = prompt('ID de l\'entrepôt de réception:');
    if (!warehouseId) return;
    try {
      await api.post(`/purchases/orders/${id}/receive`, { warehouseId });
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur lors de la réception');
    }
  }

  function fmt(n: number) {
    return new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND', minimumFractionDigits: 3 }).format(n);
  }

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, color: '#888' }}>Chargement...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#101c37' }}>Achats & Fournisseurs</h2>
          <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Gérez vos bons de commande et fournisseurs</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/dashboard/purchases/suppliers" style={btnSecondary}>
            Fournisseurs
          </Link>
          <Link href="/dashboard/purchases/new" style={btnPrimary}>
            + Nouveau BC
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard icon={<IconCash size={22} />} title="Achats ce mois" value={fmt(stats?.monthlyPurchases ?? 0)} color="#264b8d" />
        <StatCard icon={<IconShoppingCart size={22} />} title="BC en attente" value={String(stats?.pendingOrders ?? 0)} color="#e65100" />
        <StatCard icon={<IconUsers size={22} />} title="Fournisseurs" value={String(stats?.supplierCount ?? 0)} color="#2e7d32" />
      </div>

      {/* Orders table */}
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8ecf1', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e8ecf1', display: 'flex', gap: 8 }}>
          {['', 'draft', 'confirmed', 'sent', 'received', 'cancelled'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
                background: statusFilter === s ? '#101c37' : '#f0f2f5',
                color: statusFilter === s ? '#fff' : '#666',
              }}>
              {s === '' ? 'Tous' : STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fb' }}>
              <Th>N°</Th>
              <Th>Date</Th>
              <Th>Fournisseur</Th>
              <Th>Total</Th>
              <Th>Statut</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#888' }}>Aucun bon de commande</td></tr>
            ) : orders.map((o) => {
              const sc = STATUS_COLORS[o.status] || { bg: '#f0f2f5', fg: '#666' };
              const canReceive = o.status === 'confirmed' || o.status === 'sent';
              return (
                <tr key={o.id} style={{ borderBottom: '1px solid #f0f2f5' }}>
                  <Td bold>{o.number}</Td>
                  <Td>{new Date(o.createdAt).toLocaleDateString('fr-TN', { day: '2-digit', month: 'short', year: 'numeric' })}</Td>
                  <Td>{o.supplier?.name || '—'}</Td>
                  <Td bold>{fmt(o.total)}</Td>
                  <Td>
                    <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: sc.bg, color: sc.fg }}>
                      {STATUS_LABELS[o.status] || o.status}
                    </span>
                  </Td>
                  <Td>
                    {canReceive && (
                      <button onClick={() => receiveOrder(o.id)}
                        style={{ padding: '4px 12px', borderRadius: 6, background: '#e8f5e9', color: '#2e7d32', border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                        Réceptionner
                      </button>
                    )}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: string; color: string }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid #e8ecf1', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>{icon}</div>
      <div>
        <p style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5 }}>{title}</p>
        <p style={{ fontSize: 20, fontWeight: 700, color }}>{value}</p>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 }}>{children}</th>;
}

function Td({ children, bold }: { children: React.ReactNode; bold?: boolean }) {
  return <td style={{ padding: '12px 16px', fontSize: 13, color: '#333', fontWeight: bold ? 600 : 400 }}>{children}</td>;
}

const btnPrimary: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', borderRadius: 8,
  background: '#101c37', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none',
};
const btnSecondary: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', borderRadius: 8,
  background: '#f0f2f5', color: '#666', fontSize: 13, fontWeight: 600, textDecoration: 'none',
};
