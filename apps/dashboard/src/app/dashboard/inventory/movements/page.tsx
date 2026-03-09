'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { IconArrowsExchange } from '@tabler/icons-react';

interface Movement {
  id: string;
  type: string;
  quantity: number;
  reason: string | null;
  createdAt: string;
  product: { name: string; sku: string };
  warehouse: { name: string };
}

const TYPE_LABELS: Record<string, string> = { in: 'Entrée', out: 'Sortie', adjustment: 'Ajustement', transfer: 'Transfert' };
const TYPE_COLORS: Record<string, { bg: string; fg: string }> = {
  in: { bg: '#e8f5e9', fg: '#2e7d32' },
  out: { bg: '#ffebee', fg: '#c62828' },
  adjustment: { bg: '#fff3e0', fg: '#e65100' },
  transfer: { bg: '#e3f2fd', fg: '#1565c0' },
};

export default function MovementsPage() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    loadMovements();
  }, [typeFilter]);

  async function loadMovements() {
    setLoading(true);
    try {
      const params: Record<string, string> = { limit: '100' };
      if (typeFilter) params.type = typeFilter;
      const res = await api.get('/inventory/movements', { params });
      setMovements(res.data);
    } catch { /* skip */ } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#101c37' }}>Mouvements de Stock</h2>
          <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Historique des entrées et sorties</p>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8ecf1', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e8ecf1', display: 'flex', gap: 8 }}>
          {['', 'in', 'out', 'adjustment', 'transfer'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
                background: typeFilter === t ? '#101c37' : '#f0f2f5',
                color: typeFilter === t ? '#fff' : '#666',
              }}
            >
              {t === '' ? 'Tous' : TYPE_LABELS[t]}
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
                <Th>Produit</Th>
                <Th>Entrepôt</Th>
                <Th>Type</Th>
                <Th>Quantité</Th>
                <Th>Raison</Th>
              </tr>
            </thead>
            <tbody>
              {movements.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#888' }}>Aucun mouvement</td></tr>
              ) : movements.map((m) => {
                const tc = TYPE_COLORS[m.type] || { bg: '#f0f2f5', fg: '#666' };
                return (
                  <tr key={m.id} style={{ borderBottom: '1px solid #f0f2f5' }}>
                    <Td>{new Date(m.createdAt).toLocaleDateString('fr-TN', { day: '2-digit', month: 'short', year: 'numeric' })}</Td>
                    <Td bold>{m.product.name}</Td>
                    <Td>{m.warehouse.name}</Td>
                    <Td>
                      <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: tc.bg, color: tc.fg }}>
                        {TYPE_LABELS[m.type] || m.type}
                      </span>
                    </Td>
                    <Td>{m.type === 'out' ? `-${m.quantity}` : `+${m.quantity}`}</Td>
                    <Td>{m.reason || '—'}</Td>
                  </tr>
                );
              })}
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
