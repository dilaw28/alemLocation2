import React, { createContext, useContext, useState, useCallback } from 'react';

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null); // { type: 'error'|'success'|'info', title, message }

  const showAlert = useCallback((message, opts = {}) => {
    setAlert({
      type: opts.type || 'error',
      title: opts.title || (opts.type === 'success' ? 'Succès' : 'Une erreur est survenue'),
      message,
    });
  }, []);

  const showError = useCallback((err, fallback = 'Une erreur est survenue. Veuillez réessayer.') => {
    const message = err?.response?.data?.message
      || err?.response?.data?.errors?.[0]?.msg
      || err?.message
      || (typeof err === 'string' ? err : fallback);
    setAlert({ type: 'error', title: 'Une erreur est survenue', message });
  }, []);

  const showSuccess = useCallback((message, title = 'Succès') => {
    setAlert({ type: 'success', title, message });
  }, []);

  const closeAlert = useCallback(() => setAlert(null), []);

  return (
    <AlertContext.Provider value={{ alert, showAlert, showError, showSuccess, closeAlert }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlert doit être utilisé dans un AlertProvider');
  return ctx;
}
