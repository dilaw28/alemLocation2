import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import { DZD, STATUS_STYLE, RENTAL_TYPE_LABELS, fmtDateTime, fmtDate } from '../utils/format';



function InfoCard({ label, value, icon }) {
  return (
    <div style={{ background: '#f9fafb', borderRadius: 10, padding: '12px 14px', border: '1px solid #e5e7eb' }}>
      <div style={{ color: '#6b7280', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
        {icon} {label}
      </div>
      <div style={{ fontWeight: 600, color: '#111827', fontSize: 14, wordBreak: 'break-word' }}>
        {value || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Non renseigné</span>}
      </div>
    </div>
  );
}

export default function Users() {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [selected, setSelected] = useState(null);
  const [detail, setDetail]     = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    adminAPI.getUsers()
      .then(({ data }) => setUsers(data.users))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = async (user) => {
    setSelected(user);
    setDetail(null);
    setLoadingDetail(true);
    try {
      const { data } = await adminAPI.getUserDetail(user._id);
      setDetail(data);
    } catch {}
    finally { setLoadingDetail(false); }
  };

  const handleToggle = async (userId) => {
    const { data } = await adminAPI.toggleUser(userId);
    setUsers(prev => prev.map(u => u._id === userId ? data.user : u));
    if (selected?._id === userId) {
      setSelected(data.user);
      setDetail(prev => prev ? { ...prev, user: data.user } : prev);
    }
  };

  const totalSpent = detail?.rentals
    ?.filter(r => ['approuvée','en_cours','terminée'].includes(r.status))
    ?.reduce((sum, r) => sum + (r.totalPrice || 0), 0) || 0;

  const filtered = users.filter(u =>
    `${u.firstName} ${u.lastName} ${u.email} ${u.phone}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', margin: 0 }}>👥 Utilisateurs</h1>
        <p style={{ color: '#6b7280', marginTop: 4 }}>{users.length} utilisateur(s) enregistré(s)</p>
      </div>

      <div style={{ display: 'flex', gap: 20, minHeight: 'calc(100vh - 200px)' }}>

        {/* ── List column ── */}
        <div style={{ width: 320, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Nom, email, téléphone..."
            style={{ padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none' }}
          />

          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>Chargement...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>Aucun résultat</div>
          ) : (
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filtered.map(user => (
                <div
                  key={user._id}
                  onClick={() => handleSelect(user)}
                  style={{
                    background: selected?._id === user._id ? '#eff6ff' : '#fff',
                    border: `1.5px solid ${selected?._id === user._id ? '#1a56db' : '#e5e7eb'}`,
                    borderRadius: 12, padding: '12px 14px', cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: '#111827', fontSize: 14 }}>
                        {user.firstName} {user.lastName}
                      </div>
                      <div style={{ color: '#6b7280', fontSize: 12, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.email}
                      </div>
                      {user.phone && (
                        <div style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>
                          📱 {user.countryCode} {user.phone}
                        </div>
                      )}
                    </div>
                    <span style={{
                      background: user.isActive ? '#d1fae5' : '#fee2e2',
                      color: user.isActive ? '#065f46' : '#991b1b',
                      padding: '3px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700, marginLeft: 8, whiteSpace: 'nowrap',
                    }}>
                      {user.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Detail column ── */}
        <div style={{ flex: 1, backgroundColor: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', overflowY: 'auto', minWidth: 0 }}>
          {!selected ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af', padding: 40 }}>
              <div style={{ fontSize: 60 }}>👤</div>
              <div style={{ marginTop: 12, fontSize: 15 }}>Cliquez sur un utilisateur pour voir ses détails</div>
            </div>
          ) : (
            <div style={{ padding: 28 }}>

              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h2 style={{ fontSize: 24, fontWeight: 800, color: '#111827', margin: 0 }}>
                    {selected.firstName} {selected.lastName}
                  </h2>
                  <p style={{ color: '#6b7280', marginTop: 4, fontSize: 14 }}>
                    Membre depuis le {new Date(selected.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                  {/* Stats rapides */}
                  <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
                    <span style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                      📋 {detail?.rentals?.length || 0} location(s)
                    </span>
                    <span style={{ background: '#ede9fe', color: '#5b21b6', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                      💰 {DZD(totalSpent)} dépensé
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => handleToggle(selected._id)}
                    style={{ padding: '8px 16px', background: selected.isActive ? '#fee2e2' : '#d1fae5', color: selected.isActive ? '#991b1b' : '#065f46', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}
                  >
                    {selected.isActive ? '🚫 Désactiver' : '✅ Activer'}
                  </button>
                </div>
              </div>

              {/* Coordonnées */}
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#374151', marginBottom: 12 }}>📇 Coordonnées</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, marginBottom: 24 }}>
                <InfoCard icon="✉️" label="Email"        value={selected.email} />
                <InfoCard icon="📱" label="Téléphone"    value={selected.phone ? `${selected.countryCode || ''} ${selected.phone}` : null} />
                <InfoCard icon="💬" label="WhatsApp"     value={selected.whatsapp || null} />
                <InfoCard icon="🏠" label="Adresse"      value={selected.address || null} />
                <InfoCard icon="🪪" label="N° Permis"    value={selected.licenseNumber || null} />
                <InfoCard icon="🔑" label="Rôle"         value={selected.role === 'admin' ? '👑 Administrateur' : '👤 Client'} />
              </div>

              {/* Photo permis */}
              {selected.licenseImage && selected.licenseImage !== '[supprimé]' && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#374151', marginBottom: 12 }}>🪪 Photo du permis</h3>
                  <a href={selected.licenseImage} target="_blank" rel="noreferrer">
                    <img src={selected.licenseImage} alt="Permis"
                      style={{ maxWidth: 280, borderRadius: 10, border: '1px solid #e5e7eb', display: 'block' }} />
                  </a>
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 6 }}>Cliquer pour agrandir</div>
                </div>
              )}

              {/* Historique locations */}
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#374151', marginBottom: 12 }}>
                📋 Historique des locations ({detail?.rentals?.length || 0})
              </h3>

              {loadingDetail ? (
                <div style={{ color: '#6b7280', padding: 20, textAlign: 'center' }}>Chargement...</div>
              ) : !detail?.rentals?.length ? (
                <div style={{ color: '#9ca3af', fontSize: 14, fontStyle: 'italic' }}>Aucune location enregistrée.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {detail.rentals.map(rental => {
                    const cfg = STATUS_STYLE[rental.status] || STATUS_STYLE.en_attente;
                    return (
                      <div key={rental._id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#fafafa' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>
                              🚗 {rental.car?.brand} {rental.car?.model} ({rental.car?.year})
                            </div>
                            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                              {RENTAL_TYPE_LABELS[rental.rentalType] || '—'}
                            </div>
                          </div>
                          <span style={{ background: cfg.bg, color: cfg.text, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                            {cfg.label}
                          </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: 8, fontSize: 13 }}>
                          <div>
                            <span style={{ color: '#6b7280' }}>📅 Départ</span><br />
                            <strong>{fmtDateTime(rental.startDate)}</strong>
                          </div>
                          <div>
                            <span style={{ color: '#6b7280' }}>📅 Retour</span><br />
                            <strong>{fmtDateTime(rental.endDate)}</strong>
                          </div>
                          <div>
                            <span style={{ color: '#6b7280' }}>⏱ Durée réelle</span><br />
                            <strong>{rental.duration || `${rental.totalDays} j`}</strong>
                          </div>
                          <div>
                            <span style={{ color: '#6b7280' }}>📋 Jours facturés</span><br />
                            <strong>{rental.totalDays} j</strong>
                          </div>
                          <div>
                            <span style={{ color: '#6b7280' }}>🏁 Prise en charge</span><br />
                            <strong>{rental.pickupLocation || '—'}</strong>
                          </div>
                          <div>
                            <span style={{ color: '#6b7280' }}>🏴 Retour</span><br />
                            <strong>{rental.returnLocation || '—'}</strong>
                          </div>
                          {rental.licenseNumber && (
                            <div>
                              <span style={{ color: '#6b7280' }}>🪪 N° Permis</span><br />
                              <strong>{rental.licenseNumber}</strong>
                            </div>
                          )}
                        </div>

                        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                          <div style={{ fontWeight: 800, color: '#1a56db', fontSize: 16 }}>
                            {DZD(rental.totalPrice)}
                          </div>
                          {rental.licenseImage && rental.licenseImage !== '[supprimé]' && (
                            <a href={rental.licenseImage} target="_blank" rel="noreferrer"
                              style={{ fontSize: 12, color: '#1a56db', fontWeight: 600 }}>
                              🪪 Voir le permis →
                            </a>
                          )}
                        </div>
                        {rental.adminNote && (
                          <div style={{ marginTop: 8, background: '#fef9c3', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#854d0e' }}>
                            📝 Note admin : {rental.adminNote}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
