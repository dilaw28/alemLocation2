import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { carsAPI } from '../services/api';
import useCarSuggestions from '../hooks/useCarSuggestions';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CarCard from '../components/car/CarCard';
import SearchAutocomplete from '../components/SearchAutocomplete';

const CATEGORIES = ['Tous', 'Économique', 'Berline', 'SUV', 'Luxe', 'Utilitaire', 'Électrique'];

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

export default function CarsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const suggestions = useCarSuggestions();
  const [cars, setCars]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState('Tous');

  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate]     = useState(searchParams.get('endDate') || '');

  const requestId = useRef(0);

  useEffect(() => {
    const currentId = ++requestId.current;
    const timer = setTimeout(() => {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (category !== 'Tous') params.category = category;
      if (startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }

      carsAPI.getAll(params)
        .then(({ data }) => {
          if (currentId === requestId.current) setCars(data.cars);
        })
        .finally(() => {
          if (currentId === requestId.current) setLoading(false);
        });
    }, 350);

    return () => clearTimeout(timer);
  }, [search, category, startDate, endDate]);

  const clearDates = () => {
    setStartDate('');
    setEndDate('');
    const next = new URLSearchParams(searchParams);
    next.delete('startDate');
    next.delete('endDate');
    setSearchParams(next);
  };

  const resultLabel = useMemo(
    () => (loading ? 'Recherche en cours...' : `${cars.length} véhicule(s) trouvé(s)`),
    [loading, cars.length]
  );

  const hasDateFilter = startDate && endDate;

  return (
    <>
      <Navbar />

      <div style={{ background: 'linear-gradient(180deg, #F8FAFC 0%, #fff 100%)', borderBottom: '1px solid #e5e7eb', padding: '24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <span style={{ display: 'block', color: 'var(--color-accent)', fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
            Catalogue
          </span>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 16, color: 'var(--color-foreground)' }}>Nos véhicules</h1>

          {hasDateFilter && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '10px 14px', marginBottom: 14, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: '#1e40af', fontWeight: 600 }}>
                📅 Disponibilité du {fmtDate(startDate)} au {fmtDate(endDate)}
              </span>
              <button
                onClick={clearDates}
                style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
              >
                ✕ Retirer le filtre de dates
              </button>
            </div>
          )}

          {/* Search bar avec autocomplétion */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <SearchAutocomplete
                value={search}
                onChange={setSearch}
                suggestions={suggestions}
                placeholder="Rechercher par marque ou modèle..."
              />
            </div>
            {search && (
              <button onClick={() => setSearch('')} style={{ padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: 10, background: '#fff', cursor: 'pointer', fontWeight: 600, color: '#6b7280' }}>
                ✕ Effacer
              </button>
            )}
          </div>

          {/* Category chips */}
          <div className="chips" style={{ marginBottom: 10 }}>
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

          <p style={{ color: '#6b7280', fontSize: 13 }}>{resultLabel}</p>
        </div>
      </div>

      <div className="section" style={{ paddingTop: 24 }}>
        {loading ? (
          <div className="spinner" />
        ) : cars.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔍</div>
            <h3>Aucun véhicule trouvé</h3>
            <p>{hasDateFilter ? "Aucun véhicule disponible sur cette période. Essayez d'autres dates." : "Essayez d'autres critères de recherche"}</p>
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
