import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { carsAPI } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CarCard from "../components/car/CarCard";
import heroBack from "../assets/heroBack.png";

// Statique : aucune dépendance à props/state → hors du composant pour
// éviter de recréer ce tableau à chaque rendu.
const FEATURES = [
  {
    icon: "✅",
    title: "Réservation simple",
    desc: "En quelques clics, sans paperasse inutile.",
  },
  {
    icon: "📞",
    title: "Support 24/7",
    desc: "Notre équipe est disponible à toute heure.",
  },
  {
    icon: "💎",
    title: "Large choix",
    desc: "Économique, SUV, berline ou luxe — à vous de choisir.",
  },
];

const todayISO = () => new Date().toISOString().split("T")[0];

export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carsAPI
      .getFeatured()
      .then(({ data }) => setCars(data.cars))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    navigate(`/cars?${params.toString()}`);
  };

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section
        className="hero"
        style={{
          backgroundImage: `url(${heroBack})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "90vh",
        }}
      >
        <div className="hero-title" style={{color:"red"}}>
          <h1>
            Trouvez votre
            <br />
            voiture idéale
          </h1>
          <p style={{  fontSize: 20 }}>
            Location simple, rapide et fiable partout en Algérie. Choisissez
            parmi des centaines de véhicules.
          </p>
        </div>

        <form className="search-card" onSubmit={handleSearch}>
          <div className="search-field">
            <label>🔍 Marque / Modèle</label>
            <input
              type="text"
              placeholder="Ex: Renault Clio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="search-field">
            <label>📅 Date de départ</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={todayISO()}
            />
          </div>
          <div className="search-field">
            <label>📅 Date de retour</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || todayISO()}
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            style={{ padding: "13px 28px", fontSize: 15, whiteSpace: "nowrap" }}
          >
            Rechercher
          </button>
        </form>
      </section>

      {/* Why us */}
      <section style={{ background: "#fff", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2
            className="section-title"
            style={{ marginBottom: 8, textAlign: "center" }}
          >
            Pourquoi choisir Alem Location ?
          </h2>
          <p
            style={{ textAlign: "center", color: "#6b7280", marginBottom: 40 }}
          >
            Nous rendons la location de voiture simple et transparente
          </p>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured cars */}
      <div className="section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Voitures disponibles</h2>
            <p className="section-subtitle">Nos meilleures offres du moment</p>
          </div>
          <Link to="/cars" className="btn-outline">
            Voir toutes les voitures →
          </Link>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : (
          <div className="cars-grid">
            {cars.map((car) => (
              <CarCard key={car._id} car={car} compact />
            ))}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Link
            to="/cars"
            className="btn-primary"
            style={{ padding: "14px 36px", fontSize: 16 }}
          >
            🚗 Voir plus de voitures
          </Link>
        </div>
      </div>

      {/* CTA Banner */}
      <section
        style={{
          background: "linear-gradient(135deg, #1a56db, #0f3a9e)",
          padding: "64px 24px",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(24px, 4vw, 36px)",
            fontWeight: 800,
            marginBottom: 14,
          }}
        >
          Prêt à prendre la route ?
        </h2>
        <p
          style={{
            opacity: 0.85,
            fontSize: 16,
            marginBottom: 32,
            maxWidth: 480,
            margin: "0 auto 32px",
          }}
        >
          Créez votre compte gratuitement et réservez votre première voiture en
          quelques minutes.
        </p>
        <Link
          to="/register"
          style={{
            background: "#fff",
            color: "#1a56db",
            padding: "14px 36px",
            borderRadius: 10,
            fontWeight: 800,
            fontSize: 16,
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Commencer maintenant
        </Link>
      </section>

      <Footer />
    </>
  );
}
