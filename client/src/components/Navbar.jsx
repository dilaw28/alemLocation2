import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logob from "../assets/Logob.png";

const NAV_LINKS = [
  { to: "/", label: "Accueil" },
  { to: "/cars", label: "Voitures" },
  { to: "/faq", label: "FAQ" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  const linkStyle = ({ isActive }) => ({
    display: "flex", alignItems: "center", padding: "8px 14px", borderRadius: 8,
    fontSize: 14, fontWeight: isActive ? 700 : 500,
    color: isActive ? "#fff" : "#475569",
    background: isActive ? "var(--color-primary)" : "transparent",
    transition: "background 0.15s, color 0.15s",
  });

  return (
    <nav
      className="navbar"
      style={{
        position: "sticky", top: 0, zIndex: 100,
        backgroundColor: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
        height: 76,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}
    >
      <Link to="/" className="navbar-logo" style={{ display: "flex", alignItems: "center" }}>
        <img src={Logob} alt="ALem Location" style={{ height: 60, width: "auto" }} />
      </Link>

      <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
        <svg width="24" height="24" fill="none" stroke="#374151" strokeWidth="2">
          {open ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      <div className={`navbar-links ${open ? "open" : ""}`}>
        {NAV_LINKS.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.to === "/"} style={linkStyle} onClick={() => setOpen(false)}>
            {link.label}
          </NavLink>
        ))}

        {user ? (
          <>
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "6px 14px 6px 6px",
                borderRadius: 30, background: "#f1f5f9", marginLeft: 8,
              }}
            >
              <span style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700,
              }}>
                {user.firstName?.[0]?.toUpperCase()}
              </span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{user.firstName}</span>
            </Link>
            <button
              className="navbar-link"
              onClick={handleLogout}
              style={{ marginLeft: 4, padding: "8px 14px", fontSize: 14, color: "#94a3b8", background: "none", border: "none", cursor: "pointer" }}
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link" onClick={() => setOpen(false)} style={{ padding: "8px 14px", fontSize: 14, color: "#475569" }}>
              Connexion
            </Link>
            <Link to="/register" className="btn-primary" onClick={() => setOpen(false)} style={{ marginLeft: 6 }}>
              S'inscrire
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
