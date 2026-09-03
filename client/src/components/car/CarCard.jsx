import React from 'react';
import { Link } from 'react-router-dom';
import { DZD } from '../../utils/format';


function CarCard({ car, compact = false, onClick }) {
  return (
    <Link to={`/cars/${car._id}`} className="car-card" onClick={onClick}>
      <div className="car-card-img">
        {car.images?.[0] ? (
          <img
            src={car.images[0]}
            alt={`${car.brand} ${car.model}`}
            loading="lazy"
            decoding="async"
          />
        ) : '🚗'}
      </div>
      <div className="car-card-body">
        <div className="car-card-header">
          <span className="car-card-name">{car.brand} {car.model}</span>
          <span className={`badge ${car.isAvailable ? 'badge-green' : 'badge-red'}`}>
            {car.isAvailable ? 'Disponible' : 'Indisponible'}
          </span>
        </div>
        <p className="car-card-meta">
          {car.year} · {car.category}
          {!compact && ` · ${car.transmission} · ${car.fuel}`}
        </p>
        {!compact && (
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>
            💺 {car.seats} places &nbsp;·&nbsp; 📍 {car.location}
          </p>
        )}
        <div className="car-card-footer">
          <span className="car-price">{DZD(car.pricePerDay)} <span>/jour</span></span>
          
        </div>
      </div>
    </Link>
  );
}

export default React.memo(CarCard);
