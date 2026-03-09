'use client';
import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4060/api/v1';

const PLANS = [
  { code: 'starter', name: 'Starter', price: 'Gratuit', desc: 'Parfait pour démarrer', maxUsers: 2, modules: '4 modules de base' },
  { code: 'business', name: 'Business', price: '49 TND/mois', desc: 'Pour les PME en croissance', maxUsers: 10, modules: '8 modules' },
  { code: 'professional', name: 'Professionnel', price: '99 TND/mois', desc: 'Toutes les fonctionnalités', maxUsers: 25, modules: '12 modules' },
  { code: 'enterprise', name: 'Entreprise', price: '199 TND/mois', desc: 'Solution complète & support', maxUsers: -1, modules: 'Tous les modules' },
];

const BUSINESS_TYPES = [
  { value: 'general', label: 'Commerce général', icon: '🏪' },
  { value: 'retail', label: 'Détail / Retail', icon: '🛍️' },
  { value: 'restaurant', label: 'Restaurant', icon: '🍽️' },
  { value: 'cafe', label: 'Café', icon: '☕' },
  { value: 'bakery', label: 'Boulangerie / Pâtisserie', icon: '🥐' },
  { value: 'pharmacy', label: 'Pharmacie', icon: '💊' },
  { value: 'clothing', label: 'Prêt-à-porter', icon: '👗' },
  { value: 'electronics', label: 'Électronique', icon: '📱' },
  { value: 'grocery', label: 'Épicerie', icon: '🛒' },
  { value: 'beauty', label: 'Beauté & Cosmétique', icon: '💄' },
  { value: 'auto_parts', label: 'Pièces auto', icon: '🔧' },
  { value: 'building_materials', label: 'Matériaux de construction', icon: '🏗️' },
  { value: 'furniture', label: 'Meubles', icon: '🛋️' },
  { value: 'jewelry', label: 'Bijouterie', icon: '💎' },
  { value: 'optics', label: 'Optique', icon: '👓' },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    planCode: 'starter',
    businessType: 'general',
    tenantName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const nextStep = () => {
    setError('');
    if (step === 3) {
      if (!formData.tenantName) return setError('Nom de l\'entreprise requis');
    }
    if (step === 4) {
      if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
        return setError('Tous les champs sont requis');
      }
      if (formData.password.length < 6) return setError('Mot de passe: 6 caractères minimum');
      handleSubmit();
      return;
    }
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Erreur lors de l\'inscription');

      // Store tokens and redirect to dashboard
      document.cookie = `tunierp_access_token=${data.accessToken};path=/;max-age=86400`;
      document.cookie = `tunierp_refresh_token=${data.refreshToken};path=/;max-age=604800`;

      setSuccess(true);

      setTimeout(() => {
        window.location.href = 'http://localhost:4052/dashboard';
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7fa' }}>
        <div style={{ textAlign: 'center', maxWidth: 480, padding: '0 20px' }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🎉</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#101c37', marginBottom: 12 }}>
            Bienvenue chez TuniERP !
          </h2>
          <p style={{ color: '#666', marginBottom: 12 }}>Votre ERP est prêt avec les modules de base activés.</p>
          <p style={{ color: '#888', fontSize: 13, lineHeight: 1.6 }}>
            Les modules payants de votre plan seront activés par un administrateur sous 24h.
            Vous recevrez une notification dès qu&apos;ils seront disponibles.
          </p>
          <p style={{ color: '#999', fontSize: 12, marginTop: 16 }}>Redirection vers votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ fontSize: 22, fontWeight: 700, color: '#101c37', textDecoration: 'none' }}>
          Tuni<span style={{ color: '#264b8d' }}>ERP</span>
        </a>
        <a href="/login" style={{ fontSize: 13, color: '#264b8d', fontWeight: 500, textDecoration: 'none' }}>
          Déjà inscrit ? Se connecter →
        </a>
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 40px', marginBottom: 32 }}>
        <div style={{ display: 'flex', gap: 8, maxWidth: 400, width: '100%' }}>
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                background: s <= step ? '#264b8d' : '#e0e0e0',
                transition: 'background 0.3s',
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0 20px' }}>
        <div style={{ width: '100%', maxWidth: 640 }}>

          {/* Step 1: Choose plan */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#101c37', textAlign: 'center', marginBottom: 8 }}>
                Choisissez votre plan
              </h2>
              <p style={{ textAlign: 'center', color: '#666', fontSize: 14, marginBottom: 32 }}>
                Commencez gratuitement, évoluez à votre rythme
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {PLANS.map((plan) => (
                  <div
                    key={plan.code}
                    onClick={() => update('planCode', plan.code)}
                    style={{
                      padding: 24,
                      borderRadius: 14,
                      border: formData.planCode === plan.code ? '2px solid #264b8d' : '2px solid #e8ecf1',
                      background: '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#101c37' }}>{plan.name}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#264b8d', margin: '8px 0' }}>{plan.price}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{plan.desc}</div>
                    <div style={{ fontSize: 11, color: '#999', marginTop: 8 }}>
                      {plan.maxUsers === -1 ? 'Utilisateurs illimités' : `Jusqu'à ${plan.maxUsers} utilisateurs`} · {plan.modules}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Business type */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#101c37', textAlign: 'center', marginBottom: 8 }}>
                Type d&apos;activité
              </h2>
              <p style={{ textAlign: 'center', color: '#666', fontSize: 14, marginBottom: 32 }}>
                Nous adapterons votre ERP selon votre secteur
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {BUSINESS_TYPES.map((bt) => (
                  <div
                    key={bt.value}
                    onClick={() => update('businessType', bt.value)}
                    style={{
                      padding: '16px 14px',
                      borderRadius: 12,
                      border: formData.businessType === bt.value ? '2px solid #264b8d' : '2px solid #e8ecf1',
                      background: '#fff',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 6 }}>{bt.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: '#333' }}>{bt.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Company info */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#101c37', textAlign: 'center', marginBottom: 8 }}>
                Votre entreprise
              </h2>
              <p style={{ textAlign: 'center', color: '#666', fontSize: 14, marginBottom: 32 }}>
                Donnez un nom à votre espace TuniERP
              </p>
              <div style={{ maxWidth: 400, margin: '0 auto' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: '#333' }}>
                  Nom de l&apos;entreprise *
                </label>
                <input
                  type="text"
                  value={formData.tenantName}
                  onChange={(e) => update('tenantName', e.target.value)}
                  placeholder="Ex: Ma Boutique Tunis"
                  style={inputStyle}
                />
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, marginTop: 20, color: '#333' }}>
                  Téléphone (optionnel)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="+216 XX XXX XXX"
                  style={inputStyle}
                />
              </div>
            </div>
          )}

          {/* Step 4: Account */}
          {step === 4 && (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#101c37', textAlign: 'center', marginBottom: 8 }}>
                Créez votre compte
              </h2>
              <p style={{ textAlign: 'center', color: '#666', fontSize: 14, marginBottom: 32 }}>
                Vous serez l&apos;administrateur de votre entreprise
              </p>
              <div style={{ maxWidth: 400, margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: '#333' }}>Prénom *</label>
                    <input value={formData.firstName} onChange={(e) => update('firstName', e.target.value)} placeholder="Ahmed" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: '#333' }}>Nom *</label>
                    <input value={formData.lastName} onChange={(e) => update('lastName', e.target.value)} placeholder="Ben Ali" style={inputStyle} />
                  </div>
                </div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: '#333' }}>Email *</label>
                <input type="email" value={formData.email} onChange={(e) => update('email', e.target.value)} placeholder="ahmed@exemple.tn" style={{ ...inputStyle, marginBottom: 16 }} />
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: '#333' }}>Mot de passe *</label>
                <input type="password" value={formData.password} onChange={(e) => update('password', e.target.value)} placeholder="6 caractères minimum" style={inputStyle} />
              </div>
            </div>
          )}

          {error && (
            <div style={{ background: '#fff0f0', color: '#e53935', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginTop: 20, textAlign: 'center', border: '1px solid #ffcdd2' }}>
              {error}
            </div>
          )}

          {/* Navigation buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 40, marginBottom: 40 }}>
            {step > 1 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                style={{
                  padding: '12px 32px',
                  borderRadius: 10,
                  border: '1.5px solid #e0e0e0',
                  background: '#fff',
                  color: '#555',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                ← Retour
              </button>
            )}
            <button
              onClick={nextStep}
              disabled={loading}
              style={{
                padding: '12px 40px',
                borderRadius: 10,
                border: 'none',
                background: loading ? '#9e9e9e' : 'linear-gradient(135deg, #101c37, #264b8d)',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Création en cours...' : step === 4 ? 'Créer mon entreprise 🚀' : 'Continuer →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  border: '1.5px solid #e0e0e0',
  borderRadius: 10,
  fontSize: 14,
  outline: 'none',
  background: '#fff',
};
