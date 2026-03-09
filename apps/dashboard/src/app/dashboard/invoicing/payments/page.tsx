'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Payment {
  id: string;
  amount: number;
  method: string;
  reference: string | null;
  notes: string | null;
  createdAt: string;
  sale?: { number: string; type: string } | null;
  customer?: { name: string } | null;
}

const METHOD_LABELS: Record<string, string> = {
  cash: 'Espèces', card: 'Carte', bank_transfer: 'Virement', cheque: 'Chèque', other: 'Autre',
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [methodFilter, setMethodFilter] = useState('');

  useEffect(() => { load(); }, [methodFilter]);

  async function load() {
    setLoading(true);
    try {
      const params: Record<string, string> = { limit: '100' };
      if (methodFilter) params.method = methodFilter;
      const res = await api.get('/invoicing/payments', { params });
      setPayments(res.data);
    } catch { /* skip */ } finally {
      setLoading(false);
    }
  }

  function fmt(n: number) {
    return new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND', minimumFractionDigits: 3 }).format(n);
  }

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#101c37', marginBottom: 4 }}>Paiements</h2>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>Historique de tous les paiements reçus</p>

      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8ecf1', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e8ecf1', display: 'flex', gap: 8 }}>
          {['', 'cash', 'card', 'bank_transfer', 'cheque'].map((m) => (
            <button key={m} onClick={() => setMethodFilter(m)}
              style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
                background: methodFilter === m ? '#101c37' : '#f0f2f5',
                color: methodFilter === m ? '#fff' : '#666',
              }}>
              {m === '' ? 'Tous' : METHOD_LABELS[m] || m}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Chargement...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fb' }}>
                <Th>Date</Th>
                <Th>Document</Th>
                <Th>Client</Th>
                <Th>Méthode</Th>
                <Th>Référence</Th>
                <Th>Montant</Th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#888' }}>Aucun paiement</td></tr>
              ) : payments.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f0f2f5' }}>
                  <Td>{new Date(p.createdAt).toLocaleDateString('fr-TN', { day: '2-digit', month: 'short', year: 'numeric' })}</Td>
                  <Td bold>{p.sale?.number || '—'}</Td>
                  <Td>{p.customer?.name || '—'}</Td>
                  <Td>{METHOD_LABELS[p.method] || p.method}</Td>
                  <Td>{p.reference || '—'}</Td>
                  <Td bold>{fmt(p.amount)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
