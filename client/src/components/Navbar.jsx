import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Logob from "../assets/Logob.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  return (
    <nav
      className="navbar"
      style={{
        position: "relative",
        backgroundColor: "#f3f5f9",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        height: "80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
      }}
    >
      <Link to="/" className="navbar-logo">
        <img src={Logob} alt="ALem Location" style={{ height: 90, width:  200 }} />
      </Link>

      <button
        className="hamburger"
        onClick={() => setOpen(!open)}
        aria-label="Menu"
      >
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="#374151"
          strokeWidth="2"
        >
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
                <Link
          to="/"
          className="navbar-link"
          onClick={() => setOpen(false)}
        >
          Accueil
        </Link>
        <Link
          to="/cars"
          className="navbar-link"
          onClick={() => setOpen(false)}
        >
          Voitures
        </Link>

        <Link
          to="/faq"
          className="navbar-link"
          onClick={() => setOpen(false)}
        >
          FAQ
        </Link>

        {user ? (
          <>
            <Link
              to="/profile"
              className="navbar-link"
              onClick={() => setOpen(false)}
            >
              {user.firstName}
            </Link>

            <button className="navbar-link" onClick={handleLogout}>
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="navbar-link"
              onClick={() => setOpen(false)}
            >
              Connexion
            </Link>

            <Link
              to="/register"
              className="btn-primary"
              onClick={() => setOpen(false)}
            >
              S'inscrire
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}