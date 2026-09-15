import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * React Router ne réinitialise jamais le scroll tout seul lors d'une
 * navigation (contrairement à un rechargement de page classique).
 * Ce composant, monté une seule fois dans App.jsx, remonte la fenêtre
 * en haut à chaque changement de route — corrige entre autres le clic
 * sur une voiture suggérée qui restait scrollé en bas de la page.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
