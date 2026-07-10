import React, { useState, useEffect } from 'react';
import { locationsAPI } from '../../services/api';
import { card, cardTitle, lbl, inp } from './panelStyles';

const LOCATION_TYPES = ['ville', 'aéroport', 'gare', 'hôtel', 'autre'];
const TYPE_ICONS = { ville: '🏙️', aéroport: '✈️', gare: '🚂', hôtel: '🏨', autre: '📍' };

export default function LocationsPanel() {
  const [locations, setLocations]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [name, setName]             = useState('');
  const [type, setType]             = useState('ville');
  const [address, setAddress]       = useState('');
  const [saving, setSaving]         = useState(false);
  const [editId, setEditId]         = useState(null);
  const [msg, setMsg]               = useState('');

  const load = () => {
    setLoading(true);
    locationsAPI.getAll()
      .then(({ data }) => setLocations(data.locations))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const handleSave = async () => {
    if (!name.trim()) return flash('❌ Le nom est requis.');
    setSaving(true);
    try {
      if (editId) {
        await locationsAPI.update(editId, { name, type, address });
        flash('✅ Localisation modifiée.');
      } else {
        await locationsAPI.create({ name, type, address });
        flash('✅ Localisation ajoutée.');
      }
      setName(''); setType('ville'); setAddress(''); setEditId(null);
      load();
    } catch (err) {
      flash('❌ ' + (err.response?.data?.message || 'Erreur.'));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (loc) => {
    setEditId(loc._id); setName(loc.name); setType(loc.type); setAddress(loc.address);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette localisation ?')) return;
    try {
      await locationsAPI.delete(id);
      flash('✅ Supprimée.');
      load();
    } catch { flash('❌ Erreur lors de la suppression.'); }
  };

  const handleToggle = async (loc) => {
    await locationsAPI.update(loc._id, { isActive: !loc.isActive });
    load();
  };

  return (
    <div style={card}>
      <h2 style={cardTitle}>📍 Gestion des localisations</h2>
      <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>
        Ces lieux s'affichent dans le formulaire de réservation côté client (prise en charge & retour).
      </p>

      {msg && (
        <div style={{ background: msg.startsWith('✅') ? '#d1fae5' : '#fee2e2', color: msg.startsWith('✅') ? '#065f46' : '#991b1b', borderRadius: 8, padding: '10px 14px', fontSize: 13, fontWeight: 600, marginBottom: 14 }}>
          {msg}
        </div>
      )}

      {/* Form */}
      <div style={{ background: '#f9fafb', borderRadius: 12, padding: 18, marginBottom: 20, border: '1px solid #e5e7eb' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: 10, marginBottom: 10 }}>
          <div>
            <label style={lbl}>Nom du lieu *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Aéroport Houari Boumédiène" style={inp} />
          </div>
          <div>
            <label style={lbl}>Type</label>
            <select value={type} onChange={e => setType(e.target.value)} style={inp}>
              {LOCATION_TYPES.map(t => <option key={t} value={t}>{TYPE_ICONS[t]} {t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={lbl}>Adresse (optionnel)</label>
          <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Ex: Route de l'aéroport, Alger" style={inp} />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleSave} disabled={saving} style={{ padding: '9px 20px', background: '#1a56db', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
            {saving ? '⏳...' : editId ? '✏️ Modifier' : '➕ Ajouter'}
          </button>
          {editId && (
            <button onClick={() => { setEditId(null); setName(''); setType('ville'); setAddress(''); }} style={{ padding: '9px 20px', background: '#fff', color: '#6b7280', border: '1px solid #e5e7eb', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
              Annuler
            </button>
          )}
        </div>
      </div>

      {/* List */}
      {loading ? <p style={{ color: '#6b7280', fontSize: 13 }}>Chargement...</p> : locations.length === 0 ? (
        <p style={{ color: '#9ca3af', fontSize: 14, textAlign: 'center', padding: 20 }}>Aucune localisation ajoutée pour l'instant.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {locations.map(loc => (
            <div key={loc._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, gap: 10, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 22 }}>{TYPE_ICONS[loc.type]}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{loc.name}</div>
                  {loc.address && <div style={{ fontSize: 12, color: '#6b7280' }}>{loc.address}</div>}
                </div>
                <span style={{ background: '#f3f4f6', color: '#374151', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{loc.type}</span>
                {!loc.isActive && <span style={{ background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>Inactif</span>}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => handleToggle(loc)} title={loc.isActive ? 'Désactiver' : 'Activer'} style={{ padding: '6px 10px', background: loc.isActive ? '#fef3c7' : '#d1fae5', color: loc.isActive ? '#92400e' : '#065f46', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
                  {loc.isActive ? '⏸️' : '▶️'}
                </button>
                <button onClick={() => handleEdit(loc)} style={{ padding: '6px 10px', background: '#eff6ff', color: '#1a56db', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>✏️</button>
                <button onClick={() => handleDelete(loc._id)} style={{ padding: '6px 10px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
