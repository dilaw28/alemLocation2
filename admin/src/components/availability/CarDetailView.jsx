import React, { useState, useEffect } from 'react';
import { availabilityAPI } from '../../services/api';
import { DZD, fmtDate, RENTAL_TYPE_LABELS } from '../../utils/format';
import MiniCalendar from './MiniCalendar';
import BlockModal from './BlockModal';
import BookModal from './BookModal';

export default function CarDetailView({ car, onBack, onRefresh }) {
  const [data, setData]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [monthOffset, setMonthOffset] = useState(0);
  const [showBlock, setShowBlock]     = useState(false);
  const [showBook, setShowBook]       = useState(false);

  const load = () => {
    setLoading(true);
    availabilityAPI.getCalendar(car._id)
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [car._id]);

  const handleDelete = async (rentalId) => {
    if (!window.confirm('Supprimer cette période ?')) return;
    try {
      await availabilityAPI.deletePeriod(rentalId);
      load();
      onRefresh();
    } catch {
      alert('Erreur lors de la suppression.');
    }
  };

  const handleAfterModal = () => {
    setShowBlock(false);
    setShowBook(false);
    load();
    onRefresh();
  };

  const periods  = data?.periods || [];
  const upcoming = periods.filter(p => new Date(p.endDate) >= new Date());
  const past     = periods.filter(p => new Date(p.endDate) < new Date());

  return (
    <div>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#1a56db', fontWeight: 700, cursor: 'pointer', marginBottom: 16, fontSize: 14 }}>
        ← Retour à la liste
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', margin: 0 }}>{car.brand} {car.model}</h1>
          <p style={{ color: '#6b7280', marginTop: 4 }}>{car.year} · {DZD(car.pricePerDay)}/jour</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowBook(true)} style={{ padding: '10px 18px', background: '#1a56db', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
            📅 Réserver
          </button>
          <button onClick={() => setShowBlock(true)} style={{ padding: '10px 18px', background: '#fef3c7', color: '#92400e', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
            🔧 Bloquer
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 24 }}>
        {/* Calendar */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', padding: 20 }}>
          <MiniCalendar periods={periods} monthOffset={monthOffset} onMonthChange={setMonthOffset} />
        </div>

        {/* Periods list */}
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>Chargement...</div>
          ) : (
            <>
              <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: '#111827' }}>
                📋 Périodes à venir / en cours ({upcoming.length})
              </h3>
              {upcoming.length === 0 ? (
                <div style={{ color: '#9ca3af', fontSize: 14, marginBottom: 24 }}>
                  Aucune réservation à venir — véhicule entièrement disponible.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                  {upcoming.map(p => (
                    <div key={p._id} style={{ background: '#fff', border: `1.5px solid ${p.isBlock ? '#fde68a' : '#fca5a5'}`, borderRadius: 12, padding: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>
                            {p.isBlock ? '🔧 Bloqué' : p.renter ? `👤 ${p.renter.name}` : '👤 Client walk-in'}
                          </div>
                          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                            {fmtDate(p.startDate)} → {fmtDate(p.endDate)}
                          </div>
                          {p.renter?.phone && <div style={{ fontSize: 12, color: '#6b7280' }}>📱 {p.renter.phone}</div>}
                          {!p.isBlock && (
                            <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                              {RENTAL_TYPE_LABELS[p.rentalType]} · {p.source === 'admin' ? '🛠️ Manuel' : '🌐 Client'}
                            </div>
                          )}
                          {p.adminNote && p.isBlock && <div style={{ fontSize: 12, color: '#92400e', marginTop: 2 }}>📝 {p.adminNote}</div>}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                          <span style={{ background: p.isBlock ? '#fef3c7' : '#fee2e2', color: p.isBlock ? '#92400e' : '#991b1b', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                            {p.isBlock ? 'Bloqué' : p.status}
                          </span>
                          {!p.isBlock && p.totalPrice > 0 && <span style={{ fontWeight: 700, color: '#1a56db', fontSize: 13 }}>{DZD(p.totalPrice)}</span>}
                          <button onClick={() => handleDelete(p._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                            🗑️ Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {past.length > 0 && (
                <>
                  <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: '#6b7280' }}>
                    🕓 Historique ({past.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {past.map(p => (
                      <div key={p._id} style={{ background: '#f9fafb', borderRadius: 10, padding: 12, fontSize: 12, color: '#6b7280' }}>
                        {p.isBlock ? '🔧 Bloqué' : p.renter?.name || 'Client'} · {fmtDate(p.startDate)} → {fmtDate(p.endDate)}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {showBlock && <BlockModal car={car} onClose={() => setShowBlock(false)} onSaved={handleAfterModal} />}
      {showBook  && <BookModal  car={car} onClose={() => setShowBook(false)}  onSaved={handleAfterModal} />}
    </div>
  );
}
