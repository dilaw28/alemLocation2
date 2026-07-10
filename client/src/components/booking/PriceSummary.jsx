import React from 'react';
import { DZD } from '../../utils/format';

export default function PriceSummary({
  billedDays, realDuration, hasExtra, remHours,
  car, surchargeRate, rentalType, surcharges,
  tierDiscount, pricePerDayBase, totalPrice,
}) {
  if (billedDays <= 0) return null;

  return (
    <div className="summary-box" style={{ marginBottom: 16 }}>
      <div className="summary-row">
        <span>Durée réelle</span>
        <span style={{ fontWeight: 600 }}>{realDuration}</span>
      </div>

      <div className="summary-row" style={{ alignItems: 'flex-start' }}>
        <span>Jours facturés</span>
        <span style={{ textAlign: 'right' }}>
          <strong>{billedDays} jour(s)</strong>
          {hasExtra && (
            <div style={{ fontSize: 11, color: '#92400e', background: '#fef3c7', borderRadius: 4, padding: '2px 6px', marginTop: 3 }}>
              +{remHours}h → arrondi au jour supérieur
            </div>
          )}
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
    </div>
  );
}
