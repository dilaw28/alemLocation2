import React from "react";

export default function CarInfo({ car }) {
  return (
    <>
      <div style={{ marginTop: 28 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <h1 style={{ fontSize: 30, fontWeight: 800 }}>
            {car.brand} {car.model} ({car.year})
          </h1>
          <span
            className={`badge ${car.isAvailable ? "badge-green" : "badge-red"}`}
            style={{ fontSize: 13, padding: "6px 14px" }}
          >
            {car.isAvailable ? "✓ Disponible" : "✗ Indisponible"}
          </span>
        </div>
      </div>

      <div className="specs-grid">
        {[
          { icon: "🏷️", label: "Catégorie", value: car.category },
          { icon: "⚙️", label: "Transmission", value: car.transmission },
          { icon: "⛽", label: "Carburant", value: car.fuel },
          { icon: "💺", label: "Places", value: `${car.seats} places` },
        ].map((s, i) => (
          <div key={i} className="spec-card">
            <div className="spec-icon">{s.icon}</div>
            <div className="spec-value">{s.value}</div>
            <div className="spec-label">{s.label}</div>
          </div>
        ))}
      </div>

      {car.description && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 10 }}>
            Description
          </h3>
          <p style={{ color: "#4b5563", lineHeight: 1.7, fontSize: 15 }}>
            {car.description}
          </p>
        </div>
      )}

      {car.features?.length > 0 && (
        <div>
          <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>
            Équipements
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))",
              gap: 8,
            }}
          >
            {car.features.map((f, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 14,
                  color: "#374151",
                }}
              >
                <span style={{ color: "#1a56db", fontWeight: 700 }}>✓</span> {f}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
