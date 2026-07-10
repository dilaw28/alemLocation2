import React from 'react';
import { STATUS_STYLE } from '../../utils/constants';
import { RENTAL_TYPE_LABELS, DZD } from '../../utils/format';

export default function RentalCard({ rental, onCancel }) {
  const cfg = STATUS_STYLE[rental.status] || STATUS_STYLE.en_attente;
  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', border: '1px solid #e5e7eb', marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            <span style={{ fontWeight: 800, fontSize: 16, color: '#111827' }}>
              🚗 {rental.car?.brand} {rental.car?.model}
            </span>
            <span className={`badge ${cfg.cls}`}>{cfg.label}</span>
            {rental.rentalType && (
              <span style={{ background: '#f3f4f6', color: '#374151', padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                {RENTAL_TYPE_LABELS[rental.rentalType] || rental.rentalType}
              </span>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: 6, fontSize: 13, color: '#6b7280' }}>
            <div>📅 <strong>Départ : </strong>{new Date(rental.startDate).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
            <div>📅 <strong>Retour : </strong>{new Date(rental.endDate).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
            <div>⏱ <strong>Durée : </strong>{rental.duration || `${rental.totalDays} j`} · {rental.totalDays} j facturé(s)</div>
            <div>💰 <strong style={{ color: '#1a56db', fontSize: 14 }}>{DZD(rental.totalPrice)}</strong></div>
          </div>
          {rental.adminNote && (
            <div style={{ marginTop: 10, background: '#fef9c3', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#854d0e', display: 'flex', gap: 6 }}>
              <span>📝</span><span><strong>Note admin :</strong> {rental.adminNote}</span>
            </div>
          )}
        </div>
        {rental.status === 'en_attente' && (
          <button
            onClick={() => onCancel(rental._id)}
            style={{ padding: '8px 16px', border: '1.5px solid #ef4444', background: '#fff', color: '#ef4444', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            Annuler
          </button>
        )}
      </div>
    </div>
  );
}
