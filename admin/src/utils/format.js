export const DZD = (n) =>
  new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DA', maximumFractionDigits: 0 }).format(n || 0);

export const fmtDate = (d) =>
  new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

export const fmtDateShort = (d) =>
  new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });

export const fmtDateTime = (d) =>
  new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export const todayStr = () => new Date().toISOString().split('T')[0];

export const RENTAL_TYPE_LABELS = {
  personnel:      '🧍 Personnel',
  entreprise:     '🏢 Entreprise',
  avec_chauffeur: '👨‍✈️ Avec chauffeur',
};

export const STATUS_STYLE = {
  en_attente: { bg: '#fef3c7', text: '#92400e', label: '⏳ En attente' },
  approuvée:  { bg: '#d1fae5', text: '#065f46', label: '✅ Approuvée' },
  en_cours:   { bg: '#dbeafe', text: '#1e40af', label: '🔄 En cours' },
  terminée:   { bg: '#f3f4f6', text: '#374151', label: '🏁 Terminée' },
  annulée:    { bg: '#fef3c7', text: '#92400e', label: '🚫 Annulée' },
  refusée:    { bg: '#fee2e2', text: '#991b1b', label: '❌ Refusée' },
};
