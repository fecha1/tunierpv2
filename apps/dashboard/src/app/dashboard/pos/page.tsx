'use client';

import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';
import { IconSearch, IconPlus, IconMinus, IconTrash, IconCash, IconCreditCard, IconReceipt } from '@tabler/icons-react';

interface Stats {
  ticketCount: number;
  totalSales: number;
  cashTotal: number;
  averageTicket: number;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string | null;
  price: number;
  stock?: number;
}

interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
}

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Espèces', icon: <IconCash size={18} />, color: '#2e7d32' },
  { value: 'card', label: 'Carte', icon: <IconCreditCard size={18} />, color: '#1565c0' },
];

export default function POSPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountPaid, setAmountPaid] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [warehouses, setWarehouses] = useState<{ id: string; name: string }[]>([]);
  const [processing, setProcessing] = useState(false);
  const [lastTicket, setLastTicket] = useState<any>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadStats();
    loadWarehouses();
    searchRef.current?.focus();
  }, []);

  async function loadStats() {
    try {
      const res = await api.get('/pos/stats');
      setStats(res.data);
    } catch { /* skip */ }
  }

  async function loadWarehouses() {
    try {
      const res = await api.get('/inventory/warehouses');
      setWarehouses(res.data);
      if (res.data.length > 0) {
        const defaultWh = res.data.find((w: any) => w.isDefault);
        setWarehouseId(defaultWh?.id || res.data[0].id);
      }
    } catch { /* skip */ }
  }

  async function searchProducts(q: string) {
    setSearchQuery(q);
    if (q.length < 2) { setProducts([]); return; }
    try {
      const params: Record<string, string> = { q };
      if (warehouseId) params.warehouseId = warehouseId;
      const res = await api.get('/pos/products', { params });
      setProducts(res.data);
    } catch { /* skip */ }
  }

  function addToCart(product: Product) {
    const existing = cart.find((c) => c.productId === product.id);
    if (existing) {
      setCart(cart.map((c) => c.productId === product.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { productId: product.id, name: product.name, quantity: 1, unitPrice: product.price, discount: 0, taxRate: 19 }]);
    }
    setSearchQuery('');
    setProducts([]);
    searchRef.current?.focus();
  }

  function updateQty(productId: string, delta: number) {
    setCart(cart.map((c) => {
      if (c.productId === productId) {
        const newQty = Math.max(1, c.quantity + delta);
        return { ...c, quantity: newQty };
      }
      return c;
    }));
  }

  function removeFromCart(productId: string) {
    setCart(cart.filter((c) => c.productId !== productId));
  }

  const subtotal = cart.reduce((sum, it) => sum + it.quantity * it.unitPrice * (1 - it.discount / 100), 0);
  const taxTotal = cart.reduce((sum, it) => {
    const base = it.quantity * it.unitPrice * (1 - it.discount / 100);
    return sum + base * (it.taxRate / 100);
  }, 0);
  const total = subtotal + taxTotal;
  const change = (parseFloat(amountPaid) || 0) - total;

  async function processSale() {
    if (cart.length === 0) { alert('Le panier est vide'); return; }
    if (!warehouseId) { alert('Sélectionnez un entrepôt'); return; }
    const paid = parseFloat(amountPaid) || total;
    if (paid < total) { alert('Montant insuffisant'); return; }

    setProcessing(true);
    try {
      const res = await api.post('/pos/sell', {
        items: cart,
        paymentMethod,
        amountPaid: paid,
        warehouseId,
      });
      setLastTicket(res.data);
      setCart([]);
      setAmountPaid('');
      await loadStats();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur lors de la vente');
    } finally {
      setProcessing(false);
    }
  }

  function fmt(n: number) {
    return new Intl.NumberFormat('fr-TN', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(n);
  }

  return (
    <div style={{ display: 'flex', gap: 24, minHeight: 'calc(100vh - 120px)' }}>
      {/* Left: Product search + Stats */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Stats bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          <MiniStat label="Tickets" value={stats?.ticketCount ?? 0} color="#264b8d" />
          <MiniStat label="CA du jour" value={`${fmt(stats?.totalSales ?? 0)}`} color="#2e7d32" />
          <MiniStat label="Espèces" value={`${fmt(stats?.cashTotal ?? 0)}`} color="#e65100" />
          <MiniStat label="Panier moyen" value={`${fmt(stats?.averageTicket ?? 0)}`} color="#6a1b9a" />
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', borderRadius: 12, border: '1px solid #e8ecf1', padding: '0 16px' }}>
            <IconSearch size={18} color="#888" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Scanner ou rechercher un produit (code-barres, SKU, nom)..."
              value={searchQuery}
              onChange={(e) => searchProducts(e.target.value)}
              style={{ flex: 1, padding: '14px 0', border: 'none', fontSize: 14, outline: 'none', background: 'transparent' }}
            />
          </div>

          {/* Search results dropdown */}
          {products.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', borderRadius: '0 0 12px 12px',
              border: '1px solid #e8ecf1', borderTop: 'none', maxHeight: 300, overflowY: 'auto', zIndex: 10,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }}>
              {products.map((p) => (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%',
                    padding: '12px 16px', border: 'none', borderBottom: '1px solid #f0f2f5', background: 'transparent',
                    cursor: 'pointer', textAlign: 'left', fontSize: 13,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f8f9fb')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: '#333' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>SKU: {p.sku}{p.barcode ? ` | ${p.barcode}` : ''}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: '#264b8d' }}>{fmt(p.price)} TND</div>
                    {p.stock !== undefined && <div style={{ fontSize: 11, color: '#888' }}>Stock: {p.stock}</div>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Warehouse selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#666' }}>Entrepôt:</span>
          <select value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 12, background: '#fff' }}>
            {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
        </div>

        {/* Last ticket */}
        {lastTicket && (
          <div style={{ background: '#e8f5e9', borderRadius: 12, padding: 16, border: '1px solid #c8e6c9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <IconReceipt size={18} color="#2e7d32" />
              <span style={{ fontWeight: 700, color: '#2e7d32' }}>Vente réussie!</span>
            </div>
            <p style={{ fontSize: 13, color: '#333' }}>
              Ticket: <strong>{lastTicket.ticketNumber}</strong> | Total: <strong>{fmt(lastTicket.total)} TND</strong>
              {lastTicket.change > 0 && <> | Rendu: <strong>{fmt(lastTicket.change)} TND</strong></>}
            </p>
            <button onClick={() => setLastTicket(null)} style={{ marginTop: 8, fontSize: 11, color: '#666', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
              Fermer
            </button>
          </div>
        )}
      </div>

      {/* Right: Cart */}
      <div style={{ width: 380, background: '#fff', borderRadius: 14, border: '1px solid #e8ecf1', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e8ecf1' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#101c37' }}>
            Panier <span style={{ fontSize: 13, fontWeight: 400, color: '#888' }}>({cart.length} article{cart.length !== 1 ? 's' : ''})</span>
          </h3>
        </div>

        {/* Cart items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {cart.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#ccc', fontSize: 13 }}>
              Scannez ou recherchez des produits
            </div>
          ) : cart.map((item) => (
            <div key={item.productId} style={{ padding: '10px 20px', borderBottom: '1px solid #f8f9fb', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                <p style={{ fontSize: 11, color: '#888' }}>{fmt(item.unitPrice)} TND × {item.quantity}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button onClick={() => updateQty(item.productId, -1)} style={qtyBtn}><IconMinus size={14} /></button>
                <span style={{ fontSize: 14, fontWeight: 600, width: 28, textAlign: 'center' }}>{item.quantity}</span>
                <button onClick={() => updateQty(item.productId, 1)} style={qtyBtn}><IconPlus size={14} /></button>
              </div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#264b8d', width: 80, textAlign: 'right' }}>
                {fmt(item.quantity * item.unitPrice)}
              </p>
              <button onClick={() => removeFromCart(item.productId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c62828', padding: 4 }}>
                <IconTrash size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Totals + Payment */}
        <div style={{ borderTop: '1px solid #e8ecf1', padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#666', marginBottom: 4 }}>
            <span>Sous-total HT</span><span>{fmt(subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#666', marginBottom: 8 }}>
            <span>TVA</span><span>{fmt(taxTotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700, color: '#101c37', paddingTop: 8, borderTop: '2px solid #101c37' }}>
            <span>Total</span><span>{fmt(total)} TND</span>
          </div>

          {/* Payment method */}
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            {PAYMENT_METHODS.map((m) => (
              <button key={m.value} onClick={() => setPaymentMethod(m.value)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '10px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  border: paymentMethod === m.value ? `2px solid ${m.color}` : '1px solid #ddd',
                  background: paymentMethod === m.value ? `${m.color}10` : '#fff',
                  color: paymentMethod === m.value ? m.color : '#666',
                }}>
                {m.icon} {m.label}
              </button>
            ))}
          </div>

          {/* Amount paid */}
          {paymentMethod === 'cash' && (
            <div style={{ marginTop: 12 }}>
              <input
                type="number"
                placeholder="Montant reçu..."
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, outline: 'none', textAlign: 'right' }}
              />
              {parseFloat(amountPaid) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 14, fontWeight: 600, color: change >= 0 ? '#2e7d32' : '#c62828' }}>
                  <span>Rendu</span><span>{fmt(Math.max(0, change))} TND</span>
                </div>
              )}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={processSale}
            disabled={processing || cart.length === 0}
            style={{
              width: '100%', marginTop: 16, padding: '14px', borderRadius: 10,
              background: cart.length === 0 ? '#ccc' : 'linear-gradient(135deg, #101c37, #264b8d)',
              color: '#fff', border: 'none', fontSize: 15, fontWeight: 700, cursor: cart.length === 0 ? 'default' : 'pointer',
              letterSpacing: 0.5,
            }}
          >
            {processing ? 'Traitement...' : `Encaisser ${fmt(total)} TND`}
          </button>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div style={{ background: '#fff', borderRadius: 10, padding: '12px 16px', border: '1px solid #e8ecf1' }}>
      <p style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5 }}>{label}</p>
      <p style={{ fontSize: 18, fontWeight: 700, color, marginTop: 4 }}>{value}</p>
    </div>
  );
}

const qtyBtn: React.CSSProperties = {
  width: 26, height: 26, borderRadius: 6, border: '1px solid #ddd', background: '#f8f9fb',
  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#333',
};
