'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { IconPlus, IconTruck } from '@tabler/icons-react';

interface Supplier {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  taxId: string | null;
  notes: string | null;
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', taxId: '', notes: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, [search]);

  async function load() {
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      const res = await api.get('/purchases/suppliers', { params });
      setSuppliers(res.data);
    } catch { /* skip */ } finally {
      setLoading(false);
    }
  }

  function openNew() {
    setEditId(null);
    setForm({ name: '', email: '', phone: '', address: '', taxId: '', notes: '' });
    setShowForm(true);
  }

  function openEdit(s: Supplier) {
    setEditId(s.id);
    setForm({ name: s.name, email: s.email || '', phone: s.phone || '', address: s.address || '', taxId: s.taxId || '', notes: s.notes || '' });
    setShowForm(true);
  }

  async function save() {
    setSaving(true);
    try {
      const payload = { ...form, email: form.email || undefined, phone: form.phone || undefined, address: form.address || undefined, taxId: form.taxId || undefined, notes: form.notes || undefined };
      if (editId) {
        await api.patch(`/purchases/suppliers/${editId}`, payload);
      } else {
        await api.post('/purchases/suppliers', payload);
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
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#101c37' }}>Fournisseurs</h2>
          <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Gérez votre liste de fournisseurs</p>
        </div>
        <button onClick={openNew} style={btnPrimary}><IconPlus size={16} /> Ajouter</button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8ecf1', padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{editId ? 'Modifier le fournisseur' : 'Nouveau fournisseur'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Nom *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <Field label="Téléphone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            <Field label="Matricule fiscal" value={form.taxId} onChange={(v) => setForm({ ...form, taxId: v })} />
            <Field label="Adresse" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
            <Field label="Notes" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <button onClick={save} disabled={saving} style={btnPrimary}>{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
            <button onClick={() => setShowForm(false)} style={btnSecondary}>Annuler</button>
          </div>
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8ecf1', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e8ecf1' }}>
          <input type="text" placeholder="Rechercher un fournisseur..." value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', maxWidth: 400, padding: '8px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 13, outline: 'none' }} />
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Chargement...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fb' }}>
                <Th>Nom</Th>
                <Th>Email</Th>
                <Th>Téléphone</Th>
                <Th>Matricule fiscal</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#888' }}>Aucun fournisseur</td></tr>
              ) : suppliers.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid #f0f2f5' }}>
                  <Td bold>{s.name}</Td>
                  <Td>{s.email || '—'}</Td>
                  <Td>{s.phone || '—'}</Td>
                  <Td>{s.taxId || '—'}</Td>
                  <Td>
                    <button onClick={() => openEdit(s)}
                      style={{ padding: '4px 12px', borderRadius: 6, background: '#eef2ff', color: '#264b8d', border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                      Modifier
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
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

function Th({ children }: { children: React.ReactNode }) {
  return <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 }}>{children}</th>;
}

function Td({ children, bold }: { children: React.ReactNode; bold?: boolean }) {
  return <td style={{ padding: '12px 16px', fontSize: 13, color: '#333', fontWeight: bold ? 600 : 400 }}>{children}</td>;
}

const btnPrimary: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', borderRadius: 8,
  background: '#101c37', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
};
const btnSecondary: React.CSSProperties = {
  padding: '8px 20px', borderRadius: 8, background: '#f0f2f5', color: '#666',
  border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
};
