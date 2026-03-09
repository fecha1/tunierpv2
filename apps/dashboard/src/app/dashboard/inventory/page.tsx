'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { IconPackages, IconArrowsExchange, IconBuildingWarehouse, IconAlertTriangle } from '@tabler/icons-react';

interface Stats {
  totalProducts: number;
  totalStock: number;
  lowStockCount: number;
  weeklyMovements: number;
}

interface StockItem {
  id: string;
  quantity: number;
  minQuantity: number;
  product: { id: string; name: string; sku: string };
  warehouse: { id: string; name: string };
  variant?: { name: string } | null;
}

export default function InventoryPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadStock();
  }, [search, lowStockOnly]);

  async function loadData() {
    try {
      const [statsRes, stockRes] = await Promise.all([
        api.get('/inventory/stats'),
        api.get('/inventory/stock'),
      ]);
      setStats(statsRes.data);
      setStock(stockRes.data);
    } catch { /* skip */ } finally {
      setLoading(false);
    }
  }

  async function loadStock() {
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (lowStockOnly) params.lowStockOnly = 'true';
      const res = await api.get('/inventory/stock', { params });
      setStock(res.data);
    } catch { /* skip */ }
  }

  if (loading) return <Loading />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#101c37' }}>Gestion de Stock</h2>
          <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Vue d&apos;ensemble de votre inventaire</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard icon={<IconPackages size={22} />} title="Produits" value={stats?.totalProducts ?? 0} color="#264b8d" />
        <StatCard icon={<IconPackages size={22} />} title="Stock total" value={stats?.totalStock ?? 0} color="#2e7d32" />
        <StatCard icon={<IconAlertTriangle size={22} />} title="Stock faible" value={stats?.lowStockCount ?? 0} color="#e65100" />
        <StatCard icon={<IconArrowsExchange size={22} />} title="Mouvements (7j)" value={stats?.weeklyMovements ?? 0} color="#6a1b9a" />
      </div>

      {/* Stock table */}
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8ecf1', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e8ecf1', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 200, padding: '8px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 13, outline: 'none' }}
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#666', cursor: 'pointer' }}>
            <input type="checkbox" checked={lowStockOnly} onChange={(e) => setLowStockOnly(e.target.checked)} />
            Stock faible uniquement
          </label>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fb' }}>
              <Th>Produit</Th>
              <Th>SKU</Th>
              <Th>Entrepôt</Th>
              <Th>Quantité</Th>
              <Th>Min</Th>
              <Th>Statut</Th>
            </tr>
          </thead>
          <tbody>
            {stock.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#888' }}>Aucun stock trouvé</td></tr>
            ) : stock.map((item) => {
              const isLow = item.quantity <= item.minQuantity;
              return (
                <tr key={item.id} style={{ borderBottom: '1px solid #f0f2f5' }}>
                  <Td bold>{item.product.name}{item.variant ? ` — ${item.variant.name}` : ''}</Td>
                  <Td>{item.product.sku}</Td>
                  <Td>{item.warehouse.name}</Td>
                  <Td>{item.quantity}</Td>
                  <Td>{item.minQuantity}</Td>
                  <Td>
                    <span style={{
                      padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                      background: isLow ? '#fff0e6' : '#e8f5e9',
                      color: isLow ? '#e65100' : '#2e7d32',
                    }}>
                      {isLow ? 'Faible' : 'OK'}
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

function StatCard({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: number; color: string }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid #e8ecf1', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>{icon}</div>
      <div>
        <p style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5 }}>{title}</p>
        <p style={{ fontSize: 24, fontWeight: 700, color }}>{value}</p>
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

function Loading() {
  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, color: '#888' }}>Chargement...</div>;
}
