import React from 'react';
import { RENTAL_TYPES } from '../../utils/format';

export default function RentalTypeSelector({ value, onChange }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>
        Type de location *
      </label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {RENTAL_TYPES.map((t) => (
          <label key={t.value} style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: '12px 14px',
            border: `2px solid ${value === t.value ? '#1a56db' : '#e5e7eb'}`,
            borderRadius: 10, cursor: 'pointer',
            background: value === t.value ? '#eff6ff' : '#fff',
            transition: 'all 0.15s',
          }}>
            <input
              type="radio"
              name="rentalType"
              value={t.value}
              checked={value === t.value}
              onChange={() => onChange(t.value)}
              style={{ marginTop: 3 }}
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{t.label}</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2, lineHeight: 1.5 }}>{t.desc}</div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
