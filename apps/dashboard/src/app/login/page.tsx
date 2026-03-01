'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #101c37 0%, #264b8d 100%)',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: '48px 40px',
        width: '100%',
        maxWidth: 420,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#101c37' }}>
            Tuni<span style={{ color: '#264b8d' }}>ERP</span>
          </h1>
          <p style={{ color: '#666', fontSize: 14, marginTop: 8 }}>
            Connectez-vous à votre espace
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fff0f0',
            color: '#e53935',
            padding: '10px 14px',
            borderRadius: 8,
            fontSize: 13,
            marginBottom: 20,
            border: '1px solid #ffcdd2',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#333', marginBottom: 6 }}>
              Adresse email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemple.com"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1.5px solid #e0e0e0',
                borderRadius: 10,
                fontSize: 14,
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#264b8d')}
              onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
            />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#333', marginBottom: 6 }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1.5px solid #e0e0e0',
                borderRadius: 10,
                fontSize: 14,
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#264b8d')}
              onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#9e9e9e' : 'linear-gradient(135deg, #101c37, #264b8d)',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#999', marginTop: 32 }}>
          © {new Date().getFullYear()} TuniERP — Tous droits réservés
        </p>
      </div>
    </div>
  );
}
