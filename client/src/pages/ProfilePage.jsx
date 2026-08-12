import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { rentalsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProfileForm from '../components/profile/ProfileForm';
import RentalCard from '../components/profile/RentalCard';

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const { showAlert, showSuccess } = useAlert();
  const navigate = useNavigate();
  const [tab, setTab] = useState('profile');
  const [rentals, setRentals] = useState([]);
  const [loadingRentals, setLoadingRentals] = useState(false);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user]);

  useEffect(() => {
    if (tab !== 'profile') {
      setLoadingRentals(true);
      rentalsAPI.getMy()
        .then(({ data }) => setRentals(data.rentals))
        .finally(() => setLoadingRentals(false));
    }
  }, [tab]);

  const handleCancel = async (id) => {
    const rental = rentals.find(r => r._id === id);
    const msg = rental?.status === 'en_attente'
      ? 'Annuler cette demande de location ?'
      : 'Annuler cette réservation confirmée ? Le véhicule redeviendra disponible.';
    if (!window.confirm(msg)) return;
    try {
      await rentalsAPI.cancel(id);
      setRentals(prev => prev.map(r => r._id === id ? { ...r, status: 'annulée' } : r));
      showSuccess('Votre réservation a bien été annulée.');
    } catch (err) {
      showAlert(err.response?.data?.message || "Impossible d'annuler cette réservation.", { type: 'error', title: 'Annulation impossible' });
    }
  };

  const activeRentals = rentals.filter(r => ['en_attente', 'approuvée', 'en_cours'].includes(r.status));
  const history       = rentals.filter(r => ['terminée', 'annulée', 'refusée'].includes(r.status));

  if (!user) return null;

  return (
    <>
      <Navbar />

      <div className="container" style={{ padding: '32px 24px 64px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #1a56db, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#fff', fontWeight: 800 }}>
              {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', margin: 0 }}>
                {user.firstName} {user.lastName}
              </h1>
              <p style={{ color: '#6b7280', fontSize: 14, marginTop: 2 }}>{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/'); }}
            style={{ padding: '9px 18px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}
          >
            Déconnexion
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, background: '#f3f4f6', borderRadius: 12, padding: 4, marginBottom: 28, width: 'fit-content' }}>
          {[
            { key: 'profile', label: '👤 Mon profil' },
            { key: 'active',  label: `🚗 En cours ${activeRentals.length > 0 ? `(${activeRentals.length})` : ''}` },
            { key: 'history', label: '📋 Historique' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: '10px 18px',
                border: 'none',
                borderRadius: 9,
                background: tab === t.key ? '#fff' : 'none',
                color: tab === t.key ? '#1a56db' : '#6b7280',
                fontWeight: tab === t.key ? 700 : 500,
                fontSize: 14,
                cursor: 'pointer',
                boxShadow: tab === t.key ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Profile tab */}
        {tab === 'profile' && (
          <div style={{ maxWidth: 580 }}>
            <ProfileForm user={user} onSaved={updateUser} />
          </div>
        )}

        {/* Active tab */}
        {tab === 'active' && (
          <div style={{ maxWidth: 720 }}>
            <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 20, color: '#111827' }}>
              Locations en cours ({activeRentals.length})
            </h2>
            {loadingRentals ? (
              <div className="spinner" />
            ) : activeRentals.length === 0 ? (
              <div className="empty-state">
                <div className="icon">🚗</div>
                <h3>Aucune location en cours</h3>
                <p style={{ marginBottom: 20 }}>Réservez votre première voiture dès maintenant</p>
                <Link to="/cars" className="btn-primary">Voir les voitures</Link>
              </div>
            ) : (
              activeRentals.map(r => <RentalCard key={r._id} rental={r} onCancel={handleCancel} />)
            )}
          </div>
        )}

        {/* History tab */}
        {tab === 'history' && (
          <div style={{ maxWidth: 720 }}>
            <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 20, color: '#111827' }}>
              Historique ({history.length})
            </h2>
            {loadingRentals ? (
              <div className="spinner" />
            ) : history.length === 0 ? (
              <div className="empty-state">
                <div className="icon">📋</div>
                <h3>Aucun historique</h3>
                <p>Vos anciennes locations apparaîtront ici</p>
              </div>
            ) : (
              history.map(r => <RentalCard key={r._id} rental={r} onCancel={handleCancel} />)
            )}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
