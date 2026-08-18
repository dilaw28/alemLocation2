import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import logo from "./asset/logo.png";

// Lazy-loading : chaque page admin est chargée à la demande plutôt que
// d'alourdir le bundle initial du panneau d'administration.
const Dashboard       = lazy(() => import('./pages/Dashboard'));
const RentalRequests  = lazy(() => import('./pages/RentalRequests'));
const RentalHistory   = lazy(() => import('./pages/RentalHistory'));
const Users           = lazy(() => import('./pages/Users'));
const Cars            = lazy(() => import('./pages/Cars'));
const Availability    = lazy(() => import('./pages/Availability'));
const Login           = lazy(() => import('./pages/Login'));

function PageLoader() {
  return <div style={{ padding: 80, textAlign: 'center', color: '#6b7280' }}>Chargement...</div>;
}

function Sidebar({ onLogout }) {
  const navItems = [
    { to: '/dashboard', icon: '📊', label: 'Tableau de bord' },
    { to: '/requests', icon: '⏳', label: 'Demandes en cours' },
    { to: '/availability', icon: '📅', label: 'Disponibilité' },
    { to: '/history', icon: '📋', label: 'Historique' },
    { to: '/users', icon: '👥', label: 'Utilisateurs' },
    { to: '/cars', icon: '🚗', label: 'Véhicules' },
    { to: '/dashboard#locations', icon: '📍', label: 'Localisations' },
  ];

  return (
    <aside style={sidebarStyle}>
      <div style={logoStyle}>
        <img src={logo} alt="AutoLoc" style={{ width: 200, height: 150 }} />
        
      </div>
      <nav style={{ flex: 1, padding: '8px 0' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px',
              color: isActive ? '#fff' : '#bfdbfe', textDecoration: 'none',
              backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
              borderRadius: 8, margin: '2px 8px', fontWeight: isActive ? 700 : 400,
              fontSize: 14, transition: 'all 0.2s',
            })}
          >
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div style={{ padding: 16 }}>
        <button onClick={onLogout} style={{ width: '100%', padding: '10px 16px', background: 'rgba(239,68,68,0.2)', color: '#fca5a5', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

function AdminLayout({ onLogout, children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Sidebar onLogout={onLogout} />
      <main style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}

function ProtectedRoute({ isAuth, children }) {
  return isAuth ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('adminToken'));

  const handleLogin = (token) => {
    localStorage.setItem('adminToken', token);
    setIsAuth(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAuth(false);
  };

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={isAuth ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
          <Route path="/*" element={
            <ProtectedRoute isAuth={isAuth}>
              <AdminLayout onLogout={handleLogout}>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/requests" element={<RentalRequests />} />
                    <Route path="/availability" element={<Availability />} />
                    <Route path="/history" element={<RentalHistory />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/cars" element={<Cars />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                  </Routes>
                </Suspense>
              </AdminLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

const sidebarStyle = {
  width: 240, backgroundColor: '#44464a', display: 'flex', flexDirection: 'column',
  minHeight: '100vh', position: 'sticky', top: 0, flexShrink: 0,
};
const logoStyle = {
  display: 'flex', alignItems: 'center', gap: 12, padding: '24px 20px',
  borderBottom: '1px solid rgba(255,255,255,0.15)',
};
