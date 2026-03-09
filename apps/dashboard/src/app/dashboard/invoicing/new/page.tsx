'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { IconPlus, IconTrash } from '@tabler/icons-react';

interface LineItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
}

const SALE_TYPES = [
  { value: 'quote', label: 'Devis' },
  { value: 'invoice', label: 'Facture' },
  { value: 'delivery_note', label: 'Bon de Livraison' },
  { value: 'proforma', label: 'Proforma' },
  { value: 'credit_note', label: 'Avoir' },
];

export default function NewSalePage() {
  const router = useRouter();
  const [type, setType] = useState('invoice');
  const [customerId, setCustomerId] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<LineItem[]>([{ productId: '', productName: '', quantity: 1, unitPrice: 0, discount: 0, taxRate: 19 }]);
  const [saving, setSaving] = useState(false);

  function addLine() {
    setItems([...items, { productId: '', productName: '', quantity: 1, unitPrice: 0, discount: 0, taxRate: 19 }]);
  }

  function removeLine(idx: number) {
    setItems(items.filter((_, i) => i !== idx));
  }

  function updateLine(idx: number, field: keyof LineItem, value: string | number) {
    const updated = [...items];
    (updated[idx] as any)[field] = value;
    setItems(updated);
  }

  function lineTotal(item: LineItem) {
    const base = item.quantity * item.unitPrice;
    const afterDiscount = base - base * (item.discount / 100);
    const tax = afterDiscount * (item.taxRate / 100);
    return afterDiscount + tax;
  }

  const subtotal = items.reduce((sum, it) => sum + it.quantity * it.unitPrice * (1 - it.discount / 100), 0);
  const taxTotal = items.reduce((sum, it) => {
    const base = it.quantity * it.unitPrice * (1 - it.discount / 100);
    return sum + base * (it.taxRate / 100);
  }, 0);
  const timbreFiscal = 1;
  const total = subtotal + taxTotal + timbreFiscal;

  async function submit() {
    setSaving(true);
    try {
      await api.post('/invoicing/sales', {
        type,
        customerId: customerId || undefined,
        notes: notes || undefined,
        items: items.filter((it) => it.productId).map(({ productName, ...rest }) => rest),
      });
      router.push('/dashboard/invoicing');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setSaving(false);
    }
  }

  function fmt(n: number) {
    return new Intl.NumberFormat('fr-TN', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(n);
  }

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#101c37', marginBottom: 24 }}>Nouvelle Vente</h2>

      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8ecf1', padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div>
            <label style={labelStyle}>Type de document</label>
            <select value={type} onChange={(e) => setType(e.target.value)} style={inputStyle}>
              {SALE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>ID Client (optionnel)</label>
            <input value={customerId} onChange={(e) => setCustomerId(e.target.value)} placeholder="ID du client" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Notes</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes..." style={inputStyle} />
          </div>
        </div>

        {/* Line items */}
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Articles</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
          <thead>
            <tr style={{ background: '#f8f9fb' }}>
              <Th>ID Produit</Th>
              <Th>Qté</Th>
              <Th>Prix unitaire</Th>
              <Th>Remise %</Th>
              <Th>TVA %</Th>
              <Th>Total</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f0f2f5' }}>
                <td style={{ padding: '8px 8px' }}>
                  <input value={item.productId} onChange={(e) => updateLine(idx, 'productId', e.target.value)} style={{ ...inputStyle, fontSize: 12 }} placeholder="ID produit" />
                </td>
                <td style={{ padding: '8px 8px', width: 80 }}>
                  <input type="number" min={1} value={item.quantity} onChange={(e) => updateLine(idx, 'quantity', +e.target.value)} style={{ ...inputStyle, fontSize: 12, width: 70 }} />
                </td>
                <td style={{ padding: '8px 8px', width: 120 }}>
                  <input type="number" min={0} step={0.001} value={item.unitPrice} onChange={(e) => updateLine(idx, 'unitPrice', +e.target.value)} style={{ ...inputStyle, fontSize: 12, width: 110 }} />
                </td>
                <td style={{ padding: '8px 8px', width: 80 }}>
                  <input type="number" min={0} max={100} value={item.discount} onChange={(e) => updateLine(idx, 'discount', +e.target.value)} style={{ ...inputStyle, fontSize: 12, width: 70 }} />
                </td>
                <td style={{ padding: '8px 8px', width: 80 }}>
                  <input type="number" min={0} value={item.taxRate} onChange={(e) => updateLine(idx, 'taxRate', +e.target.value)} style={{ ...inputStyle, fontSize: 12, width: 70 }} />
                </td>
                <td style={{ padding: '8px 8px', fontSize: 13, fontWeight: 600, color: '#264b8d' }}>{fmt(lineTotal(item))}</td>
                <td style={{ padding: '8px 8px' }}>
                  {items.length > 1 && (
                    <button onClick={() => removeLine(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c62828' }}>
                      <IconTrash size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={addLine} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, background: '#f0f2f5', border: 'none', fontSize: 12, fontWeight: 600, color: '#666', cursor: 'pointer' }}>
          <IconPlus size={14} /> Ajouter une ligne
        </button>

        {/* Totals */}
        <div style={{ marginTop: 24, borderTop: '1px solid #e8ecf1', paddingTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: 280 }}>
            <TotalRow label="Sous-total HT" value={fmt(subtotal)} />
            <TotalRow label="TVA" value={fmt(taxTotal)} />
            <TotalRow label="Timbre fiscal" value={fmt(timbreFiscal)} />
            <div style={{ borderTop: '2px solid #101c37', paddingTop: 8, marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#101c37' }}>Total TTC</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#264b8d' }}>{fmt(total)} TND</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={submit} disabled={saving}
          style={{ padding: '10px 28px', borderRadius: 8, background: '#101c37', color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          {saving ? 'Enregistrement...' : 'Créer'}
        </button>
        <button onClick={() => router.back()}
          style={{ padding: '10px 28px', borderRadius: 8, background: '#f0f2f5', color: '#666', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          Annuler
        </button>
      </div>
    </div>
  );
}

function TotalRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13, color: '#666' }}>
      <span>{label}</span><span style={{ fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th style={{ padding: '8px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase' }}>{children}</th>;
}

const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: '#666', display: 'block', marginBottom: 6 };
const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 13, outline: 'none' };
