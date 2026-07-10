import React from 'react';

export default function MiniCalendar({ periods, monthOffset, onMonthChange }) {
  const today = new Date();
  const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay  = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday = 0

  const days = [];
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(d);

  const dayStatus = (day) => {
    if (!day) return null;
    const date = new Date(year, month, day, 12);
    return periods.find(p =>
      date >= new Date(new Date(p.startDate).setHours(0, 0, 0, 0)) &&
      date <= new Date(new Date(p.endDate).setHours(23, 59, 59, 999))
    );
  };

  const colorFor = (period) => {
    if (!period) return null;
    if (period.isBlock) return { bg: '#fef3c7', text: '#92400e' };
    if (period.status === 'en_attente') return { bg: '#fef3c7', text: '#92400e' };
    return { bg: '#fee2e2', text: '#991b1b' };
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <button onClick={() => onMonthChange(monthOffset - 1)} style={{ background: '#f3f4f6', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 14 }}>‹</button>
        <span style={{ fontWeight: 700, fontSize: 15, textTransform: 'capitalize' }}>
          {viewDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </span>
        <button onClick={() => onMonthChange(monthOffset + 1)} style={{ background: '#f3f4f6', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 14 }}>›</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#9ca3af' }}>{d}</div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {days.map((day, i) => {
          const period = dayStatus(day);
          const colors = colorFor(period);
          const isToday = day && new Date(year, month, day).toDateString() === today.toDateString();
          return (
            <div
              key={i}
              title={period ? `${period.renter?.name || period.adminNote || 'Bloqué'}` : ''}
              style={{
                aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 8, fontSize: 12, fontWeight: day ? 600 : 400,
                background: colors ? colors.bg : day ? '#f9fafb' : 'transparent',
                color: colors ? colors.text : day ? '#374151' : 'transparent',
                border: isToday ? '2px solid #1a56db' : '1px solid transparent',
                cursor: period ? 'pointer' : 'default',
              }}
            >
              {day || ''}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 14, marginTop: 14, fontSize: 11, color: '#6b7280', flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, background: '#fee2e2', display: 'inline-block' }} /> Réservé
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, background: '#fef3c7', display: 'inline-block' }} /> En attente / bloqué
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, border: '2px solid #1a56db', display: 'inline-block' }} /> Aujourd'hui
        </span>
      </div>
    </div>
  );
}
