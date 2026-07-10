import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import { COUNTRY_CODES, inputSt } from '../../utils/constants';

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
      <span style={{ color: '#ef4444', fontSize: 13 }}>⚠</span>
      <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 500 }}>{msg}</span>
    </div>
  );
}

export default function ProfileForm({ user, onSaved }) {
  const [form, setForm] = useState({
    firstName:   user?.firstName   || '',
    lastName:    user?.lastName    || '',
    countryCode: user?.countryCode || '+213',
    phone:       user?.phone       || '',
    whatsapp:    user?.whatsapp    || '',
    address:     user?.address     || '',
  });
  const [errors, setErrors]   = useState({});
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState('');
  const [dirty, setDirty]     = useState(false);

  const update = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    setDirty(true);
    if (errors[k]) setErrors(p => ({ ...p, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim())  e.firstName = 'Le prénom ne peut pas être vide.';
    if (!form.lastName.trim())   e.lastName  = 'Le nom ne peut pas être vide.';
    if (!form.phone.trim())      e.phone     = 'Le téléphone ne peut pas être vide.';
    else if (!/^[\d\s\-().]{6,20}$/.test(form.phone.trim()))
                                 e.phone     = 'Numéro invalide (6 à 20 chiffres).';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMsg('');
    if (!validate()) {
      setMsg('❌ Corrigez les erreurs avant de sauvegarder.');
      return;
    }
    setSaving(true);
    try {
      const { data } = await authAPI.updateProfile(form);
      onSaved(data.user);
      setMsg('✅ Profil mis à jour avec succès !');
      setDirty(false);
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Erreur lors de la mise à jour.'));
    } finally {
      setSaving(false);
    }
  };

  const selectedCC = COUNTRY_CODES.find(c => c.code === form.countryCode);

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #e5e7eb' }}>
      <h2 style={{ fontWeight: 800, fontSize: 18, color: '#111827', marginBottom: 20 }}>
        Informations personnelles
      </h2>

      {msg && (
        <div style={{ background: msg.startsWith('✅') ? '#d1fae5' : '#fee2e2', border: `1px solid ${msg.startsWith('✅') ? '#6ee7b7' : '#fca5a5'}`, color: msg.startsWith('✅') ? '#065f46' : '#991b1b', borderRadius: 10, padding: '12px 16px', fontSize: 14, fontWeight: 600, marginBottom: 18, display: 'flex', gap: 8 }}>
          <span>{msg.startsWith('✅') ? '✅' : '⚠️'}</span>
          <span>{msg.slice(2)}</span>
        </div>
      )}

      <form onSubmit={handleSave} noValidate>

        {/* Nom / Prénom */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 4 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
              Prénom <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              value={form.firstName}
              onChange={e => update('firstName', e.target.value)}
              placeholder="Jean"
              style={inputSt(!!errors.firstName)}
            />
            <FieldError msg={errors.firstName} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
              Nom <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              value={form.lastName}
              onChange={e => update('lastName', e.target.value)}
              placeholder="Dupont"
              style={inputSt(!!errors.lastName)}
            />
            <FieldError msg={errors.lastName} />
          </div>
        </div>

        {/* Phone */}
        <div style={{ marginBottom: 4, marginTop: 14 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
            Téléphone <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <select
                value={form.countryCode}
                onChange={e => update('countryCode', e.target.value)}
                style={{ padding: '11px 32px 11px 10px', border: `1.5px solid ${errors.phone ? '#ef4444' : '#e5e7eb'}`, borderRadius: 10, fontSize: 14, fontWeight: 600, background: '#f9fafb', cursor: 'pointer', outline: 'none', appearance: 'none', minWidth: 90 }}
              >
                {COUNTRY_CODES.map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                ))}
              </select>
              <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6b7280', fontSize: 10 }}>▼</span>
            </div>
            <input
              type="tel"
              value={form.phone}
              onChange={e => update('phone', e.target.value.replace(/[^\d\s\-().]/g, ''))}
              placeholder="6 12 34 56 78"
              style={{ ...inputSt(!!errors.phone), flex: 1 }}
            />
          </div>
          <FieldError msg={errors.phone} />
          {form.countryCode && form.phone && !errors.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, padding: '6px 10px', background: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe', width: 'fit-content' }}>
              <span>{selectedCC?.flag}</span>
              <span style={{ fontSize: 13, color: '#1a56db', fontWeight: 700 }}>{form.countryCode} {form.phone}</span>
              <span style={{ fontSize: 11, color: '#3b82f6' }}>{selectedCC?.name}</span>
            </div>
          )}
        </div>

        {/* WhatsApp */}
        <div style={{ marginBottom: 4, marginTop: 14 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
            💬 WhatsApp
            <span style={{ fontSize: 11, fontWeight: 400, color: '#6b7280', marginLeft: 6 }}>(optionnel — si différent du téléphone)</span>
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 18, pointerEvents: 'none' }}>📱</span>
            <input
              value={form.whatsapp}
              onChange={e => update('whatsapp', e.target.value)}
              placeholder={`Ex: ${form.countryCode} 6 12 34 56 78`}
              style={{ ...inputSt(false), paddingLeft: 42 }}
            />
          </div>
        </div>

        {/* Adresse */}
        <div style={{ marginTop: 14, marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
            🏠 Adresse
            <span style={{ fontSize: 11, fontWeight: 400, color: '#6b7280', marginLeft: 6 }}>(optionnel)</span>
          </label>
          <input
            value={form.address}
            onChange={e => update('address', e.target.value)}
            placeholder="12 rue de la Paix, Alger"
            style={inputSt(false)}
          />
        </div>

        {/* Save button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="submit"
            disabled={saving || !dirty}
            style={{
              padding: '12px 28px',
              background: saving ? '#93c5fd' : dirty ? '#1a56db' : '#9ca3af',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
              cursor: saving || !dirty ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {saving
              ? <><span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Enregistrement...</>
              : '💾 Sauvegarder'}
          </button>
          {!dirty && !saving && (
            <span style={{ fontSize: 12, color: '#6b7280', fontStyle: 'italic' }}>Aucune modification</span>
          )}
          {dirty && !saving && (
            <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 600 }}>● Modifications non sauvegardées</span>
          )}
        </div>
      </form>
    </div>
  );
}
