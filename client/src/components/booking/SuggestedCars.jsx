import React, { useEffect, useState } from 'react';
import { carsAPI } from '../../services/api';
import CarCard from '../car/CarCard';

export default function SuggestedCars({ currentCarId, startDate, endDate }) {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const params = { available: 'true' };
    // Si des dates sont déjà choisies dans le formulaire, les suggestions
    // ne montrent que des voitures réellement libres sur la même période.
    if (startDate && endDate) {
      params.startDate = startDate;
      params.endDate = endDate;
    }

    carsAPI.getAll(params)
      .then(({ data }) => {
        setCars(data.cars.filter(c => c._id !== currentCarId).slice(0, 4));
      })
      .catch(() => {});
  }, [currentCarId, startDate, endDate]);

  if (!cars.length) return null;

  return (
    <div style={{ marginTop: 32 }}>
      <h3 style={{ fontSize: 18, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
        🚗 Autres voitures disponibles
      </h3>
      <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 16 }}>
        {startDate && endDate
          ? 'Ces véhicules sont libres sur la même période.'
          : 'Ces véhicules sont disponibles à la réservation dès maintenant.'}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
        {cars.map(car => <CarCard key={car._id} car={car} compact />)}
      </div>
    </div>
  );
}
