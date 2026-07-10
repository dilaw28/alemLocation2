import React, { useState, useEffect } from 'react';
import { settingsAPI } from '../../services/api';
import { card, cardTitle, inp } from './panelStyles';

export default function PricingPanel() {
  const [settings, setSettings]       = useState(null);
  const [loading, setLoading]         = useState(true);
  const [chauffeur, setChauffeur]     = useState('');
  const [entreprise, setEntreprise]   = useState('');
  const [saving, setSaving]           = useState(false);
  const [msg, setMsg]                 = useState('');

  useEffect(() => {
    settingsAPI.getAll().then(({ data }) => {
      setSettings(data.settings);
      setChauffeur(String(data.settings.chauffeur_surcharge ?? 40));
      setEntreprise(String(data.settings.entreprise_surcharge ?? 0));
    }).finally(() => setLoading(false));
  }, []);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3500); };

  const clamp = (val) => {
    const n = parseFloat(val);
    if (isNaN(n) || n < 0) return 0;
    if (n > 300) return 300;
    return n;
  };

  const handleSave = async () => {
    const cVal = clamp(chauffeur);
    const eVal = clamp(entreprise);
    setSaving(true);
    try {
      await Promise.all([
        settingsAPI.update('chauffeur_surcharge', cVal),
        settingsAPI.update('entreprise_surcharge', eVal),
      ]);
      setChauffeur(String(cVal));
      setEntreprise(String(eVal));
      flash('✅ Tarification mise à jour.');
    } catch {
      flash('❌ Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={card}>
      <h2 style={cardTitle}>💰 Tarification des types de location</h2>
      <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20, lineHeight: 1.6 }}>
        Définissez les majorations appliquées selon le type de location choisi par le client.
        Le prix de base de chaque voiture est multiplié par le pourcentage configuré ici.
      </p>

      {msg && (
        <div style={{
          background: msg.startsWith('✅') ? '#d1fae5' : '#fee2e2',
          color: msg.startsWith('✅') ? '#065f46' : '#991b1b',
          borderRadius: 8, padding: '10px 14px', fontSize: 13, fontWeight: 600, marginBottom: 16,
        }}>
          {msg}
        </div>
      )}

      {loading ? (
        <p style={{ color: '#9ca3af', fontSize: 13 }}>Chargement...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Personal — no surcharge, informational */}
          <div style={{ background: '#f9fafb', borderRadius: 12, padding: '14px 16px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#111827', marginBottom: 2 }}>🧍 Personnel</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Location classique — aucune majoration, prix de base de la voiture.</div>
            </div>
            <div style={{ background: '#d1fae5', color: '#065f46', padding: '6px 14px', borderRadius: 20, fontWeight: 800, fontSize: 14, whiteSpace: 'nowrap' }}>
              +0 %
            </div>
          </div>

          {/* Entreprise surcharge */}
          <div style={{ background: '#f9fafb', borderRadius: 12, padding: '14px 16px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#111827', marginBottom: 2 }}>🏢 Entreprise</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>Majoration appliquée aux locations à usage professionnel.</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    min="0" max="300" step="1"
                    value={entreprise}
                    onChange={e => setEntreprise(e.target.value)}
                    style={{ ...inp, width: 90, textAlign: 'center', fontWeight: 800, fontSize: 18, color: '#1a56db', paddingRight: 28 }}
                  />
                  <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#6b7280', pointerEvents: 'none' }}>%</span>
                </div>
              </div>
            </div>
            {parseFloat(entreprise) > 0 && (
              <div style={{ marginTop: 10, fontSize: 12, color: '#92400e', background: '#fef3c7', borderRadius: 6, padding: '4px 10px', display: 'inline-block' }}>
                Ex: voiture à 10 000 DZD/j → <strong>{(10000 * (1 + parseFloat(entreprise || 0) / 100)).toLocaleString('fr-DZ')} DZD/j</strong>
              </div>
            )}
          </div>

          {/* Chauffeur surcharge */}
          <div style={{ background: '#f9fafb', borderRadius: 12, padding: '14px 16px', border: '2px solid #1a56db' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#111827', marginBottom: 2 }}>👨‍✈️ Avec chauffeur</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>Majoration appliquée lorsque le client choisit un chauffeur AutoLoc.</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    min="0" max="300" step="1"
                    value={chauffeur}
                    onChange={e => setChauffeur(e.target.value)}
                    style={{ ...inp, width: 90, textAlign: 'center', fontWeight: 800, fontSize: 18, color: '#1a56db', paddingRight: 28 }}
                  />
                  <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#6b7280', pointerEvents: 'none' }}>%</span>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: '#92400e', background: '#fef3c7', borderRadius: 6, padding: '4px 10px', display: 'inline-block' }}>
              Ex: voiture à 10 000 DZD/j → <strong>{(10000 * (1 + parseFloat(chauffeur || 0) / 100)).toLocaleString('fr-DZ')} DZD/j</strong>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{ padding: '11px 24px', background: '#1a56db', color: '#fff', border: 'none', borderRadius: 10, cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 15, opacity: saving ? 0.7 : 1, alignSelf: 'flex-start' }}
          >
            {saving ? '⏳ Sauvegarde...' : '💾 Enregistrer les tarifs'}
          </button>
        </div>
      )}
    </div>
  );
}
