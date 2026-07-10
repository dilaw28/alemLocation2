import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import PriceTiersPanel from '../components/dashboard/PriceTiersPanel';
import PricingPanel from '../components/dashboard/PricingPanel';
import LocationsPanel from '../components/dashboard/LocationsPanel';
import LicensePurgePanel from '../components/dashboard/LicensePurgePanel';

const STAT_CARDS = [
  { key: 'totalUsers',    label: 'Utilisateurs',       icon: '👥', color: '#dbeafe', text: '#1e40af' },
  { key: 'totalCars',     label: 'Véhicules',          icon: '🚗', color: '#d1fae5', text: '#065f46' },
  { key: 'totalRentals',  label: 'Locations totales',  icon: '📋', color: '#fef3c7', text: '#92400e' },
  { key: 'pendingRentals',label: 'En attente',         icon: '⏳', color: '#fee2e2', text: '#991b1b' },
  { key: 'totalRevenue',  label: 'Revenus (DZD)',      icon: '💰', color: '#ede9fe', text: '#5b21b6' },
];

export default function Dashboard() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard()
      .then(({ data }) => setStats(data.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', margin: 0 }}>Tableau de bord</h1>
        <p style={{ color: '#6b7280', marginTop: 4 }}>Vue d'ensemble de l'activité AutoLoc</p>
      </div>

      {/* Stats */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>Chargement...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 36 }}>
          {STAT_CARDS.map((c) => (
            <div key={c.key} style={{ background: c.color, borderRadius: 14, padding: '20px 22px' }}>
              <div style={{ fontSize: 32, marginBottom: 6 }}>{c.icon}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: c.text }}>
                {c.key === 'totalRevenue'
                  ? `${(stats?.[c.key] || 0).toLocaleString('fr-DZ')} DZD`
                  : (stats?.[c.key] || 0)}
              </div>
              <div style={{ color: c.text, fontWeight: 600, fontSize: 13, marginTop: 2 }}>{c.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 36 }}>
        {[
          { icon: '⏳', title: 'Demandes en attente', desc: 'Approuver ou refuser les demandes', link: '/requests' },
          { icon: '🚗', title: 'Gérer les voitures',  desc: 'Ajouter, modifier ou supprimer',   link: '/cars' },
          { icon: '👥', title: 'Utilisateurs',         desc: 'Consulter les profils clients',     link: '/users' },
        ].map((item, i) => (
          <a key={i} href={item.link} style={{ background: '#f9fafb', borderRadius: 12, padding: 18, textDecoration: 'none', border: '1px solid #e5e7eb', display: 'block', transition: 'box-shadow 0.15s' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
            <div style={{ fontWeight: 700, color: '#111827', marginBottom: 4, fontSize: 14 }}>{item.title}</div>
            <div style={{ color: '#6b7280', fontSize: 13 }}>{item.desc}</div>
          </a>
        ))}
      </div>

      {/* Panels grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
        <PricingPanel />
        <PriceTiersPanel />
        <LocationsPanel />
        <LicensePurgePanel />
      </div>
    </div>
  );
}
