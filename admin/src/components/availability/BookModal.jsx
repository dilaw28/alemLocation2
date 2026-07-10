import React, { useState, useEffect, useMemo } from 'react';
import { availabilityAPI, adminAPI } from '../../services/api';
import { DZD, todayStr, RENTAL_TYPE_LABELS } from '../../utils/format';

export default function BookModal({ car, onClose, onSaved }) {
  const [users, setUsers]               = useState([]);
  const [userSearch, setUserSearch]     = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [startDate, setStartDate]       = useState(todayStr());
  const [endDate, setEndDate]           = useState('');
  const [rentalType, setRentalType]     = useState('personnel');
  const [pickupLocation, setPickupLocation] = useState('');
  const [returnLocation, setReturnLocation] = useState('');
  const [notes, setNotes]               = useState('');
  const [saving, setSaving]             = useState(false);
  const [error, setError]               = useState('');

  useEffect(() => {
    adminAPI.getUsers().then(({ data }) => setUsers(data.users)).catch(() => {});
  }, []);

  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return [];
    const q = userSearch.toLowerCase();
    return users.filter(u => `${u.firstName} ${u.lastName} ${u.email} ${u.phone}`.toLowerCase().includes(q)).slice(0, 6);
  }, [userSearch, users]);

  const totalDays = startDate && endDate && new Date(endDate) > new Date(startDate)
    ? Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000)
    : 0;
  const totalPrice = totalDays * (car.pricePerDay || 0);

  const handleSubmit = async () => {
    setError('');
    if (!startDate || !endDate) return setError('Les deux dates sont requises.');
    if (new Date(endDate) <= new Date(startDate)) return setError('La date de fin doit être après le début.');

    setSaving(true);
    try {
      await availabilityAPI.bookManual(car._id, {
        userId: selectedUser?._id,
        startDate, endDate, rentalType,
        pickupLocation, returnLocation,
        additionalNotes: notes,
      });
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la réservation.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>
        <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>📅 Réserver pour un client</h3>
        <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>{car.brand} {car.model} — réservation manuelle sur dates précises.</p>

        {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 14, fontWeight: 600 }}>{error}</div>}

        {/* Client search */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 4 }}>Client (optionnel)</label>
          {selectedUser ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#eff6ff', borderRadius: 8, padding: '10px 14px', border: '1.5px solid #1a56db' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{selectedUser.firstName} {selectedUser.lastName}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>{selectedUser.email}</div>
              </div>
              <button onClick={() => setSelectedUser(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontWeight: 700 }}>✕</button>
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <input
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                placeholder="Rechercher un client par nom, email..."
                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
              />
              {filteredUsers.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, marginTop: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10, maxHeight: 200, overflowY: 'auto' }}>
                  {filteredUsers.map(u => (
                    <div key={u._id} onClick={() => { setSelectedUser(u); setUserSearch(''); }}
                      style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{u.firstName} {u.lastName}</div>
                      <div style={{ fontSize: 11, color: '#6b7280' }}>{u.email}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>Laissez vide pour une réservation sans compte client (walk-in).</div>
        </div>

        {/* Dates */}
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

        {totalDays > 0 && (
          <div style={{ background: '#f0f4ff', borderRadius: 10, padding: '10px 14px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span>{totalDays} jour(s)</span>
            <strong style={{ color: '#1a56db' }}>{DZD(totalPrice)}</strong>
          </div>
        )}

        {/* Rental type */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>Type de location</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {Object.entries(RENTAL_TYPE_LABELS).map(([val, label]) => (
              <button key={val} onClick={() => setRentalType(val)}
                style={{ flex: 1, padding: '8px', borderRadius: 8, border: `1.5px solid ${rentalType === val ? '#1a56db' : '#e5e7eb'}`, background: rentalType === val ? '#eff6ff' : '#fff', color: rentalType === val ? '#1a56db' : '#6b7280', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Locations */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 4 }}>Lieu prise en charge</label>
            <input value={pickupLocation} onChange={e => setPickupLocation(e.target.value)} placeholder="Ex: Agence Alger"
              style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 4 }}>Lieu de retour</label>
            <input value={returnLocation} onChange={e => setReturnLocation(e.target.value)} placeholder="Ex: Agence Alger"
              style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 4 }}>Notes</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Notes internes..."
            style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', resize: 'vertical' }} />
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', cursor: 'pointer', fontWeight: 600 }}>Annuler</button>
          <button onClick={handleSubmit} disabled={saving}
            style={{ padding: '10px 22px', background: '#1a56db', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>
            {saving ? '⏳...' : '✅ Réserver'}
          </button>
        </div>
      </div>
    </div>
  );
}
