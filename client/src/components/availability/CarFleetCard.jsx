import React from 'react';
import { DZD, fmtDateShort, RENTAL_TYPE_LABELS } from '../../utils/format';

export const STATUS_CFG = {
  disponible: { bg: '#d1fae5', text: '#065f46', icon: '✅', label: 'Disponible' },
  louée:      { bg: '#fee2e2', text: '#991b1b', icon: '🚗', label: 'Louée actuellement' },
  bloquée:    { bg: '#fef3c7', text: '#92400e', icon: '🔧', label: 'Bloquée' },
};

export default function CarFleetCard({ car, onSelect, onToggle }) {
  const cfg = STATUS_CFG[car.status];
  return (
    <div
      onClick={() => onSelect(car)}
      style={{
        background: '#fff', borderRadius: 16, border: `1.5px solid ${car.status === 'louée' ? '#fca5a5' : '#e5e7eb'}`,
        overflow: 'hidden', cursor: 'pointer', transition: 'all 0.15s',
      }}
    >
      <div style={{ position: 'relative', height: 140, background: '#f0f4ff' }}>
        {car.images?.[0]
          ? <img src={car.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 40 }}>🚗</div>}
        <span style={{ position: 'absolute', top: 10, right: 10, background: cfg.bg, color: cfg.text, padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 800 }}>
          {cfg.icon} {cfg.label}
        </span>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 15, color: '#111827' }}>{car.brand} {car.model}</div>
        <div style={{ color: '#6b7280', fontSize: 12, marginBottom: 10 }}>{car.year} · {DZD(car.pricePerDay)}/j</div>

        {car.status === 'louée' && car.currentRental && (
          <div style={{ background: '#fef2f2', borderRadius: 10, padding: '10px 12px', marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#991b1b', textTransform: 'uppercase', marginBottom: 4 }}>Loué par</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>
              {car.currentRental.renter?.name || 'Client inconnu'}
            </div>
            {car.currentRental.renter?.phone && (
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>📱 {car.currentRental.renter.phone}</div>
            )}
            <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>
              Jusqu'au {fmtDateShort(car.currentRental.endDate)} · {RENTAL_TYPE_LABELS[car.currentRental.rentalType]}
            </div>
          </div>
        )}

        {car.status === 'bloquée' && (
          <div style={{ background: '#fffbeb', borderRadius: 10, padding: '8px 12px', marginBottom: 10, fontSize: 12, color: '#92400e' }}>
            🔧 {car.unavailableReason || 'Raison non précisée'}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(car); }}
            style={{ flex: 1, padding: '8px', background: '#eff6ff', color: '#1a56db', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 12 }}
          >
            📅 Voir calendrier
          </button>
          {car.status !== 'louée' && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggle(car); }}
              style={{ padding: '8px 12px', background: car.isAvailable ? '#fee2e2' : '#d1fae5', color: car.isAvailable ? '#dc2626' : '#065f46', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 12 }}
            >
              {car.isAvailable ? '🚫' : '✅'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
