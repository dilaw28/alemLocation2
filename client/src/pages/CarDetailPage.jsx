import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { carsAPI, locationsAPI, settingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CarGallery from '../components/car/CarGallery';
import CarInfo from '../components/car/CarInfo';
import BookingForm from '../components/booking/BookingForm';
import BookingSuccess from '../components/booking/BookingSuccess';

export default function CarDetailPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [car, setCar]             = useState(null);
  const [loading, setLoading]     = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [locations, setLocations] = useState([]);
  const [surcharges, setSurcharges] = useState({ chauffeur_surcharge: 40, entreprise_surcharge: 0 });
  const [tiers, setTiers]         = useState([]); // free-form tiers from admin, sorted descending

  const [success, setSuccess]     = useState(null); // holds summary data once booked

  useEffect(() => {
    carsAPI.getById(id)
      .then(({ data }) => setCar(data.car))
      .catch(() => navigate('/cars'))
      .finally(() => setLoading(false));

    locationsAPI.getAll().then(({ data }) => setLocations(data.locations)).catch(() => {});

    settingsAPI.getAll().then(({ data }) => {
      setSurcharges(data.settings);
      if (Array.isArray(data.settings.price_tiers)) {
        const sorted = [...data.settings.price_tiers].sort((a, b) => b.days - a.days);
        setTiers(sorted);
      }
    }).catch(() => {});
  }, [id]);

  if (loading) return (
    <><Navbar /><div style={{ padding: 80, textAlign: 'center' }}><div className="spinner" /></div></>
  );
  if (!car) return null;

  if (success) {
    return <BookingSuccess car={car} {...success} />;
  }

  return (
    <>
      <Navbar />

      <div className="container" style={{ padding: '32px 24px' }}>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>
          <Link to="/" style={{ color: '#1a56db' }}>Accueil</Link> ›{' '}
          <Link to="/cars" style={{ color: '#1a56db' }}>Voitures</Link> ›{' '}
          {car.brand} {car.model}
        </p>

        <div className="car-detail-grid">
          {/* Left: car info */}
          <div>
            <CarGallery images={car.images} activeImg={activeImg} onSelect={setActiveImg} />
            <CarInfo car={car} />
          </div>

          {/* Right: booking */}
          <div>
            <BookingForm
              car={car}
              user={user}
              locations={locations}
              surcharges={surcharges}
              tiers={tiers}
              onSuccess={setSuccess}
            />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
