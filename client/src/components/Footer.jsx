import React from "react";
import { Link } from "react-router-dom";

import Logon from "../assets/Logon.png";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div>
            <img
              src={Logon}
              alt="ALem Location Logo"
              className="footer-logo"
              style={{ height: 180, width: 200 }}
            />
            <p className="footer-tagline">
              La location de voiture simple, transparente et fiable partout en
              Algérie.
            </p>
          </div>
          <div className="footer-col">
            <h4>Navigation</h4>
            <Link to="/">Accueil</Link>
            <Link to="/cars">Nos voitures</Link>
            <Link to="/profile">Mon compte</Link>
          </div>
          <div className="footer-col">
            <h4>Légal</h4>
            <a href="/conditions-generales">Conditions générales</a>
            <a href="/politique-de-confidentialite">
              Politique de confidentialité
            </a>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <a href="mailto:contact@autoloc.fr">contact@autoloc.fr</a>
            <a href="tel:+213781257070">+213781257070</a>
            <a href="tel:+213550203914">+213550203914</a>
            <a href="https://www.google.com/maps/place/Agence+de+location+de+v%C3%A9hicules+ALEM/@36.5356665,3.8363936,17.69z/data=!4m8!3m7!1s0x128c2d58c1e78603:0x11d4b834078c5e55!8m2!3d36.535475!4d3.8372069!9m1!1b1!16s%2Fg%2F11v4v6h7m3?entry=ttu&g_ep=EgoyMDI2MDYyMi4wIKXMDSoASAFQAw%3D%3D">
              Adresse : cité de l'indépendance Draa El Mizan
            </a>
            <a href="/faq">Aide & FAQ</a>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} Alem Cars. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
