import React, { useState, useEffect } from 'react';
import { availabilityAPI } from '../services/api';
import CarFleetCard from '../components/availability/CarFleetCard';
import CarDetailView from '../components/availability/CarDetailView';

export default function Availability() {
  const [cars, setCars]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all');
  const [search, setSearch]     = useState('');
  const [selectedCar, setSelectedCar] = useState(null);

  const load = () => {
    setLoading(true);
    availabilityAPI.getOverview()
      .then(({ data }) => setCars(data.cars))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleToggle = async (car) => {
    const reason = car.isAvailable ? window.prompt("Raison de l'indisponibilité ?", 'Maintenance') : null;
    if (car.isAvailable && reason === null) return; // cancelled
    try {
      await availabilityAPI.toggle(car._id, reason);
      load();
    } catch {
      alert('Erreur lors du changement de statut.');
    }
  };

  const filtered = cars.filter(c => {
    if (filter !== 'all' && c.status !== filter) return false;
    if (search && !`${c.brand} ${c.model}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all:        cars.length,
    disponible: cars.filter(c => c.status === 'disponible').length,
    louée:      cars.filter(c => c.status === 'louée').length,
    bloquée:    cars.filter(c => c.status === 'bloquée').length,
  };

  if (selectedCar) {
    const fresh = cars.find(c => c._id === selectedCar._id) || selectedCar;
    return <CarDetailView car={fresh} onBack={() => setSelectedCar(null)} onRefresh={load} />;
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', margin: 0 }}>📅 Disponibilité du parc</h1>
        <p style={{ color: '#6b7280', marginTop: 4 }}>Gérez les disponibilités, réservations et blocages de chaque véhicule</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {[
          { key: 'all',        label: '🚗 Tous' },
          { key: 'disponible', label: '✅ Disponibles' },
          { key: 'louée',      label: '🚗 Louées' },
          { key: 'bloquée',    label: '🔧 Bloquées' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '8px 16px', borderRadius: 20, border: `1.5px solid ${filter === f.key ? '#1a56db' : '#e5e7eb'}`,
              background: filter === f.key ? '#1a56db' : '#fff', color: filter === f.key ? '#fff' : '#6b7280',
              fontWeight: 700, fontSize: 13, cursor: 'pointer',
            }}
          >
            {f.label} ({counts[f.key]})
          </button>
        ))}
      </div>

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="🔍 Rechercher une voiture..."
        style={{ width: '100%', padding: '12px 16px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, boxSizing: 'border-box', marginBottom: 20 }}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>Chargement...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>
          <div style={{ fontSize: 48 }}>🔍</div>
          <div style={{ marginTop: 12 }}>Aucun véhicule trouvé</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {filtered.map(car => (
            <CarFleetCard key={car._id} car={car} onSelect={setSelectedCar} onToggle={handleToggle} />
          ))}
        </div>
      )}
    </div>
  );
}
