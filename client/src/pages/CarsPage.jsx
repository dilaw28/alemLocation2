import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { carsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CATEGORIES = ['Tous', 'Économique', 'Berline', 'SUV', 'Luxe', 'Utilitaire', 'Électrique'];

function CarCard({ car }) {
  const DZD = (n) => new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD', maximumFractionDigits: 0 }).format(n);
  return (
    <Link to={`/cars/${car._id}`} className="car-card">
      <div className="car-card-img">
        {car.images?.[0]
          ? <img src={car.images[0]} alt={`${car.brand} ${car.model}`} />
          : '🚗'}
      </div>
      <div className="car-card-body">
        <div className="car-card-header">
          <span className="car-card-name">{car.brand} {car.model}</span>
          <span className={`badge ${car.isAvailable ? 'badge-green' : 'badge-red'}`}>
            {car.isAvailable ? 'Disponible' : 'Indisponible'}
          </span>
        </div>
        <p className="car-card-meta">{car.year} · {car.category} · {car.transmission} · {car.fuel}</p>
        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>
          💺 {car.seats} places &nbsp;·&nbsp; 📍 {car.location}
        </p>
        <div className="car-card-footer">
          <span className="car-price">{DZD(car.pricePerDay)} <span>/jour</span></span>
          <span className="btn-primary" style={{ padding: '7px 14px', fontSize: 13 }}>Voir</span>
        </div>
      </div>
    </Link>
  );
}

export default function CarsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState('Tous');

  const fetchCars = useCallback(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category !== 'Tous') params.category = category;
    carsAPI.getAll(params)
      .then(({ data }) => setCars(data.cars))
      .finally(() => setLoading(false));
  }, [search, category]);

  useEffect(() => {
    const timer = setTimeout(fetchCars, 350);
    return () => clearTimeout(timer);
  }, [fetchCars]);

  return (
    <>
      <Navbar />

      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 20 }}> Nos véhicules</h1>

          {/* Search bar */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>🔍</span>
              <input
                type="text"
                placeholder="Rechercher par marque ou modèle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', padding: '12px 14px 12px 44px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 15, outline: 'none' }}
              />
            </div>
            {search && (
              <button onClick={() => setSearch('')} style={{ padding: '12px 16px', border: '1px solid #e5e7eb', borderRadius: 10, background: '#fff', cursor: 'pointer', fontWeight: 600, color: '#6b7280' }}>
                ✕ Effacer
              </button>
            )}
          </div>

          {/* Category chips */}
          <div className="chips">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`chip ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <p style={{ color: '#6b7280', fontSize: 14 }}>
            {loading ? 'Recherche en cours...' : `${cars.length} véhicule(s) trouvé(s)`}
          </p>
        </div>
      </div>

      <div className="section">
        {loading ? (
          <div className="spinner" />
        ) : cars.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔍</div>
            <h3>Aucun véhicule trouvé</h3>
            <p>Essayez d'autres critères de recherche</p>
          </div>
        ) : (
          <div className="cars-grid">
            {cars.map((car) => <CarCard key={car._id} car={car} />)}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
