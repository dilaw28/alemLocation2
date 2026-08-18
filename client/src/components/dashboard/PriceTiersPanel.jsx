import React, { useState, useEffect } from 'react';
import { settingsAPI } from '../../services/api';
import { card, cardTitle, lbl, inp } from './panelStyles';

export default function PriceTiersPanel() {
  const [tiers, setTiers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState('');
  // Form for adding a new tier
  const [newLabel,    setNewLabel]    = useState('');
  const [newDays,     setNewDays]     = useState('');
  const [newDiscount, setNewDiscount] = useState('');
  const [editId,      setEditId]      = useState(null);

  const load = () => {
    settingsAPI.getAll().then(({ data }) => {
      const saved = data.settings.price_tiers;
      if (Array.isArray(saved) && saved.length > 0) {
        setTiers(saved);
      } else {
        // defaults if nothing saved yet
        setTiers([
          { id: 'default-week',  label: '1 semaine', days: 7,  discount: 10 },
          { id: 'default-month', label: '1 mois',    days: 30, discount: 20 },
        ]);
      }
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3500); };

  const genId = () => `tier_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;

  const saveTiers = async (newTiers) => {
    setSaving(true);
    try {
      await settingsAPI.update('price_tiers', newTiers);
      flash('✅ Barème sauvegardé.');
    } catch {
      flash('❌ Erreur lors de la sauvegarde.');
    } finally { setSaving(false); }
  };

  const handleAdd = () => {
    const d = parseInt(newDays);
    const p = parseFloat(newDiscount);
    if (!newLabel.trim()) return flash('❌ Le nom du palier est requis.');
    if (isNaN(d) || d < 1) return flash('❌ Nombre de jours invalide (min. 1).');
    if (isNaN(p) || p < 0 || p > 100) return flash('❌ La réduction doit être entre 0 et 100 %.');
    if (tiers.some(t => t.id !== editId && t.days === d))
      return flash(`❌ Un palier à ${d} jours existe déjà.`);

    let updated;
    if (editId) {
      updated = tiers.map(t => t.id === editId ? { id: editId, label: newLabel.trim(), days: d, discount: p } : t);
      setEditId(null);
    } else {
      updated = [...tiers, { id: genId(), label: newLabel.trim(), days: d, discount: p }];
    }
    // Keep sorted by days ascending
    updated.sort((a, b) => a.days - b.days);
    setTiers(updated);
    saveTiers(updated);
    setNewLabel(''); setNewDays(''); setNewDiscount('');
  };

  const handleEdit = (tier) => {
    setEditId(tier.id);
    setNewLabel(tier.label);
    setNewDays(String(tier.days));
    setNewDiscount(String(tier.discount));
  };

  const handleDelete = (id) => {
    const updated = tiers.filter(t => t.id !== id);
    setTiers(updated);
    saveTiers(updated);
    if (editId === id) { setEditId(null); setNewLabel(''); setNewDays(''); setNewDiscount(''); }
  };

  const handleCancelEdit = () => {
    setEditId(null); setNewLabel(''); setNewDays(''); setNewDiscount('');
  };

  const DZD_ex = (days, discount) => {
    const base = 10000 * days;
    const after = Math.round(base * (1 - discount / 100));
    return { base: base.toLocaleString('fr-DZ'), after: after.toLocaleString('fr-DZ') };
  };

  return (
    <div style={card}>
      <h2 style={cardTitle}>📊 Barème tarifaire dégressif</h2>
      <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20, lineHeight: 1.6 }}>
        Créez autant de paliers que vous souhaitez. Une remise est automatiquement appliquée
        dès que la durée de location atteint le nombre de jours du palier.
        Les paliers sont triés automatiquement par durée croissante.
      </p>

      {msg && (
        <div style={{ background: msg.startsWith('✅') ? '#d1fae5' : '#fee2e2', color: msg.startsWith('✅') ? '#065f46' : '#991b1b', borderRadius: 8, padding: '10px 14px', fontSize: 13, fontWeight: 600, marginBottom: 14 }}>
          {msg}
        </div>
      )}

      {/* ── Add / Edit form ── */}
      <div style={{ background: '#f0f4ff', borderRadius: 12, padding: 18, border: '1.5px solid #c7d7f5', marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#1e40af', marginBottom: 12 }}>
          {editId ? '✏️ Modifier le palier' : '➕ Ajouter un palier'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px 110px', gap: 10, marginBottom: 12 }}>
          <div>
            <label style={lbl}>Nom du palier</label>
            <input
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              placeholder="Ex: Week-end, 3 jours, Quinzaine…"
              style={inp}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <div>
            <label style={lbl}>Jours min.</label>
            <div style={{ position: 'relative' }}>
              <input
                type="number" min="1" max="365"
                value={newDays}
                onChange={e => setNewDays(e.target.value)}
                placeholder="7"
                style={{ ...inp, paddingRight: 26, fontWeight: 700, color: '#1a56db', textAlign: 'center' }}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
              />
              <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 11 }}>j</span>
            </div>
          </div>
          <div>
            <label style={lbl}>Réduction</label>
            <div style={{ position: 'relative' }}>
              <input
                type="number" min="0" max="100" step="0.5"
                value={newDiscount}
                onChange={e => setNewDiscount(e.target.value)}
                placeholder="10"
                style={{ ...inp, paddingRight: 26, fontWeight: 700, color: '#065f46', textAlign: 'center' }}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
              />
              <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 13 }}>%</span>
            </div>
          </div>
        </div>
        {newDays && newDiscount && parseFloat(newDiscount) > 0 && (
          <div style={{ fontSize: 12, color: '#1e40af', background: '#dbeafe', borderRadius: 6, padding: '5px 10px', marginBottom: 10, display: 'inline-block' }}>
            Exemple pour 10 000 DZD/j × {newDays} j :{' '}
            <s>{DZD_ex(parseInt(newDays)||1, 0).base} DZD</s>{' '}
            → <strong>{DZD_ex(parseInt(newDays)||1, parseFloat(newDiscount)||0).after} DZD</strong>
          </div>
        )}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleAdd} disabled={saving}
            style={{ padding: '9px 20px', background: editId ? '#1a56db' : '#059669', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14, opacity: saving ? 0.7 : 1 }}>
            {saving ? '⏳' : editId ? '✏️ Mettre à jour' : '➕ Ajouter'}
          </button>
          {editId && (
            <button onClick={handleCancelEdit}
              style={{ padding: '9px 16px', background: '#fff', color: '#6b7280', border: '1px solid #e5e7eb', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
              Annuler
            </button>
          )}
        </div>
      </div>

      {/* ── Tiers list ── */}
      {loading ? (
        <p style={{ color: '#9ca3af', fontSize: 13 }}>Chargement...</p>
      ) : tiers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 0', color: '#9ca3af', fontSize: 14 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>📊</div>
          Aucun palier défini. Ajoutez-en un ci-dessus.
        </div>
      ) : (
        <>
          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px auto', gap: 8, padding: '6px 12px', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
            <span>Nom</span><span style={{ textAlign: 'center' }}>Jours min.</span><span style={{ textAlign: 'center' }}>Remise</span><span></span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {tiers.map((tier, idx) => {
              const ex = DZD_ex(tier.days, tier.discount);
              const isEditing = editId === tier.id;
              return (
                <div key={tier.id} style={{
                  display: 'grid', gridTemplateColumns: '1fr 90px 90px auto',
                  gap: 8, alignItems: 'center',
                  padding: '12px 14px',
                  background: isEditing ? '#eff6ff' : '#fff',
                  border: `1.5px solid ${isEditing ? '#1a56db' : '#e5e7eb'}`,
                  borderRadius: 10,
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{tier.label}</div>
                    {tier.discount > 0 && (
                      <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                        Ex: 10 000 DZD/j → <s>{ex.base}</s> <strong style={{ color: '#065f46' }}>{ex.after} DZD</strong>
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'center', fontWeight: 800, fontSize: 16, color: '#1a56db' }}>
                    {tier.days} j
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ background: tier.discount > 0 ? '#d1fae5' : '#f3f4f6', color: tier.discount > 0 ? '#065f46' : '#6b7280', padding: '4px 10px', borderRadius: 20, fontWeight: 800, fontSize: 14 }}>
                      -{tier.discount}%
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    <button onClick={() => handleEdit(tier)} title="Modifier"
                      style={{ padding: '6px 10px', background: '#eff6ff', color: '#1a56db', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}>
                      ✏️
                    </button>
                    <button onClick={() => handleDelete(tier.id)} title="Supprimer"
                      style={{ padding: '6px 10px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}>
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: '#6b7280', fontStyle: 'italic' }}>
            {tiers.length} palier(s) · triés automatiquement par durée croissante
          </div>
        </>
      )}
    </div>
  );
}
