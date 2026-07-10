import React from 'react';

export default function Field({ label, required, error, hint, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
        {label}
        {required && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}
      </label>
      {hint && <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>{hint}</div>}
      {children}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5 }}>
          <span style={{ color: '#ef4444', fontSize: 14 }}>⚠</span>
          <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 500 }}>{error}</span>
        </div>
      )}
    </div>
  );
}

export const inputStyle = (hasError) => ({
  width: '100%',
  padding: '12px 14px',
  border: `1.5px solid ${hasError ? '#ef4444' : '#e5e7eb'}`,
  borderRadius: 10,
  fontSize: 15,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
  background: hasError ? '#fff5f5' : '#fff',
});
