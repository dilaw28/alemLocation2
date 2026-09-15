import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { carsAPI } from "../services/api";
import useCarSuggestions from "../hooks/useCarSuggestions";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CarCard from "../components/car/CarCard";
import SearchAutocomplete from "../components/SearchAutocomplete";
import heroBack from "../assets/heroBack.png";

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

const STATS = [
  { value: "+dizaine", label: "Véhicules" },

  { value: "24/7", label: "Assistance" },

  { value: "Livraison gratuite", label: "Aéroport" },
];

const todayISO = () => new Date().toISOString().split("T")[0];

export default function HomePage() {
  const navigate = useNavigate();
  const suggestions = useCarSuggestions();
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
    e?.preventDefault();
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
          backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.55) 0%, rgba(15,23,42,0.75) 100%), url(${heroBack})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "90vh",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 30,
            padding: "6px 16px",
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 20,
            color: "#fff",
          }}
        >
          🇩🇿 La location de voiture depuis chez vous
        </span>

        <h1>
          Trouvez votre
          <br />
          voiture idéale
        </h1>
        <p>
          Location simple, rapide et fiable partout en Algérie. Choisissez parmi
          une dizaine de véhicules.
        </p>

        <form className="search-card" onSubmit={handleSearch}>
          <div className="search-field">
            <label>🔍 Marque / Modèle</label>
            <SearchAutocomplete
              value={search}
              onChange={setSearch}
              onSubmit={handleSearch}
              suggestions={suggestions}
              placeholder="Ex: Renault Clio..."
              icon=""
              inputStyle={{
                padding: "12px 14px",
                border: "1.5px solid #e5e7eb",
              }}
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

        {/* Bandeau de statistiques */}
        <div
          style={{
            display: "flex",
            gap: 36,
            marginTop: 40,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: "center", color: "#fff" }}>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  fontFamily: "var(--font-heading)",
                }}
              >
                {s.value}
              </div>
              <div
                style={{ fontSize: 12, opacity: 0.8, letterSpacing: "0.03em" }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section style={{ background: "#fff", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <span
            style={{
              display: "block",
              textAlign: "center",
              color: "var(--color-accent)",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Pourquoi nous choisir
          </span>
          <h2
            className="section-title"
            style={{ marginBottom: 8, textAlign: "center" }}
          >
            Une expérience de location repensée
          </h2>
          <p
            style={{ textAlign: "center", color: "#6b7280", marginBottom: 48 }}
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
            <span
              style={{
                display: "block",
                color: "var(--color-accent)",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Sélection du moment
            </span>
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
            Voir plus de voitures
          </Link>
        </div>
      </div>

      {/* CTA Banner */}
      <section
        style={{
          background: "linear-gradient(135deg, #1E293B, #0F172A)",
          padding: "72px 24px",
          textAlign: "center",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "rgba(220,38,38,0.15)",
          }}
        />
        <h2
          style={{
            fontSize: "clamp(24px, 4vw, 36px)",
            fontWeight: 800,
            marginBottom: 14,
            position: "relative",
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
            position: "relative",
          }}
        >
          Créez votre compte gratuitement et réservez votre première voiture en
          quelques minutes.
        </p>
        <Link
          to="/register"
          className="btn-primary"
          style={{
            padding: "14px 36px",
            fontSize: 16,
            position: "relative",
            display: "inline-flex",
          }}
        >
          Commencer maintenant
        </Link>
      </section>

      <Footer />
    </>
  );
}
