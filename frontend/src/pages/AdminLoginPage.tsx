import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Terminal,
  Activity,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import {
  verifyAdminCredentials,
  getAdminSession,
  getFirewallConfig,
  isIpBlocked,
  getIpLockoutRemainingSeconds,
} from '../security/adminFirewall';
import { MarvelBackground3D } from '../components/ui/MarvelBackground3D';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(() => getIpLockoutRemainingSeconds());
  const [firewallConfig, setFirewallConfig] = useState(() => getFirewallConfig());

  // 3D Parallax Tilt
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });

  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseTilt({ x, y });
  };

  const handleContainerMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
  };

  // Countdown timer for IP lockout
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  // If already authenticated, redirect to /admin
  useEffect(() => {
    const session = getAdminSession();
    if (session) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (lockoutSeconds > 0) {
      setError(`Access Restricted: Firewall lockdown active for ${lockoutSeconds} seconds.`);
      return;
    }

    if (!adminId.trim()) {
      setError('Please provide an Admin Security Identifier');
      return;
    }

    if (!password.trim()) {
      setError('Please enter Admin Security Passcode');
      return;
    }

    setIsLoading(true);

    // Simulate cryptographic verification delay
    setTimeout(() => {
      setIsLoading(false);
      const result = verifyAdminCredentials(adminId, password);

      if (!result.success) {
        setError(result.error || 'Authentication rejected by security policy');
        const remaining = getIpLockoutRemainingSeconds();
        if (remaining > 0) {
          setLockoutSeconds(remaining);
        }
        return;
      }

      setSuccessMsg('Administrative Session Authenticated! Decrypting console...');
      setTimeout(() => {
        navigate('/admin');
      }, 700);
    }, 600);
  };


  return (
    <div
      onMouseMove={handleContainerMouseMove}
      onMouseLeave={handleContainerMouseLeave}
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#070a12',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '1.5rem',
        overflow: 'hidden',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: '#f8fafc',
      }}
    >
      {/* 3D Marvel Cinematic Background Engine */}
      <MarvelBackground3D />

      {/* Top Header Navigation */}
      <div
        style={{
          position: 'absolute',
          top: '1.25rem',
          left: '1.5rem',
          right: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 20,
        }}
      >
        <Link
          to="/"
          id="admin-login-back-button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#94a3b8',
            fontSize: '0.875rem',
            textDecoration: 'none',
            padding: '0.4rem 0.85rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#38bdf8';
            e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#94a3b8';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          }}
        >
          <ArrowLeft size={16} />
          <span>Return to Application</span>
        </Link>

        {/* Live Firewall Status Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            color: '#34d399',
            fontWeight: 600,
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 8px #10b981',
            }}
          />
          <span>FIREWALL ACTIVE · WAF & IDS ONLINE</span>
        </div>
      </div>

      {/* Main Admin Authentication Card with 3D Marvel Perspective */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '470px',
          maxWidth: '92vw',
          backgroundColor: 'rgba(9, 14, 26, 0.9)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '20px',
          padding: '2.5rem 2rem 2rem 2rem',
          boxShadow: '0 0 60px rgba(56, 189, 248, 0.22), 0 25px 60px rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          perspective: '1200px',
          transform: `perspective(1200px) rotateX(${-mouseTilt.y * 12}deg) rotateY(${mouseTilt.x * 12}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)',
        }}
      >
        {/* Holographic Corner HUD Brackets */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', width: '12px', height: '12px', borderTop: '2px solid #38bdf8', borderLeft: '2px solid #38bdf8', pointerEvents: 'none', filter: 'drop-shadow(0 0 4px #38bdf8)' }} />
        <div style={{ position: 'absolute', top: '10px', right: '10px', width: '12px', height: '12px', borderTop: '2px solid #38bdf8', borderRight: '2px solid #38bdf8', pointerEvents: 'none', filter: 'drop-shadow(0 0 4px #38bdf8)' }} />
        <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '12px', height: '12px', borderBottom: '2px solid #f59e0b', borderLeft: '2px solid #f59e0b', pointerEvents: 'none', filter: 'drop-shadow(0 0 4px #f59e0b)' }} />
        <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '12px', height: '12px', borderBottom: '2px solid #f59e0b', borderRight: '2px solid #f59e0b', pointerEvents: 'none', filter: 'drop-shadow(0 0 4px #f59e0b)' }} />
        {/* Emblem Shield with Neon Glow */}
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.2) 0%, rgba(245, 158, 11, 0.15) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
            boxShadow: '0 0 25px rgba(56, 189, 248, 0.3)',
          }}
        >
          <ShieldCheck size={36} color="#38bdf8" />
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#ffffff',
            margin: '0 0 0.35rem 0',
            letterSpacing: '-0.02em',
          }}
        >
          Admin Gateway
        </h1>

        <p
          style={{
            color: '#94a3b8',
            fontSize: '0.85rem',
            margin: '0 0 1.5rem 0',
            lineHeight: 1.4,
          }}
        >
          Isolated Administrative Security Gateway. Restricted to authorized personnel only.
        </p>

        {/* Lockout Warning Banner */}
        {lockoutSeconds > 0 && (
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(239, 68, 68, 0.18)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fca5a5',
              fontSize: '0.82rem',
              padding: '0.6rem 0.85rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              textAlign: 'left',
            }}
          >
            <ShieldAlert size={18} color="#ef4444" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700 }}>IP Lockdown Engaged</div>
              <div>Rate limit protection active. Unlocks in {lockoutSeconds} seconds.</div>
            </div>
          </div>
        )}

        {/* Error / Success Feedback */}
        {error && (
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              fontSize: '0.82rem',
              padding: '0.55rem 0.85rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              textAlign: 'left',
            }}
          >
            <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              color: '#86efac',
              fontSize: '0.82rem',
              padding: '0.55rem 0.85rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              textAlign: 'left',
            }}
          >
            <CheckCircle2 size={16} color="#22c55e" style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Admin ID */}
          <div style={{ textAlign: 'left' }}>
            <label
              htmlFor="admin-login-id-input"
              style={{
                display: 'block',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#cbd5e1',
                marginBottom: '0.35rem',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Admin Identifier
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-login-id-input"
                type="text"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="AOG or admin"
                disabled={lockoutSeconds > 0}
                required
                style={{
                  width: '100%',
                  height: '44px',
                  backgroundColor: '#0b1322',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: '8px',
                  padding: '0 40px 0 14px',
                  color: '#f8fafc',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  fontFamily: 'monospace',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#38bdf8';
                  e.target.style.boxShadow = '0 0 15px rgba(56, 189, 248, 0.25)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(56, 189, 248, 0.25)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b',
                  pointerEvents: 'none',
                }}
              >
                <Terminal size={16} />
              </span>
            </div>
          </div>

          {/* Admin Password */}
          <div style={{ textAlign: 'left' }}>
            <label
              htmlFor="admin-login-pass-input"
              style={{
                display: 'block',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#cbd5e1',
                marginBottom: '0.35rem',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Admin Security Passcode
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-login-pass-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                disabled={lockoutSeconds > 0}
                required
                style={{
                  width: '100%',
                  height: '44px',
                  backgroundColor: '#0b1322',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: '8px',
                  padding: '0 40px 0 14px',
                  color: '#f8fafc',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  fontFamily: 'monospace',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#38bdf8';
                  e.target.style.boxShadow = '0 0 15px rgba(56, 189, 248, 0.25)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(56, 189, 248, 0.25)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="admin-login-submit-button"
            type="submit"
            disabled={isLoading || lockoutSeconds > 0}
            style={{
              marginTop: '0.5rem',
              height: '46px',
              backgroundColor: lockoutSeconds > 0 ? '#334155' : '#0284c7',
              backgroundImage:
                lockoutSeconds > 0
                  ? 'none'
                  : 'linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #075985 100%)',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '0.95rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              cursor: isLoading || lockoutSeconds > 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              boxShadow: lockoutSeconds > 0 ? 'none' : '0 0 20px rgba(2, 132, 199, 0.45)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (lockoutSeconds <= 0) {
                e.currentTarget.style.boxShadow = '0 0 28px rgba(2, 132, 199, 0.65)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (lockoutSeconds <= 0) {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(2, 132, 199, 0.45)';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {isLoading ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                <span>Verifying Security Token...</span>
              </>
            ) : (
              <>
                <KeyRound size={18} />
                <span>Authenticate Admin Session</span>
              </>
            )}
          </button>
        </form>

        {/* Zero-Trust Administrative Security Notice */}
        <div
          style={{
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#94a3b8',
              fontSize: '0.76rem',
              fontWeight: 500,
            }}
          >
            <Lock size={12} style={{ color: '#38bdf8' }} />
            <span>Strict Administrative Authentication Required</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: '#475569' }}>
            Zero-Trust Protocol • IP Intrusion Prevention & Rate Limiting Active
          </span>
        </div>
      </div>
    </div>
  );
};
