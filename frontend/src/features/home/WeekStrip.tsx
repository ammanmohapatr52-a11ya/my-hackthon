import React, { useEffect, useState } from 'react';
import { getThisWeekActivity, type WeekDayActivity } from '../../storage/activityStore';
import { Calendar, Check } from 'lucide-react';

export const WeekStrip: React.FC = () => {
  const [weekDays, setWeekDays] = useState<WeekDayActivity[]>([]);

  useEffect(() => {
    async function loadWeek() {
      const days = await getThisWeekActivity();
      setWeekDays(days);
    }
    loadWeek();
  }, []);

  return (
    <div
      className="card"
      style={{
        padding: '1.25rem',
        margin: '1.5rem 0',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={18} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>This Week's Learning Activity</h3>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Solve at least 1 problem daily to keep your streak
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '0.5rem',
        }}
      >
        {weekDays.map((day, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '0.75rem 0.25rem',
              borderRadius: 'var(--radius-md)',
              background: day.isToday
                ? 'rgba(56, 189, 248, 0.12)'
                : day.hasActivity
                ? 'rgba(16, 185, 129, 0.1)'
                : 'var(--bg-surface)',
              border: day.isToday
                ? '1px solid var(--accent-primary)'
                : day.hasActivity
                ? '1px solid rgba(16, 185, 129, 0.3)'
                : '1px solid var(--border-subtle)',
            }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              {day.dayName}
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: day.hasActivity
                  ? 'var(--status-success)'
                  : day.isToday
                  ? 'transparent'
                  : 'rgba(255, 255, 255, 0.05)',
                border: day.isToday && !day.hasActivity ? '2px dashed var(--accent-primary)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: day.hasActivity ? '#000000' : 'var(--text-muted)',
              }}
            >
              {day.hasActivity ? <Check size={18} strokeWidth={3} /> : '•'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
