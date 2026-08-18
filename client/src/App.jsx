import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import AlertModal from './components/AlertModal';

// Lazy-loading : chaque page devient un fichier JS chargé à la demande,
// au lieu d'être inclus dans le bundle initial. Réduit nettement le temps
// de premier chargement, surtout pour les pages légales peu visitées.
const HomePage      = lazy(() => import('./pages/HomePage'));
const CarsPage       = lazy(() => import('./pages/CarsPage'));
const CarDetailPage  = lazy(() => import('./pages/CarDetailPage'));
const ProfilePage    = lazy(() => import('./pages/ProfilePage'));
const LoginPage       = lazy(() => import('./pages/LoginPage'));
const RegisterPage    = lazy(() => import('./pages/RegisterPage'));
const ConditionG      = lazy(() => import('./pages/ConditionG'));
const Politique        = lazy(() => import('./pages/Politique'));
const MentionL          = lazy(() => import('./pages/MentionL'));
const Faq                = lazy(() => import('./pages/Faq'));

function PageLoader() {
  return (
    <div style={{ padding: 80, textAlign: 'center' }}>
      <div className="spinner" />
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cars" element={<CarsPage />} />
        <Route path="/cars/:id" element={<CarDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/conditions-generales" element={<ConditionG />} />
        <Route path="/politique-de-confidentialite" element={<Politique />} />
        <Route path="/mentions-legales" element={<MentionL />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
        <AlertModal />
      </AlertProvider>
    </AuthProvider>
  );
}
