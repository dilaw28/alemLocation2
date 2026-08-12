import React from 'react';
import { useAlert } from '../context/AlertContext';

const STYLES = {
  error:   { icon: '⚠️', color: '#ef4444', bg: '#fee2e2', border: '#fca5a5' },
  success: { icon: '✅', color: '#10b981', bg: '#d1fae5', border: '#6ee7b7' },
  info:    { icon: 'ℹ️', color: '#1a56db', bg: '#dbeafe', border: '#93c5fd' },
};

export default function AlertModal() {
  const { alert, closeAlert } = useAlert();
  if (!alert) return null;

  const s = STYLES[alert.type] || STYLES.error;

  return (
    <div
      onClick={closeAlert}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(17,24,39,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 3000, padding: 20, animation: 'fadeIn 0.15s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 18, padding: '28px 26px', width: '100%', maxWidth: 400,
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)', textAlign: 'center',
          animation: 'popIn 0.18s ease-out',
        }}
      >
        <div style={{
          width: 60, height: 60, borderRadius: '50%', background: s.bg, border: `2px solid ${s.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 16px',
        }}>
          {s.icon}
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: '#111827', marginBottom: 8 }}>
          {alert.title}
        </h3>
        <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.6, marginBottom: 22 }}>
          {alert.message}
        </p>
        <button
          onClick={closeAlert}
          style={{
            width: '100%', padding: '12px', background: s.color, color: '#fff', border: 'none',
            borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer',
          }}
        >
          Compris
        </button>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}
