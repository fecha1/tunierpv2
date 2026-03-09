'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { IconPlus, IconTrash } from '@tabler/icons-react';

interface LineItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
}

export default function NewPurchasePage() {
  const router = useRouter();
  const [supplierId, setSupplierId] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<LineItem[]>([{ productId: '', quantity: 1, unitPrice: 0, taxRate: 19 }]);
  const [saving, setSaving] = useState(false);

  function addLine() {
    setItems([...items, { productId: '', quantity: 1, unitPrice: 0, taxRate: 19 }]);
  }

  function removeLine(idx: number) {
    setItems(items.filter((_, i) => i !== idx));
  }

  function updateLine(idx: number, field: keyof LineItem, value: string | number) {
    const updated = [...items];
    (updated[idx] as any)[field] = value;
    setItems(updated);
  }

  const subtotal = items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);
  const taxTotal = items.reduce((sum, it) => sum + it.quantity * it.unitPrice * (it.taxRate / 100), 0);
  const total = subtotal + taxTotal;

  async function submit() {
    if (!supplierId) { alert('Veuillez saisir l\'ID du fournisseur'); return; }
    setSaving(true);
    try {
      await api.post('/purchases/orders', {
        supplierId,
        notes: notes || undefined,
        items: items.filter((it) => it.productId),
      });
      router.push('/dashboard/purchases');
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
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#101c37', marginBottom: 24 }}>Nouveau Bon de Commande</h2>

      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8ecf1', padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div>
            <label style={labelStyle}>ID Fournisseur *</label>
            <input value={supplierId} onChange={(e) => setSupplierId(e.target.value)} placeholder="ID du fournisseur" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Notes</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes internes..." style={inputStyle} />
          </div>
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Articles</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
          <thead>
            <tr style={{ background: '#f8f9fb' }}>
              <Th>ID Produit</Th>
              <Th>Qté</Th>
              <Th>Prix unitaire</Th>
              <Th>TVA %</Th>
              <Th>Total</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const lineTotal = item.quantity * item.unitPrice * (1 + item.taxRate / 100);
              return (
                <tr key={idx} style={{ borderBottom: '1px solid #f0f2f5' }}>
                  <td style={{ padding: '8px' }}>
                    <input value={item.productId} onChange={(e) => updateLine(idx, 'productId', e.target.value)}
                      style={{ ...inputStyle, fontSize: 12 }} placeholder="ID produit" />
                  </td>
                  <td style={{ padding: '8px', width: 80 }}>
                    <input type="number" min={1} value={item.quantity} onChange={(e) => updateLine(idx, 'quantity', +e.target.value)}
                      style={{ ...inputStyle, fontSize: 12, width: 70 }} />
                  </td>
                  <td style={{ padding: '8px', width: 120 }}>
                    <input type="number" min={0} step={0.001} value={item.unitPrice} onChange={(e) => updateLine(idx, 'unitPrice', +e.target.value)}
                      style={{ ...inputStyle, fontSize: 12, width: 110 }} />
                  </td>
                  <td style={{ padding: '8px', width: 80 }}>
                    <input type="number" min={0} value={item.taxRate} onChange={(e) => updateLine(idx, 'taxRate', +e.target.value)}
                      style={{ ...inputStyle, fontSize: 12, width: 70 }} />
                  </td>
                  <td style={{ padding: '8px', fontSize: 13, fontWeight: 600, color: '#264b8d' }}>{fmt(lineTotal)}</td>
                  <td style={{ padding: '8px' }}>
                    {items.length > 1 && (
                      <button onClick={() => removeLine(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c62828' }}>
                        <IconTrash size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <button onClick={addLine} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, background: '#f0f2f5', border: 'none', fontSize: 12, fontWeight: 600, color: '#666', cursor: 'pointer' }}>
          <IconPlus size={14} /> Ajouter une ligne
        </button>

        <div style={{ marginTop: 24, borderTop: '1px solid #e8ecf1', paddingTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: 260 }}>
            <TotalRow label="Sous-total HT" value={fmt(subtotal)} />
            <TotalRow label="TVA" value={fmt(taxTotal)} />
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
          {saving ? 'Enregistrement...' : 'Créer le BC'}
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
