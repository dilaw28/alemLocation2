import React, { useState, useEffect } from 'react';
import { availabilityAPI } from '../../services/api';

export default function AvailabilityCalendar({ carId, startDT, endDT, onChange }) {
  const [periods, setPeriods]     = useState([]);
  const [monthOffset, setMonthOffset] = useState(0);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    availabilityAPI.getPublicCalendar(carId)
      .then(({ data }) => setPeriods(data.periods))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [carId]);

  const today = new Date();
  const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay  = new Date(year, month, 1);
  const lastDay   = new Date(year, month + 1, 0);
  const startOff  = (firstDay.getDay() + 6) % 7; // Mon=0

  const days = [];
  for (let i = 0; i < startOff; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(d);

  const isPast = (day) => {
    if (!day) return false;
    return new Date(year, month, day, 23, 59) < new Date();
  };

  const isBooked = (day) => {
    if (!day) return false;
    const date = new Date(year, month, day, 12);
    return periods.some(p =>
      date >= new Date(new Date(p.startDate).setHours(0, 0, 0, 0)) &&
      date <= new Date(new Date(p.endDate).setHours(23, 59, 59, 999))
    );
  };

  const isSelected = (day) => {
    if (!day || !startDT || !endDT) return false;
    const date = new Date(year, month, day, 12);
    return date >= new Date(startDT) && date <= new Date(endDT);
  };

  const isStart = (day) => {
    if (!day || !startDT) return false;
    const d = new Date(year, month, day);
    const s = new Date(startDT);
    return d.toDateString() === s.toDateString();
  };

  const isEnd = (day) => {
    if (!day || !endDT) return false;
    const d = new Date(year, month, day);
    const e = new Date(endDT);
    return d.toDateString() === e.toDateString();
  };

  const isToday = (day) => {
    if (!day) return false;
    return new Date(year, month, day).toDateString() === today.toDateString();
  };

  const handleDayClick = (day) => {
    if (!day || isPast(day) || isBooked(day)) return;
    const clicked = new Date(year, month, day, 10, 0); // default 10:00
    const iso = clicked.toISOString().slice(0, 16);

    if (!startDT || (startDT && endDT)) {
      // Start fresh selection
      onChange({ startDT: iso, endDT: '' });
    } else {
      // We have start but no end
      if (clicked <= new Date(startDT)) {
        onChange({ startDT: iso, endDT: '' });
        return;
      }
      // Check no booked day in range
      const rangeHasBooked = periods.some(p => {
        const ps = new Date(new Date(p.startDate).setHours(0,0,0,0));
        const pe = new Date(new Date(p.endDate).setHours(23,59,59,999));
        const rs = new Date(startDT);
        const re = clicked;
        return rs < pe && ps < re;
      });
      if (rangeHasBooked) {
        onChange({ startDT: iso, endDT: '' });
        return;
      }
      // Set end at 10:00 by default
      onChange({ startDT, endDT: iso });
    }
  };

  const getDayStyle = (day) => {
    const base = {
      aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: 8, fontSize: 13, fontWeight: 600, position: 'relative',
      transition: 'all 0.1s',
    };
    if (!day) return { ...base, background: 'transparent', color: 'transparent', cursor: 'default' };
    if (isPast(day)) return { ...base, background: '#f9fafb', color: '#d1d5db', cursor: 'not-allowed' };
    if (isBooked(day)) return { ...base, background: '#fee2e2', color: '#dc2626', cursor: 'not-allowed', fontWeight: 700 };
    if (isStart(day) || isEnd(day)) return { ...base, background: '#1a56db', color: '#fff', cursor: 'pointer' };
    if (isSelected(day)) return { ...base, background: '#dbeafe', color: '#1e40af', cursor: 'pointer' };
    if (isToday(day)) return { ...base, background: '#f0f4ff', color: '#1a56db', border: '2px solid #1a56db', cursor: 'pointer' };
    return { ...base, background: '#fff', color: '#374151', cursor: 'pointer', border: '1px solid #e5e7eb' };
  };

  if (loading) return (
    <div style={{ padding: 20, textAlign: 'center', color: '#6b7280', fontSize: 13 }}>
      Chargement du calendrier...
    </div>
  );

  return (
    <div style={{ background: '#f9fafb', borderRadius: 14, padding: 18, border: '1px solid #e5e7eb', marginBottom: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <button
          onClick={() => setMonthOffset(o => o - 1)}
          disabled={monthOffset <= 0}
          style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, width: 32, height: 32, cursor: monthOffset <= 0 ? 'not-allowed' : 'pointer', fontSize: 16, opacity: monthOffset <= 0 ? 0.4 : 1 }}
        >‹</button>
        <span style={{ fontWeight: 700, fontSize: 15, textTransform: 'capitalize', color: '#111827' }}>
          {viewDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </span>
        <button
          onClick={() => setMonthOffset(o => o + 1)}
          style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}
        >›</button>
      </div>

      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
        {['L','M','M','J','V','S','D'].map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#9ca3af' }}>{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {days.map((day, i) => (
          <div key={i} style={getDayStyle(day)} onClick={() => handleDayClick(day)}>
            {day || ''}
            {isBooked(day) && (
              <span style={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#dc2626' }} />
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 14, marginTop: 12, flexWrap: 'wrap', fontSize: 11, color: '#6b7280' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: '#fee2e2', border: '1px solid #fca5a5', display: 'inline-block' }} />
          Indisponible
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: '#1a56db', display: 'inline-block' }} />
          Votre sélection
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: '#dbeafe', display: 'inline-block' }} />
          Période sélectionnée
        </span>
      </div>

      {/* Info message about billing */}
      <div style={{ marginTop: 12, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '10px 12px', fontSize: 12, color: '#92400e', lineHeight: 1.5 }}>
        ⚠️ <strong>Important :</strong> Toute heure ou minute entamée est comptabilisée comme un jour supplémentaire.
        Veillez à bien respecter votre horaire de retour pour éviter des frais additionnels.
      </div>
    </div>
  );
}
