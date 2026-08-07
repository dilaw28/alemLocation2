export const DZD = (n) =>
  new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD', maximumFractionDigits: 0 }).format(n);

export const RENTAL_TYPES = [
  { value: 'personnel',      label: '🧍 Personnel',      desc: 'Location classique pour un usage privé — vacances, déplacements personnels, etc.' },
  { value: 'entreprise',     label: '🏢 Entreprise',     desc: "Location pour usage professionnel — missions, déplacements d'affaires, salariés." },
  { value: 'avec_chauffeur', label: '👨‍✈️ Avec chauffeur', desc: 'Votre véhicule est conduit par un chauffeur professionnel Alem Location. Idéal pour aéroports, sorties ou VIP.' },
];

export const RENTAL_TYPE_LABELS = {
  personnel:      '🧍 Personnel',
  entreprise:     '🏢 Entreprise',
  avec_chauffeur: '👨‍✈️ Avec chauffeur',
};

export const LOCATION_TYPES_ORDER = ['ville', 'aéroport', 'gare', 'hôtel', 'autre'];
export const LOC_ICONS = { ville: '🏙️', aéroport: '✈️', gare: '🚂', hôtel: '🏨', autre: '📍' };

/** Jours facturés : toute heure entamée → jour de plus */
export function computeBilledDays(start, end) {
  if (!start || !end) return 0;
  const diffMs = new Date(end) - new Date(start);
  if (diffMs <= 0) return 0;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/** "3 j 2 h" */
export function formatDuration(start, end) {
  if (!start || !end) return '';
  const diffMs = new Date(end) - new Date(start);
  if (diffMs <= 0) return '';
  const totalMins = Math.floor(diffMs / 60000);
  const days  = Math.floor(totalMins / (60 * 24));
  const hours = Math.floor((totalMins % (60 * 24)) / 60);
  const mins  = totalMins % 60;
  const parts = [];
  if (days > 0)                parts.push(`${days} j`);
  if (hours > 0)                parts.push(`${hours} h`);
  if (mins > 0 && days === 0)  parts.push(`${mins} min`);
  return parts.join(' ') || '< 1 min';
}

/** datetime-local string → "Lun. 14 juil. 2025, 09:00" */
export function fmtDatetime(val) {
  if (!val) return '';
  return new Date(val).toLocaleString('fr-FR', {
    weekday: 'short', day: '2-digit', month: 'short',
    year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

/** Now + offset minutes, formatted for datetime-local input */
export function localDT(offsetMinutes = 0) {
  const d = new Date(Date.now() + offsetMinutes * 60000);
  d.setSeconds(0, 0);
  return d.toISOString().slice(0, 16);
}
