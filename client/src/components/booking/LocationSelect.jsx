import React from 'react';
import { LOCATION_TYPES_ORDER, LOC_ICONS } from '../../utils/format';

export default function LocationSelect({ label, value, onChange, locations, placeholder }) {
  const locationOptions = (type) => locations.filter(l => l.type === type);

  return (
    <div className="field">
      <label>{label}</label>
      {locations.length > 0 ? (
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">-- Sélectionner un lieu --</option>
          {LOCATION_TYPES_ORDER.map(type => {
            const locs = locationOptions(type);
            if (!locs.length) return null;
            return (
              <optgroup key={type} label={`${LOC_ICONS[type]} ${type.charAt(0).toUpperCase() + type.slice(1)}`}>
                {locs.map(l => <option key={l._id} value={l.name}>{l.name}</option>)}
              </optgroup>
            );
          })}
        </select>
      ) : (
        <input type="text" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}
