import React, { useState } from 'react';
import { availabilityAPI } from '../../services/api';
import { todayStr } from '../../utils/format';

const REASONS = ['Maintenance', 'Réparation', 'Nettoyage', 'Accident', 'Contrôle technique', 'Autre'];

export default function BlockModal({ car, onClose, onSaved }) {
  const [startDate, setStartDate] = useState(todayStr());
  const [endDate, setEndDate]     = useState('');
  const [reason, setReason]       = useState('');
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');

  const handleSubmit = async () => {
    setError('');
    if (!startDate || !endDate) return setError('Les deux dates sont requises.');
    if (new Date(endDate) <= new Date(startDate)) return setError('La date de fin doit être après le début.');
    setSaving(true);
    try {
      await availabilityAPI.block(car._id, { startDate, endDate, reason });
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du blocage.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 440 }}>
        <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>🔧 Bloquer le véhicule</h3>
        <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>{car.brand} {car.model} — indisponible pour ces dates.</p>

        {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 14, fontWeight: 600 }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 4 }}>Date début *</label>
            <input type="date" value={startDate} min={todayStr()} onChange={e => setStartDate(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 4 }}>Date fin *</label>
            <input type="date" value={endDate} min={startDate} onChange={e => setEndDate(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>Raison</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
            {REASONS.map(r => (
              <button key={r} onClick={() => setReason(r)}
                style={{ padding: '6px 12px', borderRadius: 20, border: `1.5px solid ${reason === r ? '#1a56db' : '#e5e7eb'}`, background: reason === r ? '#eff6ff' : '#fff', color: reason === r ? '#1a56db' : '#6b7280', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                {r}
              </button>
            ))}
          </div>
          <input value={reason} onChange={e => setReason(e.target.value)} placeholder="Précisez la raison..."
            style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', cursor: 'pointer', fontWeight: 600 }}>Annuler</button>
          <button onClick={handleSubmit} disabled={saving}
            style={{ padding: '10px 22px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>
            {saving ? '⏳...' : '🔧 Bloquer'}
          </button>
        </div>
      </div>
    </div>
  );
}
