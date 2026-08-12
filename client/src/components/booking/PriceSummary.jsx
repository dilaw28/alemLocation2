import React from 'react';
import { DZD } from '../../utils/format';

export default function PriceSummary({
  billedDays, hasExtra, remHours,
  car, surchargeRate, rentalType, surcharges,
  tierDiscount, pricePerDayBase, totalPrice,
}) {
  if (billedDays <= 0) return null;

  return (
    <div className="summary-box" style={{ marginBottom: 16 }}>
      <div className="summary-row" style={{ alignItems: 'flex-start' }}>
        <span>Jours facturés</span>
        <span style={{ textAlign: 'right' }}>
          <strong>{billedDays} jour(s)</strong>
        </span>
      </div>

      <div className="summary-row">
        <span>Prix de base/jour</span>
        <span>{DZD(car.pricePerDay)}</span>
      </div>

      {surchargeRate > 0 && (
        <div className="summary-row" style={{ color: '#92400e' }}>
          <span>
            {rentalType === 'avec_chauffeur'
              ? `Supplément chauffeur (+${surcharges.chauffeur_surcharge ?? 40}%)`
              : `Majoration entreprise (+${surcharges.entreprise_surcharge}%)`}
          </span>
          <span>{DZD(Math.round(car.pricePerDay * surchargeRate) * billedDays)}</span>
        </div>
      )}

      {tierDiscount.discount > 0 && (
        <div className="summary-row" style={{ color: '#065f46' }}>
          <span>🎁 Remise {tierDiscount.label} (-{tierDiscount.discount}%)</span>
          <span>-{DZD(Math.round(pricePerDayBase * (tierDiscount.discount / 100)) * billedDays)}</span>
        </div>
      )}

      <div className="summary-total">
        <span>Total estimé</span>
        <span>{DZD(totalPrice)}</span>
      </div>

      {/* Explication facturation à la minute près */}
      <div style={{ marginTop: 12, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '10px 12px', fontSize: 12, color: '#92400e', lineHeight: 1.5 }}>
        ⏱️ Vérifiez bien vos heures et minutes de départ et de retour : <strong>tout dépassement, même de quelques minutes, est facturé comme un jour supplémentaire.</strong>
      </div>
    </div>
  );
}
