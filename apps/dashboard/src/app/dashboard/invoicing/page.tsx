'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { IconFileInvoice, IconCash, IconReceipt, IconChartLine } from '@tabler/icons-react';

interface Stats {
  monthlyRevenue: number;
  unpaidAmount: number;
  unpaidCount: number;
  monthlyQuotes: number;
  monthlyInvoices: number;
}

interface Sale {
  id: string;
  number: string;
  type: string;
  status: string;
  subtotal: number;
  total: number;
  createdAt: string;
  customer?: { id: string; name: string } | null;
}

const TYPE_LABELS: Record<string, string> = {
  quote: 'Devis', invoice: 'Facture', delivery_note: 'Bon de Livraison',
  proforma: 'Proforma', credit_note: 'Avoir', warranty: 'Garantie', receipt: 'Ticket',
};
const STATUS_LABELS: Record<string, string> = {
  draft: 'Brouillon', confirmed: 'Confirmé', delivered: 'Livré',
  paid: 'Payé', partial: 'Partiel', cancelled: 'Annulé', converted: 'Converti',
};
const STATUS_COLORS: Record<string, { bg: string; fg: string }> = {
  draft: { bg: '#f0f2f5', fg: '#666' },
  confirmed: { bg: '#e3f2fd', fg: '#1565c0' },
  delivered: { bg: '#e8f5e9', fg: '#2e7d32' },
  paid: { bg: '#e8f5e9', fg: '#2e7d32' },
  partial: { bg: '#fff3e0', fg: '#e65100' },
  cancelled: { bg: '#ffebee', fg: '#c62828' },
  converted: { bg: '#f3e5f5', fg: '#6a1b9a' },
};

export default function InvoicingPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => { loadData(); }, []);
  useEffect(() => { loadSales(); }, [typeFilter, statusFilter, search]);

  async function loadData() {
    try {
      const [statsRes, salesRes] = await Promise.all([
        api.get('/invoicing/stats'),
        api.get('/invoicing/sales', { params: { limit: '50' } }),
      ]);
      setStats(statsRes.data);
      setSales(salesRes.data.data || salesRes.data);
    } catch { /* skip */ } finally {
      setLoading(false);
    }
  }

  async function loadSales() {
    try {
      const params: Record<string, string> = { limit: '50' };
      if (typeFilter) params.type = typeFilter;
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      const res = await api.get('/invoicing/sales', { params });
      setSales(res.data.data || res.data);
    } catch { /* skip */ }
  }

  function fmt(n: number) {
    return new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND', minimumFractionDigits: 3 }).format(n);
  }

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, color: '#888' }}>Chargement...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#101c37' }}>Facturation & Ventes</h2>
          <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Gérez vos devis, factures et paiements</p>
        </div>
        <Link href="/dashboard/invoicing/new" style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', borderRadius: 8,
          background: '#101c37', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none',
        }}>
          + Nouvelle vente
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard icon={<IconChartLine size={22} />} title="CA mensuel" value={fmt(stats?.monthlyRevenue ?? 0)} color="#264b8d" />
        <StatCard icon={<IconCash size={22} />} title="Impayés" value={fmt(stats?.unpaidAmount ?? 0)} subtitle={`${stats?.unpaidCount ?? 0} facture(s)`} color="#e65100" />
        <StatCard icon={<IconReceipt size={22} />} title="Devis ce mois" value={String(stats?.monthlyQuotes ?? 0)} color="#6a1b9a" />
        <StatCard icon={<IconFileInvoice size={22} />} title="Factures ce mois" value={String(stats?.monthlyInvoices ?? 0)} color="#2e7d32" />
      </div>

      {/* Sales list */}
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8ecf1', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e8ecf1', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 180, padding: '8px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 13, outline: 'none' }} />
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 13, background: '#fff' }}>
            <option value="">Tous les types</option>
            {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 13, background: '#fff' }}>
            <option value="">Tous les statuts</option>
            {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fb' }}>
              <Th>N°</Th>
              <Th>Date</Th>
              <Th>Type</Th>
              <Th>Client</Th>
              <Th>Total</Th>
              <Th>Statut</Th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#888' }}>Aucune vente trouvée</td></tr>
            ) : sales.map((s) => {
              const sc = STATUS_COLORS[s.status] || { bg: '#f0f2f5', fg: '#666' };
              return (
                <tr key={s.id} style={{ borderBottom: '1px solid #f0f2f5', cursor: 'pointer' }}>
                  <Td bold>{s.number}</Td>
                  <Td>{new Date(s.createdAt).toLocaleDateString('fr-TN', { day: '2-digit', month: 'short', year: 'numeric' })}</Td>
                  <Td>{TYPE_LABELS[s.type] || s.type}</Td>
                  <Td>{s.customer?.name || '—'}</Td>
                  <Td bold>{fmt(s.total)}</Td>
                  <Td>
                    <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: sc.bg, color: sc.fg }}>
                      {STATUS_LABELS[s.status] || s.status}
                    </span>
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

function StatCard({ icon, title, value, subtitle, color }: { icon: React.ReactNode; title: string; value: string; subtitle?: string; color: string }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid #e8ecf1', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>{icon}</div>
      <div>
        <p style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5 }}>{title}</p>
        <p style={{ fontSize: 20, fontWeight: 700, color }}>{value}</p>
        {subtitle && <p style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{subtitle}</p>}
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
