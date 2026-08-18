import React, { useEffect, useState } from 'react';
import { rentalsAPI, adminAPI } from '../services/api';
import { DZD, STATUS_STYLE, RENTAL_TYPE_LABELS, fmtDateTime, fmtDate } from '../utils/format';



export default function RentalHistory() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    rentalsAPI.getAll()
      .then(({ data }) => {
        const filtered = data.rentals.filter(r => r.status !== 'en_attente');
        setRentals(filtered);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleComplete = async (id) => {
    if (!window.confirm('Marquer cette location comme terminée ?')) return;
    try {
      await rentalsAPI.complete(id);
      setRentals(prev => prev.map(r => r._id === id ? { ...r, status: 'terminée' } : r));
    } catch (err) {
      alert('Erreur');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("⚠️ Annuler cette réservation ? Le véhicule redeviendra disponible.")) return;
    try {
      await rentalsAPI.cancel(id);
      setRentals(prev => prev.map(r => r._id === id ? { ...r, status: 'annulée' } : r));
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de l'annulation.");
    }
  };

  const handleClearHistory = async () => {
    const closedCount = rentals.filter(r => ['terminée', 'annulée', 'refusée'].includes(r.status)).length;
    if (closedCount === 0) {
      alert("Aucune entrée d'historique à supprimer (terminées/annulées/refusées).");
      return;
    }
    if (!window.confirm(`⚠️ Supprimer définitivement ${closedCount} entrée(s) d'historique (terminées, annulées, refusées) ?\n\nCette action est irréversible.`)) return;
    setClearing(true);
    try {
      const { data } = await adminAPI.clearHistory();
      setRentals(prev => prev.filter(r => !['terminée', 'annulée', 'refusée'].includes(r.status)));
      alert(data.message);
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la suppression.');
    } finally {
      setClearing(false);
    }
  };

  const displayed = filter === 'all' ? rentals : rentals.filter(r => r.status === filter);

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', margin: 0 }}>📋 Historique des locations</h1>
          <p style={{ color: '#6b7280', marginTop: 4 }}>{rentals.length} location(s) au total</p>
        </div>
        <button
          onClick={handleClearHistory}
          disabled={clearing}
          style={{ padding: '10px 18px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 10, cursor: clearing ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 13, opacity: clearing ? 0.6 : 1, whiteSpace: 'nowrap' }}
        >
          {clearing ? '⏳ Suppression...' : '🗑️ Vider l\'historique'}
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {['all', 'approuvée', 'en_cours', 'terminée', 'annulée', 'refusée'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{ padding: '8px 16px', borderRadius: 20, border: '1.5px solid', cursor: 'pointer', fontWeight: 600, fontSize: 13,
              background: filter === s ? '#1a56db' : '#fff',
              color: filter === s ? '#fff' : '#6b7280',
              borderColor: filter === s ? '#1a56db' : '#e5e7eb',
            }}
          >
            {s === 'all' ? '📋 Tous' : STATUS_STYLE[s]?.label || s} ({s === 'all' ? rentals.length : rentals.filter(r => r.status === s).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>Chargement...</div>
      ) : displayed.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>
          <div style={{ fontSize: 48 }}>📋</div>
          <div style={{ marginTop: 12 }}>Aucune location trouvée</div>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                {['Client', 'Voiture', 'Type', 'Départ', 'Retour', 'Durée réelle', 'Jours fact.', 'Prix', 'Statut', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 13, fontWeight: 700, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.map((rental) => {
                const cfg = STATUS_STYLE[rental.status];
                return (
                  <tr key={rental._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 600, color: '#111827', fontSize: 14 }}>{rental.user?.firstName} {rental.user?.lastName}</div>
                      <div style={{ color: '#6b7280', fontSize: 12 }}>{rental.user?.email}</div>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#111827', fontSize: 14 }}>
                      {rental.car?.brand} {rental.car?.model}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 12, color: '#374151' }}>
                      {RENTAL_TYPE_LABELS[rental.rentalType] || '—'}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#374151', fontSize: 12 }}>
                      {fmtDateTime(rental.startDate)}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#374151', fontSize: 12 }}>
                      {fmtDateTime(rental.endDate)}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#374151', fontSize: 13 }}>
                      {rental.duration || '—'}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#374151', fontSize: 13, fontWeight: 600 }}>
                      {rental.totalDays} j
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#1a56db', fontSize: 13 }}>{DZD(rental.totalPrice)}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ background: cfg?.bg, color: cfg?.text, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                        {cfg?.label || rental.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {rental.status === 'approuvée' && (
                          <button onClick={() => handleComplete(rental._id)} style={{ padding: '6px 12px', background: '#d1fae5', color: '#065f46', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
                            Terminer
                          </button>
                        )}
                        {['approuvée', 'en_cours'].includes(rental.status) && (
                          <button onClick={() => handleCancel(rental._id)} style={{ padding: '6px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
                            Annuler
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
