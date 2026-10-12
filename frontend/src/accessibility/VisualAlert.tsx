import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, Bell, X } from 'lucide-react';

export interface VisualNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
  timestamp: number;
}

interface VisualAlertContextType {
  showAlert: (alert: Omit<VisualNotification, 'id' | 'timestamp'>) => void;
  dismissAlert: (id: string) => void;
}

const VisualAlertContext = createContext<VisualAlertContextType>({
  showAlert: () => {},
  dismissAlert: () => {},
});

export const useVisualAlert = () => useContext(VisualAlertContext);

export const VisualAlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<VisualNotification[]>([]);

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const showAlert = useCallback(
    ({ type, title, message }: Omit<VisualNotification, 'id' | 'timestamp'>) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newAlert: VisualNotification = {
        id,
        type,
        title,
        message,
        timestamp: Date.now(),
      };
      setAlerts((prev) => [...prev, newAlert]);

      // Auto dismiss after 5 seconds
      setTimeout(() => {
        dismissAlert(id);
      }, 5000);
    },
    [dismissAlert]
  );

  return (
    <VisualAlertContext.Provider value={{ showAlert, dismissAlert }}>
      {children}
      {alerts.length > 0 && (
        <div
          role="region"
          aria-label="Visual Notifications"
          style={{
            position: 'fixed',
            top: '1.25rem',
            right: '1.25rem',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            maxWidth: '380px',
            width: 'calc(100vw - 2.5rem)',
          }}
        >
          {alerts.map((alert) => {
            const isSuccess = alert.type === 'success';
            const isWarning = alert.type === 'warning';
            const isError = alert.type === 'error';

            const borderCol = isSuccess
              ? 'var(--status-success)'
              : isWarning
              ? 'var(--status-warning)'
              : isError
              ? 'var(--status-error)'
              : 'var(--accent-primary)';

            return (
              <div
                key={alert.id}
                role="status"
                style={{
                  background: 'var(--bg-elevated)',
                  borderLeft: `4px solid ${borderCol}`,
                  borderTop: '1px solid var(--border-medium)',
                  borderRight: '1px solid var(--border-medium)',
                  borderBottom: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  boxShadow: 'var(--shadow-lg)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  color: 'var(--text-primary)',
                  animation: 'fadeIn 0.2s ease',
                }}
              >
                <div style={{ flexShrink: 0, marginTop: '2px' }}>
                  {isSuccess && <CheckCircle2 size={20} color="var(--status-success)" />}
                  {isWarning && <AlertCircle size={20} color="var(--status-warning)" />}
                  {isError && <AlertCircle size={20} color="var(--status-error)" />}
                  {!isSuccess && !isWarning && !isError && <Bell size={20} color="var(--accent-primary)" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{alert.title}</div>
                  {alert.message && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {alert.message}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => dismissAlert(alert.id)}
                  aria-label="Dismiss notification"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </VisualAlertContext.Provider>
  );
};
