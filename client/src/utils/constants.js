export const COUNTRY_CODES = [
  { code: '+213', flag: '🇩🇿', name: 'Algérie' },
  { code: '+216', flag: '🇹🇳', name: 'Tunisie' },
  { code: '+212', flag: '🇲🇦', name: 'Maroc' },
  { code: '+33',  flag: '🇫🇷', name: 'France' },
  { code: '+32',  flag: '🇧🇪', name: 'Belgique' },
  { code: '+41',  flag: '🇨🇭', name: 'Suisse' },
  { code: '+1',   flag: '🇺🇸', name: 'USA / Canada' },
  { code: '+44',  flag: '🇬🇧', name: 'Royaume-Uni' },
  { code: '+49',  flag: '🇩🇪', name: 'Allemagne' },
  { code: '+34',  flag: '🇪🇸', name: 'Espagne' },
  { code: '+39',  flag: '🇮🇹', name: 'Italie' },
  { code: '+90',  flag: '🇹🇷', name: 'Turquie' },
  { code: '+966', flag: '🇸🇦', name: 'Arabie Saoudite' },
  { code: '+971', flag: '🇦🇪', name: 'Émirats Arabes Unis' },
  { code: '+20',  flag: '🇪🇬', name: 'Égypte' },
  { code: '+221', flag: '🇸🇳', name: 'Sénégal' },
  { code: '+225', flag: '🇨🇮', name: "Côte d'Ivoire" },
];

export const STATUS_STYLE = {
  en_attente: { cls: 'badge-yellow', label: '⏳ En attente' },
  approuvée:  { cls: 'badge-green',  label: '✅ Approuvée' },
  en_cours:   { cls: 'badge-blue',   label: '🔄 En cours' },
  terminée:   { cls: 'badge-gray',   label: '🏁 Terminée' },
  annulée:    { cls: 'badge-red',    label: '🚫 Annulée' },
  refusée:    { cls: 'badge-red',    label: '❌ Refusée' },
};

export const inputSt = (err) => ({
  width: '100%',
  padding: '11px 14px',
  border: `1.5px solid ${err ? '#ef4444' : '#e5e7eb'}`,
  borderRadius: 10,
  fontSize: 15,
  outline: 'none',
  boxSizing: 'border-box',
  background: err ? '#fff5f5' : '#fff',
  transition: 'border-color 0.15s',
});
