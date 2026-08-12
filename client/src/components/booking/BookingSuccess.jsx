import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';  // components/Navbar.jsx
import { DZD, RENTAL_TYPE_LABELS, fmtDatetime } from '../../utils/format';

export default function BookingSuccess({ car, rentalType, startDT, endDT, billedDays, totalPrice }) {
  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 560, margin: '80px auto', textAlign: 'center', padding: 24 }}>
        <div style={{ fontSize: 72, marginBottom: 24 }}>✅</div>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Demande envoyée !</h2>
        <div style={{ background: '#f0f4ff', borderRadius: 14, padding: 20, marginBottom: 24, textAlign: 'left' }}>
          <p style={{ color: '#374151', fontSize: 14, marginBottom: 6 }}>
            <strong>🚗 Véhicule :</strong> {car.brand} {car.model}
          </p>
          <p style={{ color: '#374151', fontSize: 14, marginBottom: 6 }}>
            <strong>📅 Départ :</strong> {fmtDatetime(startDT)}
          </p>
          <p style={{ color: '#374151', fontSize: 14, marginBottom: 6 }}>
            <strong>📅 Retour :</strong> {fmtDatetime(endDT)}
          </p>
          <p style={{ color: '#374151', fontSize: 14, marginBottom: 6 }}>
            <strong>📋 Jours facturés :</strong> {billedDays} jour(s)
          </p>
          <p style={{ color: '#1a56db', fontSize: 15, fontWeight: 800 }}>
            💰 Total : {DZD(totalPrice)}
          </p>
        </div>
        <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
          Votre demande {RENTAL_TYPE_LABELS[rentalType]} a bien été transmise. L'administrateur la traitera sous 24h.
        </p>
        <Link to="/profile" className="btn-primary" style={{ padding: '14px 28px', fontSize: 15 }}>
          Voir mes locations →
        </Link>
      </div>
    </>
  );
}
