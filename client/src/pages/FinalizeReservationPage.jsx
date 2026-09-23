import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { rentalsAPI } from '../services/api';
import { DZD, RENTAL_TYPE_LABELS, fmtDatetime } from '../utils/format';
import { validators } from '../utils/validators';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Field, { inputStyle } from '../components/form/Field';
import PhoneField from '../components/form/PhoneField';
import PasswordStrength from '../components/form/PasswordStrength';
import WhatsAppButton from "../components/whatsappb/WhatsappB";


/* ── Récapitulatif de la réservation en attente ── */
function ReservationRecap({ draft }) {
  const { carSnapshot, rentalType, startDT, endDT, billedDays, totalPrice } = draft;
  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: 24 }}>
      <div style={{ display: 'flex', gap: 14, padding: 18, borderBottom: '1px solid #f3f4f6' }}>
        {carSnapshot.images?.[0] ? (
          <img src={carSnapshot.images[0]} alt="" style={{ width: 90, height: 68, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
        ) : (
          <div style={{ width: 90, height: 68, borderRadius: 10, background: '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>🚗</div>
        )}
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: '#111827' }}>
            {carSnapshot.brand} {carSnapshot.model} ({carSnapshot.year})
          </div>
          <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>
            {RENTAL_TYPE_LABELS[rentalType]}
          </div>
        </div>
      </div>
      <div style={{ padding: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
          <span style={{ color: '#6b7280' }}>📅 Départ</span>
          <strong>{fmtDatetime(startDT)}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
          <span style={{ color: '#6b7280' }}>📅 Retour</span>
          <strong>{fmtDatetime(endDT)}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 12 }}>
          <span style={{ color: '#6b7280' }}>📋 Jours facturés</span>
          <strong>{billedDays} jour(s)</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #f3f4f6' }}>
          <span style={{ fontWeight: 700, color: '#111827' }}>Total estimé</span>
          <span style={{ fontWeight: 800, fontSize: 20, color: '#1E293B' }}>{DZD(totalPrice)}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Formulaire d'inscription intégré ── */
function InlineRegisterForm({ submitting, setSubmitting }) {
  const { register } = useAuth();
  const { showAlert } = useAlert();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    countryCode: '+213', phone: '',
    password: '', confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);

  const update = (k, v) => { setForm(p => ({ ...p, [k]: v })); if (errors[k]) setErrors(p => ({ ...p, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!validators.required(form.firstName)) e.firstName = 'Le prénom est requis.';
    if (!validators.required(form.lastName))  e.lastName  = 'Le nom est requis.';
    if (!validators.email(form.email))        e.email     = 'Adresse email invalide.';
    if (!validators.phone(form.phone))        e.phone     = 'Numéro invalide.';
    if (!validators.minLen(form.password, 6)) e.password  = 'Minimum 6 caractères.';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Les mots de passe ne correspondent pas.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await register({
        firstName: form.firstName.trim(),
        lastName:  form.lastName.trim(),
        email:     form.email.trim().toLowerCase(),
        countryCode: form.countryCode,
        phone:     form.phone.trim(),
        whatsapp:  `${form.countryCode} ${form.phone}`,
        password:  form.password,
      });
      // Ne PAS appeler finalizeRental ici : le useEffect qui surveille
      // `user` s'en charge dès que le compte est créé. L'appeler aussi
      // ici créait une double demande de réservation.
    } catch (err) {
      showAlert(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || "Erreur lors de l'inscription.", { type: 'error', title: 'Inscription impossible' });
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Field label="Prénom" required error={errors.firstName}>
          <input value={form.firstName} onChange={e => update('firstName', e.target.value)} placeholder="Prénom" style={inputStyle(!!errors.firstName)} />
        </Field>
        <Field label="Nom" required error={errors.lastName}>
          <input value={form.lastName} onChange={e => update('lastName', e.target.value)} placeholder="Nom" style={inputStyle(!!errors.lastName)} />
        </Field>
      </div>

      <Field label="Email" required error={errors.email}>
        <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="Exemple@exemple.com" style={inputStyle(!!errors.email)} />
      </Field>

      <PhoneField
        label="Téléphone" required
        countryCode={form.countryCode} onCountryChange={v => update('countryCode', v)}
        phone={form.phone} onPhoneChange={v => update('phone', v)}
        error={errors.phone}
      />

      <Field label="Mot de passe" required error={errors.password}>
        <div style={{ position: 'relative' }}>
          <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)} placeholder="••••••••" style={{ ...inputStyle(!!errors.password), paddingRight: 44 }} />
          <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>{showPass ? '🙈' : '👁️'}</button>
        </div>
        <PasswordStrength password={form.password} />
      </Field>

      <Field label="Confirmer le mot de passe" required error={errors.confirmPassword}>
        <input type={showPass ? 'text' : 'password'} value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} placeholder="••••••••" style={inputStyle(!!errors.confirmPassword)} />
      </Field>

      <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15, marginTop: 6, opacity: submitting ? 0.7 : 1 }}>
        {submitting ? '⏳ Envoi en cours...' : '✅ Finir mon inscription et envoyer ma demande'}
      </button>
    </form>
  );
}

/* ── Formulaire de connexion intégré ── */
function InlineLoginForm({ submitting, setSubmitting }) {
  const { login } = useAuth();
  const { showAlert } = useAlert();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Email et mot de passe requis.'); return; }
    setSubmitting(true);
    try {
      await login(email.trim().toLowerCase(), password);
      // Ne PAS appeler finalizeRental ici : le useEffect qui surveille
      // `user` s'en charge dès que la connexion réussit.
    } catch (err) {
      const msg = err.response?.data?.message || 'Identifiants incorrects.';
      setError(msg);
      showAlert(msg, { type: 'error', title: 'Connexion impossible' });
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}
      <Field label="Email" required>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" style={inputStyle(false)} />
      </Field>
      <Field label="Mot de passe" required>
        <div style={{ position: 'relative' }}>
          <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ ...inputStyle(false), paddingRight: 44 }} />
          <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>{showPass ? '🙈' : '👁️'}</button>
        </div>
      </Field>
      <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15, marginTop: 6, opacity: submitting ? 0.7 : 1 }}>
        {submitting ? '⏳ Connexion...' : '✅ Se connecter et valider ma demande'}
      </button>
    </form>
  );
}

/* ── Page principale ── */
export default function FinalizeReservationPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showAlert, showSuccess } = useAlert();

  const [draft, setDraft]         = useState(null);
  const [mode, setMode]           = useState('register'); // 'register' | 'login'
  const [submitting, setSubmitting] = useState(false);

  // Verrou anti-double-envoi : empêche deux demandes identiques d'être
  // créées si finalizeRental() était appelée plus d'une fois (ex: React
  // StrictMode qui ré-exécute les effets en développement).
  const hasSubmittedRef = useRef(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('pendingReservation');
    if (!raw) { navigate('/cars'); return; }
    try { setDraft(JSON.parse(raw)); }
    catch { navigate('/cars'); }
  }, []);

  // Seul déclencheur de l'envoi final : dès que `user` est authentifié
  // (que ce soit parce qu'il vient de s'inscrire/se connecter sur cette
  // page, ou parce qu'il était déjà connecté en y arrivant).
  useEffect(() => {
    if (user && draft) finalizeRental();
  }, [user, draft]);

  const finalizeRental = async () => {
    if (!draft || hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;
    setSubmitting(true);
    try {
      await rentalsAPI.create(draft.rentalPayload);
      sessionStorage.removeItem('pendingReservation');
      showSuccess('Votre demande de location a bien été envoyée !');
      navigate('/profile');
    } catch (err) {
      hasSubmittedRef.current = false; // permet de réessayer si ça échoue
      showAlert(err.response?.data?.message || "Une erreur est survenue lors de l'envoi de la demande.", { type: 'error', title: 'Réservation impossible' });
      setSubmitting(false);
    }
  };

  if (!draft) return null;

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: '32px 24px 64px', maxWidth: 920, margin: '0 auto' }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111827', marginBottom: 6 }}>
          Encore une étape !
        </h1>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 28 }}>
          Créez votre compte ou connectez-vous pour envoyer définitivement votre demande de réservation.
        </p>

        <div className="finalize-grid" style={{ display: 'grid', gap: 28 }}>
          <div>
            <ReservationRecap draft={draft} />
            <Link to={`/cars/${draft.carSnapshot._id}`} style={{ fontSize: 13, color: '#6b7280' }}>
              ← Modifier ma sélection
            </Link>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', padding: 24 }}>
            <div style={{ display: 'flex', gap: 4, background: '#f3f4f6', borderRadius: 10, padding: 4, marginBottom: 22 }}>
              <button
                onClick={() => setMode('register')}
                style={{ flex: 1, padding: '9px', border: 'none', borderRadius: 8, background: mode === 'register' ? '#fff' : 'none', color: mode === 'register' ? '#1E293B' : '#6b7280', fontWeight: mode === 'register' ? 700 : 500, fontSize: 13, cursor: 'pointer', boxShadow: mode === 'register' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none' }}
              >
                🆕 Créer un compte
              </button>
              <button
                onClick={() => setMode('login')}
                style={{ flex: 1, padding: '9px', border: 'none', borderRadius: 8, background: mode === 'login' ? '#fff' : 'none', color: mode === 'login' ? '#1E293B' : '#6b7280', fontWeight: mode === 'login' ? 700 : 500, fontSize: 13, cursor: 'pointer', boxShadow: mode === 'login' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none' }}
              >
                🔐 J'ai déjà un compte
              </button>
            </div>

            {mode === 'register'
              ? <InlineRegisterForm submitting={submitting} setSubmitting={setSubmitting} />
              : <InlineLoginForm submitting={submitting} setSubmitting={setSubmitting} />}
          </div>
        </div>
      </div>
      <WhatsAppButton/>
      <Footer />
    </>
  );
}
