import React from 'react';
import { COUNTRY_CODES } from '../../utils/constants';
import Field, { inputStyle } from './Field';

export default function PhoneField({ label, required, hint, countryCode, onCountryChange, phone, onPhoneChange, error }) {
  const selectedCC = COUNTRY_CODES.find(c => c.code === countryCode);

  return (
    <Field label={label} required={required} hint={hint} error={error}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
        {/* Country code selector */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <select
            value={countryCode}
            onChange={e => onCountryChange(e.target.value)}
            style={{
              height: '100%',
              padding: '12px 36px 12px 12px',
              border: `1.5px solid ${error ? '#ef4444' : '#e5e7eb'}`,
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              background: '#f9fafb',
              cursor: 'pointer',
              outline: 'none',
              appearance: 'none',
              minWidth: 100,
            }}
          >
            {COUNTRY_CODES.map(c => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code}
              </option>
            ))}
          </select>
          <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6b7280', fontSize: 10 }}>▼</span>
        </div>

        {/* Phone number input */}
        <input
          type="tel"
          value={phone}
          onChange={e => onPhoneChange(e.target.value.replace(/[^\d\s\-().]/g, ''))}
          placeholder="6 12 34 56 78"
          required={required}
          style={{ ...inputStyle(!!error), flex: 1 }}
        />
      </div>

      {/* Live preview */}
      {countryCode && phone && !error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, padding: '6px 10px', background: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe' }}>
          <span style={{ fontSize: 16 }}>{selectedCC?.flag}</span>
          <span style={{ fontSize: 13, color: '#1a56db', fontWeight: 700 }}>
            {countryCode} {phone}
          </span>
          <span style={{ fontSize: 11, color: '#3b82f6', marginLeft: 4 }}>
            {selectedCC?.name}
          </span>
        </div>
      )}
    </Field>
  );
}
