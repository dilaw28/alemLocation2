import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { carsAPI } from '../../services/api';
import CarCard from '../car/CarCard';

export default function SuggestedCars({ currentCarId }) {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    carsAPI.getAll({ available: 'true' })
      .then(({ data }) => {
        setCars(data.cars.filter(c => c._id !== currentCarId).slice(0, 4));
      })
      .catch(() => {});
  }, [currentCarId]);

  if (!cars.length) return null;

  return (
    <div style={{ marginTop: 32 }}>
      <h3 style={{ fontSize: 18, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
        🚗 Autres voitures disponibles
      </h3>
      <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 16 }}>
        Ces véhicules sont disponibles à la réservation dès maintenant.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
        {cars.map(car => <CarCard key={car._id} car={car} compact />)}
      </div>
    </div>
  );
}
