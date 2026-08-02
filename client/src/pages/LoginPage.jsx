import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logob from "../assets/Logob.png";


export default function LoginPage() {
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const location     = useLocation();
  const from         = location.state?.from || '/';

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const inputSt = (hasErr) => ({
    width: '100%',
    padding: '12px 14px',
    border: `1.5px solid ${hasErr ? '#ef4444' : '#e5e7eb'}`,
    borderRadius: 10,
    fontSize: 15,
    outline: 'none',
    boxSizing: 'border-box',
    background: hasErr ? '#fff5f5' : '#fff',
    transition: 'border-color 0.2s',
  });

  const validate = () => {
    const e = {};
    if (!email.trim())                          e.email    = 'L\'email est requis.';
    else if (!/\S+@\S+\.\S+/.test(email))       e.email    = 'Email invalide.';
    if (!password)                              e.password = 'Le mot de passe est requis.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Identifiants incorrects.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div style={{ background: '#fff', borderRadius: 20, padding: '40px', width: '100%', maxWidth: 440, boxShadow: '0 8px 40px rgba(0,0,0,0.10)' }}>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src={Logob} alt="ALem Location Logo" style={{ height: 90, marginBottom: 10 }} />
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111827', marginBottom: 4 }}>Alem Location</h1>
          <p style={{ color: '#6b7280', fontSize: 14 }}>Connectez-vous pour accéder à votre compte</p>
        </div>

        {apiError && (
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', borderRadius: 10, padding: '12px 16px', fontSize: 14, fontWeight: 500, marginBottom: 20, display: 'flex', gap: 8, alignItems: 'center' }}>
            <span>⚠️</span> {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
              Email <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none' }}>✉️</span>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: '' })); }}
                placeholder="votre@email.com"
                autoComplete="email"
                style={{ ...inputSt(!!errors.email), paddingLeft: 42 }}
              />
            </div>
            {errors.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
                <span style={{ color: '#ef4444', fontSize: 13 }}>⚠</span>
                <span style={{ fontSize: 12, color: '#ef4444' }}>{errors.email}</span>
              </div>
            )}
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
              Mot de passe <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none' }}></span>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: '' })); }}
                placeholder="mot de passe..."
                autoComplete="current-password"
                style={{ ...inputSt(!!errors.password), paddingLeft: 42, paddingRight: 44 }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, padding: 2 }}>
                {showPass ? '🔒' : '👁'}
              </button>
            </div>
            {errors.password && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
                <span style={{ color: '#ef4444', fontSize: 13 }}>⚠</span>
                <span style={{ fontSize: 12, color: '#ef4444' }}>{errors.password}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '14px', background: loading ? '#93c5fd' : '#1a56db', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            {loading ? (
              <><span style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Connexion...</>
            ) : '→ Se connecter'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
          <span style={{ color: '#9ca3af', fontSize: 13 }}>ou</span>
          <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
        </div>

        <Link to="/register" style={{ display: 'block', textAlign: 'center', padding: '13px', border: '2px solid #1a56db', borderRadius: 12, color: '#1a56db', fontWeight: 700, fontSize: 15, textDecoration: 'none', transition: 'background 0.15s' }}>
          Créer un compte gratuitement
        </Link>
      </div>
    </div>
  );
}
