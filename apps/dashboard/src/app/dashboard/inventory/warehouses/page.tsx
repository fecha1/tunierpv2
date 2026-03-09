'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { IconBuildingWarehouse, IconPlus } from '@tabler/icons-react';

interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string | null;
  isDefault: boolean;
}

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', code: '', address: '', isDefault: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const res = await api.get('/inventory/warehouses');
      setWarehouses(res.data);
    } catch { /* skip */ } finally {
      setLoading(false);
    }
  }

  function openNew() {
    setEditId(null);
    setForm({ name: '', code: '', address: '', isDefault: false });
    setShowForm(true);
  }

  function openEdit(w: Warehouse) {
    setEditId(w.id);
    setForm({ name: w.name, code: w.code, address: w.address || '', isDefault: w.isDefault });
    setShowForm(true);
  }

  async function save() {
    setSaving(true);
    try {
      if (editId) {
        await api.patch(`/inventory/warehouses/${editId}`, form);
      } else {
        await api.post('/inventory/warehouses', form);
      }
      setShowForm(false);
      await load();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#101c37' }}>Entrepôts</h2>
          <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Gérez vos lieux de stockage</p>
        </div>
        <button onClick={openNew} style={btnPrimary}><IconPlus size={16} /> Ajouter</button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8ecf1', padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{editId ? 'Modifier l\'entrepôt' : 'Nouvel entrepôt'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Nom" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field label="Code" value={form.code} onChange={(v) => setForm({ ...form, code: v })} />
            <Field label="Adresse" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 24 }}>
              <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />
              <span style={{ fontSize: 13 }}>Entrepôt par défaut</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <button onClick={save} disabled={saving} style={btnPrimary}>{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
            <button onClick={() => setShowForm(false)} style={btnSecondary}>Annuler</button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Chargement...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {warehouses.map((w) => (
            <div key={w.id} onClick={() => openEdit(w)}
              style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8ecf1', padding: 20, cursor: 'pointer', transition: 'box-shadow 0.15s' }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#264b8d' }}>
                  <IconBuildingWarehouse size={20} />
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14, color: '#333' }}>{w.name}</p>
                  <p style={{ fontSize: 12, color: '#888' }}>Code: {w.code}</p>
                </div>
                {w.isDefault && (
                  <span style={{ marginLeft: 'auto', fontSize: 10, padding: '2px 8px', background: '#e8f5e9', color: '#2e7d32', borderRadius: 4, fontWeight: 600 }}>
                    DÉFAUT
                  </span>
                )}
              </div>
              {w.address && <p style={{ fontSize: 12, color: '#888' }}>{w.address}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: '#666', display: 'block', marginBottom: 6 }}>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', padding: '8px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 13, outline: 'none' }} />
    </div>
  );
}

const btnPrimary: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', borderRadius: 8,
  background: '#101c37', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
};
const btnSecondary: React.CSSProperties = {
  padding: '8px 20px', borderRadius: 8, background: '#f0f2f5', color: '#666',
  border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
};
