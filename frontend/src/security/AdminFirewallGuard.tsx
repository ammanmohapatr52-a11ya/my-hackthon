import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, Lock, ArrowLeft, KeyRound, AlertTriangle, Activity, CheckCircle2 } from 'lucide-react';
import { checkFirewallPass, getAdminSession, type FirewallIntrusionEvent } from './adminFirewall';

interface AdminFirewallGuardProps {
  children: React.ReactNode;
}

export const AdminFirewallGuard: React.FC<AdminFirewallGuardProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAllowed, setIsAllowed] = useState<boolean>(() => checkFirewallPass(location.pathname).allowed);
  const [denialDetails, setDenialDetails] = useState<{ reason?: string; event?: FirewallIntrusionEvent }>(() => {
    const pass = checkFirewallPass(location.pathname);
    return { reason: pass.reason, event: pass.event };
  });

  useEffect(() => {
    const evaluate = () => {
      const pass = checkFirewallPass(location.pathname);
      setIsAllowed(pass.allowed);
      setDenialDetails({ reason: pass.reason, event: pass.event });
    };

    evaluate();

    const handleAuthChange = () => evaluate();
    const handleConfigChange = () => evaluate();

    window.addEventListener('neurobridge_admin_auth_changed', handleAuthChange);
    window.addEventListener('neurobridge_firewall_config_changed', handleConfigChange);

    return () => {
      window.removeEventListener('neurobridge_admin_auth_changed', handleAuthChange);
      window.removeEventListener('neurobridge_firewall_config_changed', handleConfigChange);
    };
  }, [location.pathname]);

  if (isAllowed) {
    return <>{children}</>;
  }

  // Intercept Screen: Military-grade cyber firewall alert
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#0a0d14',
        backgroundImage: 'radial-gradient(circle at 50% 30%, #171d2b 0%, #0c101a 60%, #06080d 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Cyber Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(239, 68, 68, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 68, 68, 0.04) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          pointerEvents: 'none',
        }}
      />

      {/* Main Firewall Shield Box */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '560px',
          maxWidth: '94vw',
          backgroundColor: 'rgba(17, 24, 39, 0.92)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          borderRadius: '16px',
          padding: '2.5rem 2rem',
          boxShadow: '0 0 50px rgba(239, 68, 68, 0.18), 0 20px 40px rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(16px)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Animated Pulsing Shield Icon */}
        <div
          style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '2px solid rgba(239, 68, 68, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            boxShadow: '0 0 30px rgba(239, 68, 68, 0.35)',
            position: 'relative',
          }}
        >
          <ShieldAlert size={40} color="#ef4444" />
        </div>

        {/* Security Alert Header */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}
        >
          <Activity size={12} />
          <span>Neurobridge Active Defense Firewall</span>
        </div>

        <h1
          style={{
            fontSize: '1.85rem',
            fontWeight: 800,
            color: '#ffffff',
            margin: '0 0 0.5rem 0',
            letterSpacing: '-0.02em',
          }}
        >
          Access Intercepted
        </h1>

        <p
          style={{
            color: '#94a3b8',
            fontSize: '0.925rem',
            lineHeight: 1.5,
            margin: '0 0 1.5rem 0',
            maxWidth: '440px',
          }}
        >
          The Admin Console has been decoupled and placed behind an isolated security perimeter. Direct route traversal is strictly blocked by firewall rules.
        </p>

        {/* Diagnostic Metadata Panel */}
        <div
          style={{
            width: '100%',
            backgroundColor: 'rgba(10, 15, 26, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '1rem',
            marginBottom: '1.75rem',
            textAlign: 'left',
            fontSize: '0.82rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
            <span>Target Route:</span>
            <span style={{ color: '#f87171', fontFamily: 'monospace', fontWeight: 600 }}>{location.pathname}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
            <span>Protection Status:</span>
            <span style={{ color: '#38bdf8', fontWeight: 600 }}>ACTIVE WAF / IDS SHIELD</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
            <span>Incident Code:</span>
            <span style={{ color: '#cbd5e1', fontFamily: 'monospace' }}>
              {denialDetails.event?.id || `FW-ERR-${Date.now().toString().slice(-6)}`}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
            <span>Policy Violation:</span>
            <span style={{ color: '#fbbf24', fontWeight: 500 }}>
              {denialDetails.reason || 'Missing Administrative Authentication Token'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            width: '100%',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            onClick={() => navigate('/admin-login')}
            id="firewall-go-to-admin-login-button"
            style={{
              flex: '1 1 200px',
              padding: '0.75rem 1.25rem',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(2, 132, 199, 0.4)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0369a1')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0284c7')}
          >
            <KeyRound size={16} />
            <span>Dedicated Admin Login</span>
          </button>

          <Link
            to="/"
            id="firewall-return-to-app-button"
            style={{
              flex: '1 1 140px',
              padding: '0.75rem 1.25rem',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: '#cbd5e1',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.color = '#cbd5e1';
            }}
          >
            <ArrowLeft size={16} />
            <span>Return to App</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
