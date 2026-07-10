import React, { useEffect, useState } from 'react';
import { rentalsAPI } from '../services/api';
import { DZD, STATUS_STYLE, RENTAL_TYPE_LABELS, fmtDateTime, fmtDate } from '../utils/format';



function NoteModal({ onConfirm, onClose, action }) {
  const [note, setNote] = useState('');
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 420, maxWidth: '90%' }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
          {action === 'approve' ? '✅ Approuver la demande' : '❌ Refuser la demande'}
        </h3>
        <p style={{ color: '#6b7280', marginBottom: 14 }}>Note pour le client (optionnel) :</p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ex: Votre réservation est confirmée. Présentez-vous à 9h."
          style={{ width: '100%', minHeight: 100, padding: 12, border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, boxSizing: 'border-box', resize: 'vertical' }}
        />
        <div style={{ display: 'flex', gap: 12, marginTop: 18, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', border: '1px solid #e5e7eb', borderRadius: 8, cursor: 'pointer', background: '#fff', fontWeight: 600 }}>
            Annuler
          </button>
          <button
            onClick={() => onConfirm(note)}
            style={{ padding: '10px 20px', background: action === 'approve' ? '#1a56db' : '#ef4444', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}
          >
            {action === 'approve' ? 'Approuver' : 'Refuser'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RentalRequests() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { rentalId, action }

  const load = () => {
    setLoading(true);
    rentalsAPI.getAll({ status: 'en_attente' })
      .then(({ data }) => setRentals(data.rentals))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAction = async (note) => {
    try {
      if (modal.action === 'approve') await rentalsAPI.approve(modal.rentalId, note);
      else await rentalsAPI.reject(modal.rentalId, note);
      setModal(null);
      load();
    } catch (err) {
      alert('Erreur: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', margin: 0 }}>⏳ Demandes en cours</h1>
        <p style={{ color: '#6b7280', marginTop: 4 }}>{rentals.length} demande(s) en attente d'approbation</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>Chargement...</div>
      ) : rentals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Aucune demande en attente</div>
          <div style={{ marginTop: 8 }}>Toutes les demandes ont été traitées</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {rentals.map((rental) => (
            <div key={rental._id} style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: '#111827' }}>
                      🚗 {rental.car?.brand} {rental.car?.model} ({rental.car?.year})
                    </span>
                    <span style={{ background: STATUS_STYLE.en_attente.bg, color: STATUS_STYLE.en_attente.text, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                      ⏳ En attente
                    </span>
                    {rental.rentalType && (
                      <span style={{ background: '#f3f4f6', color: '#374151', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                        {RENTAL_TYPE_LABELS[rental.rentalType] || rental.rentalType}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8, marginBottom: 14 }}>
                    {[
                      { label: 'Client', value: `${rental.user?.firstName} ${rental.user?.lastName}` },
                      { label: 'Email', value: rental.user?.email },
                      { label: 'Départ',  value: fmtDateTime(rental.startDate) },
                      { label: 'Retour',  value: new Date(rental.endDate).toLocaleString('fr-FR',   { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) },
                      { label: 'Durée réelle', value: rental.duration || `${rental.totalDays} j` },
                      { label: 'Jours facturés', value: `${rental.totalDays} jour(s)` },
                      { label: 'Prix total', value: DZD(rental.totalPrice) },
                    ].map((info, i) => (
                      <div key={i}>
                        <span style={{ color: '#6b7280', fontSize: 12 }}>{info.label}</span>
                        <div style={{ fontWeight: 600, color: '#111827', fontSize: 14 }}>{info.value}</div>
                      </div>
                    ))}
                  </div>

                  {rental.additionalNotes && (
                    <div style={{ background: '#f9fafb', borderRadius: 8, padding: 12, marginBottom: 10, fontSize: 13, color: '#374151' }}>
                      💬 {rental.additionalNotes}
                    </div>
                  )}

                  {rental.licenseImage && (
                    <a href={rental.licenseImage} target="_blank" rel="noreferrer" style={{ color: '#1a56db', fontSize: 13, fontWeight: 600 }}>
                      🪪 Voir le permis de conduire →
                    </a>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button
                    onClick={() => setModal({ rentalId: rental._id, action: 'approve' })}
                    style={{ padding: '12px 24px', background: '#1a56db', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14 }}
                  >
                    ✅ Approuver
                  </button>
                  <button
                    onClick={() => setModal({ rentalId: rental._id, action: 'reject' })}
                    style={{ padding: '12px 24px', background: '#fff', color: '#ef4444', border: '2px solid #ef4444', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14 }}
                  >
                    ❌ Refuser
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <NoteModal
          action={modal.action}
          onConfirm={handleAction}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
