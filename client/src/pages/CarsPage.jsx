import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { carsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CarCard from '../components/car/CarCard';

const CATEGORIES = ['Tous', 'Économique', 'Berline', 'SUV', 'Luxe', 'Utilitaire', 'Électrique'];

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

export default function CarsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState('Tous');

  // Dates transmises depuis la recherche du Hero (page d'accueil) — on les
  // garde en état local pour pouvoir les effacer sans perdre les autres filtres.
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate]     = useState(searchParams.get('endDate') || '');

  // Empêche une requête "lente" de venir écraser le résultat d'une requête
  // plus récente lancée juste après (course de résultats si la personne
  // tape vite ou change de catégorie plusieurs fois de suite).
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
          if (currentId === requestId.current) setCars(data.cars); // ignore les réponses obsolètes
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


  const hasDateFilter = startDate && endDate;

  return (
    <>
      <Navbar />

      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '18px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 14 }}>Nos véhicules</h1>

          {/* Bandeau période sélectionnée */}
          {hasDateFilter && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '10px 14px', marginBottom: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: '#1e40af', fontWeight: 600 }}>
                📅 Disponibilité du {fmtDate(startDate)} au {fmtDate(endDate)}
              </span>
              <button
                onClick={clearDates}
                style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#1a56db', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
              >
                ✕ Retirer le filtre de dates
              </button>
            </div>
          )}

          {/* Search bar */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>🔍</span>
              <input
                type="text"
                placeholder="Rechercher par marque ou modèle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', padding: '10px 14px 10px 44px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 15, outline: 'none' }}
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

         
        </div>
      </div>

      <div className="section" style={{ paddingTop: 24 }}>
        {loading ? (
          <div className="spinner" />
        ) : cars.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔍</div>
            <h3>Aucun véhicule trouvé</h3>
            <p>{hasDateFilter ? 'Aucun véhicule disponible sur cette période. Essayez d\'autres dates.' : "Essayez d'autres critères de recherche"}</p>
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
