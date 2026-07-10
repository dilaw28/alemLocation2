import React, { useState } from 'react';
import { uploadAPI } from '../../services/api';
import { card, cardTitle } from './panelStyles';

export default function LicensePurgePanel() {
  const [purging, setPurging] = useState(false);
  const [result, setResult]   = useState(null);
  const [confirm, setConfirm] = useState(false);

  const handlePurge = async () => {
    if (!confirm) { setConfirm(true); return; }
    setPurging(true);
    setResult(null);
    try {
      const { data } = await uploadAPI.purgeAllLicenses();
      setResult({ success: true, message: data.message, deleted: data.deleted });
    } catch (err) {
      setResult({ success: false, message: err.response?.data?.message || 'Erreur lors de la purge.' });
    } finally {
      setPurging(false);
      setConfirm(false);
    }
  };

  return (
    <div style={card}>
      <h2 style={cardTitle}>🗑️ Purge des permis de conduire</h2>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
        Supprime toutes les images de permis stockées sur ImageKit pour libérer de l'espace (limite gratuite : 2 Go).
        Les demandes de location conservent leur historique, seule l'image est effacée.
      </p>

      <div style={{ background: '#fef9c3', border: '1px solid #fcd34d', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#92400e' }}>
        ⚠️ <strong>Action irréversible.</strong> Les images supprimées ne pourront pas être récupérées depuis ImageKit.
      </div>

      {result && (
        <div style={{ background: result.success ? '#d1fae5' : '#fee2e2', color: result.success ? '#065f46' : '#991b1b', borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontSize: 14, fontWeight: 600 }}>
          {result.success ? '✅' : '❌'} {result.message}
          {result.success && result.deleted > 0 && (
            <div style={{ fontSize: 12, fontWeight: 400, marginTop: 4 }}>{result.deleted} fichier(s) effacé(s) d'ImageKit.</div>
          )}
        </div>
      )}

      {confirm && !purging && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 10, padding: '14px 16px', marginBottom: 16, fontSize: 14 }}>
          <strong>Êtes-vous sûr ?</strong> Cliquez à nouveau sur "Purger" pour confirmer la suppression de tous les permis.
        </div>
      )}

      <button
        onClick={handlePurge}
        disabled={purging}
        style={{ padding: '11px 24px', background: confirm ? '#dc2626' : '#ef4444', color: '#fff', border: 'none', borderRadius: 10, cursor: purging ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 15, opacity: purging ? 0.7 : 1, transition: 'background 0.2s' }}
      >
        {purging ? '⏳ Suppression en cours...' : confirm ? '⚠️ Confirmer la purge' : '🗑️ Purger tous les permis'}
      </button>

      {confirm && (
        <button onClick={() => setConfirm(false)} style={{ marginLeft: 10, padding: '11px 20px', background: '#fff', color: '#6b7280', border: '1px solid #e5e7eb', borderRadius: 10, cursor: 'pointer', fontWeight: 600 }}>
          Annuler
        </button>
      )}
    </div>
  );
}
