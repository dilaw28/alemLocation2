import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validators } from '../utils/validators';
import Field, { inputStyle } from '../components/form/Field';
import PhoneField from '../components/form/PhoneField';
import PasswordStrength from '../components/form/PasswordStrength';
import Logob from"../assets/Logob.png";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    countryCode: '+213', phone: '',
    sameAsPhone: true,
    whatsappCode: '+213', whatsapp: '',
    password: '', confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const update = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    // Clear error on change
    if (errors[k]) setErrors(p => ({ ...p, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!validators.required(form.firstName))  e.firstName = 'Le prénom est requis.';
    if (!validators.required(form.lastName))   e.lastName  = 'Le nom est requis.';
    if (!validators.email(form.email))         e.email     = 'Adresse email invalide.';
    if (!validators.phone(form.phone))         e.phone     = 'Numéro invalide (6 à 20 chiffres).';
    if (!form.sameAsPhone && !validators.phone(form.whatsapp))
                                               e.whatsapp  = 'Numéro WhatsApp invalide.';
    if (!validators.minLen(form.password, 6)) e.password  = 'Minimum 6 caractères.';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Les mots de passe ne correspondent pas.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    const whatsappFull = form.sameAsPhone
      ? `${form.countryCode} ${form.phone}`
      : `${form.whatsappCode} ${form.whatsapp}`;

    setLoading(true);
    try {
      await register({
        firstName: form.firstName.trim(),
        lastName:  form.lastName.trim(),
        email:     form.email.trim().toLowerCase(),
        countryCode: form.countryCode,
        phone:     form.phone.trim(),
        whatsapp:  whatsappFull,
        password:  form.password,
      });
      navigate('/');
    } catch (err) {
      setApiError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div style={{ background: '#fff', borderRadius: 20, padding: '36px 40px', width: '100%', maxWidth: 560, boxShadow: '0 8px 40px rgba(0,0,0,0.1)' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img src={Logob} alt="Alem Location Logo" style={{ height: 90,width: 150, marginBottom: 10 }} />
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 4 }}>Créer un compte</h1>
          <p style={{ color: '#6b7280', fontSize: 14 }}>Rejoignez AutoLoc pour réserver votre voiture</p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
          {['Identité', 'Contact', 'Sécurité'].map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#1a56db', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {i + 1}
              </div>
              <span style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>{step}</span>
              {i < 2 && <span style={{ color: '#d1d5db', fontSize: 16 }}>›</span>}
            </div>
          ))}
        </div>

        {apiError && (
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', borderRadius: 10, padding: '12px 16px', fontSize: 14, fontWeight: 500, marginBottom: 20, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          {/* ── Section 1 : Identité ── */}
          <div style={{ background: '#f9fafb', borderRadius: 12, padding: '16px 18px', marginBottom: 18, border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
              1 · Identité
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Prénom" required error={errors.firstName}>
                <input
                  value={form.firstName}
                  onChange={e => update('firstName', e.target.value)}
                  placeholder="prénom..."
                  style={inputStyle(!!errors.firstName)}
                  autoComplete="given-name"
                />
              </Field>
              <Field label="Nom" required error={errors.lastName}>
                <input
                  value={form.lastName}
                  onChange={e => update('lastName', e.target.value)}
                  placeholder="nom de famille..."
                  style={inputStyle(!!errors.lastName)}
                  autoComplete="family-name"
                />
              </Field>
            </div>
            <Field label="Email" required error={errors.email}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none' }}>✉️</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  placeholder="email@exemple.com"
                  style={{ ...inputStyle(!!errors.email), paddingLeft: 42 }}
                  autoComplete="email"
                />
              </div>
            </Field>
          </div>

          {/* ── Section 2 : Contact ── */}
          <div style={{ background: '#f9fafb', borderRadius: 12, padding: '16px 18px', marginBottom: 18, border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
              2 · Contact
            </div>

            <PhoneField
              label="Téléphone principal"
              required
              hint="Numéro de contact — sélectionnez d'abord votre pays."
              countryCode={form.countryCode}
              onCountryChange={v => update('countryCode', v)}
              phone={form.phone}
              onPhoneChange={v => update('phone', v)}
              error={errors.phone}
            />

            {/* WhatsApp checkbox */}
            <div style={{ marginBottom: form.sameAsPhone ? 0 : 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '10px 14px', background: form.sameAsPhone ? '#eff6ff' : '#fff', border: `1.5px solid ${form.sameAsPhone ? '#1a56db' : '#e5e7eb'}`, borderRadius: 10, userSelect: 'none' }}>
                <div style={{ position: 'relative', width: 20, height: 20, flexShrink: 0 }}>
                  <input
                    type="checkbox"
                    checked={form.sameAsPhone}
                    onChange={e => update('sameAsPhone', e.target.checked)}
                    style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                  />
                  <div style={{ width: 20, height: 20, border: `2px solid ${form.sameAsPhone ? '#1a56db' : '#d1d5db'}`, borderRadius: 5, background: form.sameAsPhone ? '#1a56db' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {form.sameAsPhone && <span style={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>✓</span>}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>💬 WhatsApp identique au téléphone</span>
                  <div style={{ fontSize: 11, color: '#6b7280', marginTop: 1 }}>
                    {form.sameAsPhone ? `Sera utilisé : ${form.countryCode} ${form.phone || '—'}` : 'Je vais saisir un numéro différent'}
                  </div>
                </div>
              </label>
            </div>

            {!form.sameAsPhone && (
              <div style={{ marginTop: 12 }}>
                <PhoneField
                  label="Numéro WhatsApp"
                  hint="Renseignez votre numéro WhatsApp si différent."
                  countryCode={form.whatsappCode}
                  onCountryChange={v => update('whatsappCode', v)}
                  phone={form.whatsapp}
                  onPhoneChange={v => update('whatsapp', v)}
                  error={errors.whatsapp}
                />
              </div>
            )}
          </div>

          {/* ── Section 3 : Sécurité ── */}
          <div style={{ background: '#f9fafb', borderRadius: 12, padding: '16px 18px', marginBottom: 24, border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
              3 · Sécurité
            </div>

            <Field label="Mot de passe" required error={errors.password} hint="Minimum 6 caractères. Combinez lettres, chiffres et symboles.">
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none' }}></span>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  placeholder="mot de passe..."
                  style={{ ...inputStyle(!!errors.password), paddingLeft: 42, paddingRight: 44 }}
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, padding: 2 }}>
                  {showPass ? '🔒' : '👁'}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </Field>

            <Field label="Confirmer le mot de passe" required error={errors.confirmPassword}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none' }}></span>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={e => update('confirmPassword', e.target.value)}
                  placeholder="mot de passe..."
                  style={{ ...inputStyle(!!errors.confirmPassword), paddingLeft: 42, paddingRight: 44 }}
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, padding: 2 }}>
                  {showConfirm ?  '🔒' : '👁'}
                </button>
              </div>
              {form.confirmPassword && form.password === form.confirmPassword && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5 }}>
                  <span style={{ color: '#10b981', fontSize: 14 }}>✓</span>
                  <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>Les mots de passe correspondent</span>
                </div>
              )}
            </Field>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '14px', background: loading ? '#93c5fd' : '#1a56db', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            {loading ? (
              <><span style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Création en cours...</>
            ) : '✅ Créer mon compte gratuitement'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 14, marginTop: 20 }}>
          Déjà un compte ?{' '}
          <Link to="/login" style={{ color: '#1a56db', fontWeight: 700 }}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
