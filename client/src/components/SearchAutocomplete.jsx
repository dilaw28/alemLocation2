import React, { useState, useRef, useEffect } from 'react';

const TYPE_ICONS = { voiture: '🚗', marque: '🏷️', catégorie: '📂' };

/** Met en gras la portion du texte qui correspond à la saisie */
function Highlight({ text, query }) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <strong style={{ color: 'var(--color-accent, #DC2626)' }}>{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function SearchAutocomplete({
  value, onChange, onSubmit, suggestions = [],
  placeholder = 'Rechercher...', icon = '🔍', inputStyle = {}, maxResults = 6,
}) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const containerRef = useRef(null);

  const matches = value.trim()
    ? suggestions
        .filter(s => s.label.toLowerCase().includes(value.trim().toLowerCase()))
        .slice(0, maxResults)
    : [];

  useEffect(() => { setActiveIdx(-1); }, [value]);

  // Ferme le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectSuggestion = (label) => {
    onChange(label);
    setOpen(false);
    setActiveIdx(-1);
  };

  const handleKeyDown = (e) => {
    if (!open || matches.length === 0) {
      if (e.key === 'Enter') onSubmit?.();
      return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, matches.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, -1)); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0) selectSuggestion(matches[activeIdx].label);
      else { setOpen(false); onSubmit?.(); }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none' }}>{icon}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => value.trim() && setOpen(true)}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded={open && matches.length > 0}
        aria-autocomplete="list"
        style={{
          width: '100%', padding: '12px 14px 12px 40px', border: '1.5px solid #e5e7eb',
          borderRadius: 10, fontSize: 15, outline: 'none', fontFamily: 'inherit',
          transition: 'border-color 0.15s',
          ...inputStyle,
        }}
      />

      {open && matches.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
          background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12,
          boxShadow: '0 12px 32px rgba(0,0,0,0.12)', zIndex: 50, overflow: 'hidden',
        }}>
          {matches.map((s, i) => (
            <div
              key={`${s.type}-${s.label}`}
              onMouseDown={(e) => { e.preventDefault(); selectSuggestion(s.label); }}
              onMouseEnter={() => setActiveIdx(i)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                cursor: 'pointer', fontSize: 14,
                background: activeIdx === i ? '#f8fafc' : '#fff',
              }}
            >
              <span style={{ fontSize: 15 }}>{TYPE_ICONS[s.type] || '🔍'}</span>
              <span style={{ color: '#111827' }}><Highlight text={s.label} query={value} /></span>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: '#9ca3af', textTransform: 'capitalize' }}>{s.type}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
