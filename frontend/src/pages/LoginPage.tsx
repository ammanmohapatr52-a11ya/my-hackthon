import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Shield,
  KeyRound,
  RefreshCw,
  Send,
  Check,
  Settings,
  ExternalLink,
  X,
  Radio,
  CheckCircle,
  LogOut,
} from 'lucide-react';
import {
  authenticateOrRegisterUser,
  getCurrentAuthUser,
  logoutAuthUser,
  type AuthSessionUser,
} from '../services/userService';
import {
  sendRegistrationOtp,
  sendLoginOtp,
  verifyLoginOtpAndAuthenticate,
  verifyOtpAndRegister,
  getPendingRegistration,
  getSmtpStatus,
  saveSmtpConfig,
  testSmtpConnection,
  type DispatchedOtpNotification,
  type SmtpConfigStatus,
} from '../security/otpService';
import { MarvelBackground3D } from '../components/ui/MarvelBackground3D';
import { MarvelAvatar } from '../components/ui/MarvelAvatar';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeUser, setActiveUser] = useState<AuthSessionUser | null>(() => getCurrentAuthUser());
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState<'auth' | 'otp'>('auth');
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');

  // 3D Mouse Parallax Tilt state
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

  // Input states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP Verification state
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpRemainingSeconds, setOtpRemainingSeconds] = useState(300);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [liveOtpPreview, setLiveOtpPreview] = useState<string | null>(null);
  const [isLiveDelivery, setIsLiveDelivery] = useState(false);

  // SMTP Dispatcher Configuration & Status Modal state
  const [smtpStatus, setSmtpStatus] = useState<SmtpConfigStatus | null>(null);
  const [smtpModalOpen, setSmtpModalOpen] = useState(false);
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [smtpTestRecipient, setSmtpTestRecipient] = useState('');
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const [showSmtpPass, setShowSmtpPass] = useState(false);
  const [smtpModalMsg, setSmtpModalMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load live SMTP status on mount
  useEffect(() => {
    getSmtpStatus().then((status) => {
      setSmtpStatus(status);
      if (status.user && status.user !== '(Not configured)') {
        setSmtpUser(status.user);
      }
    });
  }, []);



  // Countdown timer for OTP expiry and resend cooldown
  useEffect(() => {
    if (step !== 'otp') return;

    const interval = setInterval(() => {
      setOtpRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  // 54 tick marks around the dial ring
  const TOTAL_TICKS = 54;
  const ticks = Array.from({ length: TOTAL_TICKS }, (_, i) => {
    const angle = (i * 360) / TOTAL_TICKS;
    const isOrangeGlow = angle >= 110 && angle <= 165;
    const isDimmed = angle > 165 && angle < 235;

    let color = 'rgba(226, 232, 240, 0.75)';
    let filter = 'none';
    let opacity = 0.85;

    if (isOrangeGlow) {
      color = '#f59e0b';
      filter = 'drop-shadow(0 0 6px #f59e0b) drop-shadow(0 0 12px rgba(245, 158, 11, 0.6))';
      opacity = 1;
    } else if (isDimmed) {
      color = '#2a354b';
      opacity = 0.35;
    } else if (angle >= 235 && angle <= 330) {
      opacity = 0.95;
      color = '#f8fafc';
    } else {
      opacity = 0.65;
      color = '#cbd5e1';
    }

    return {
      index: i,
      angle,
      color,
      filter,
      opacity,
      isOrangeGlow,
    };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // 1. REGISTRATION FLOW (SIGN UP): REQUIRES EMAIL OTP VERIFICATION
    if (isSignUp) {
      const regEmail = (email || (username.includes('@') ? username : '')).trim().toLowerCase();
      const regUsername = username.trim() || regEmail.split('@')[0];

      if (!regEmail || !regEmail.includes('@')) {
        setError('Please enter a valid email address to receive your verification OTP');
        return;
      }
      if (!password.trim() || password.length < 4) {
        setError('Password must be at least 4 characters');
        return;
      }

      setIsLoading(true);
      const otpRes = await sendRegistrationOtp({
        email: regEmail,
        username: regUsername,
        password,
      });
      setIsLoading(false);

      if (!otpRes.success) {
        setError(otpRes.error || 'Failed to dispatch verification OTP');
        return;
      }

      setIsLiveDelivery(Boolean(otpRes.isLiveDelivery));
      setLiveOtpPreview(null);
      setOtpRemainingSeconds(300);
      setResendCooldown(60);
      setStep('otp');

      if (otpRes.isLiveDelivery) {
        setSuccessMsg(`⚡ Verification code dispatched directly to your Gmail: ${regEmail}! Please check your Inbox.`);
        setError(null);
      } else {
        setError(`Email could not be delivered to ${regEmail}. Google SMTP requires a 16-character App Password to authorize sending emails.`);
        setSuccessMsg(null);
      }
      return;
    }

    // 2. DIRECT GMAIL OTP LOGIN FLOW (EXISTING USER WITHOUT PASSWORD)
    if (loginMethod === 'otp') {
      const loginEmail = (email || username).trim().toLowerCase();
      if (!loginEmail || !loginEmail.includes('@')) {
        setError('Please enter a valid Gmail / Email address to receive your login code');
        return;
      }

      setIsLoading(true);
      const otpRes = await sendLoginOtp({ email: loginEmail });
      setIsLoading(false);

      if (!otpRes.success) {
        setError(otpRes.error || 'Failed to dispatch login OTP');
        return;
      }

      setIsLiveDelivery(Boolean(otpRes.isLiveDelivery));
      setLiveOtpPreview(null);
      setOtpRemainingSeconds(300);
      setResendCooldown(60);
      setStep('otp');

      if (otpRes.isLiveDelivery) {
        setSuccessMsg(`⚡ Login code dispatched directly to your Gmail: ${loginEmail}! Check your inbox.`);
        setError(null);
      } else {
        setError(`Email could not be delivered to ${loginEmail}. Google SMTP requires a 16-character App Password to authorize sending emails.`);
        setSuccessMsg(null);
      }
      return;
    }

    // 3. STANDARD PASSWORD LOGIN FLOW
    if (!username.trim()) {
      setError('Please enter your username or email');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const authResult = authenticateOrRegisterUser({
        usernameOrEmail: username,
        password,
        isSignUp: false,
      });

      if (!authResult.success) {
        setError(authResult.error || 'Authentication rejected by security policy');
        return;
      }

      if (authResult.user?.role === 'admin') {
        setSuccessMsg(`Welcome, Master Administrator ${authResult.user.username}! Redirecting to Admin Console...`);
        sessionStorage.setItem('just_logged_in_name', authResult.user?.name || username);
        setTimeout(() => {
          navigate('/admin');
        }, 600);
        return;
      }

      setSuccessMsg(`Welcome back, ${authResult.user?.name || username}! Redirecting to app...`);
      sessionStorage.setItem('just_logged_in_name', authResult.user?.name || username);

      setTimeout(() => {
        const dest = (location.state as any)?.from || '/';
        navigate(dest, { replace: true });
      }, 500);
    }, 550);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanOtp = enteredOtp.trim().replace(/\s/g, '');
    if (!cleanOtp || cleanOtp.length !== 6) {
      setError('Please enter the complete 6-digit OTP code');
      return;
    }

    const targetEmail = (email || (username.includes('@') ? username : '')).trim().toLowerCase();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const verifyRes = isSignUp
        ? verifyOtpAndRegister(targetEmail, cleanOtp)
        : verifyLoginOtpAndAuthenticate(targetEmail, cleanOtp);

      if (!verifyRes.success) {
        setError(verifyRes.error || 'OTP Verification failed');
        return;
      }

      setSuccessMsg(`🎉 Authentication successful! Welcome, ${verifyRes.user?.name}!`);
      sessionStorage.setItem('just_logged_in_name', verifyRes.user?.name || verifyRes.user?.username || 'User');

      setTimeout(() => {
        const dest = (location.state as any)?.from || '/';
        navigate(dest, { replace: true });
      }, 500);
    }, 600);
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    const targetEmail = (email || (username.includes('@') ? username : '')).trim().toLowerCase();
    const targetUsername = username.trim() || targetEmail.split('@')[0];

    const res = isSignUp
      ? await sendRegistrationOtp({
          email: targetEmail,
          username: targetUsername,
          password,
        })
      : await sendLoginOtp({
          email: targetEmail,
        });

    setIsLoading(false);

    if (res.success) {
      setIsLiveDelivery(Boolean(res.isLiveDelivery));
      setLiveOtpPreview(null);
      setResendCooldown(60);
      setOtpRemainingSeconds(300);
      if (res.isLiveDelivery) {
        setSuccessMsg(`⚡ A fresh verification OTP has been dispatched directly to your Gmail: ${targetEmail}`);
        setError(null);
      } else {
        setError(`Email could not be delivered to ${targetEmail}: Google SMTP rejected sender credentials. Please connect a 16-letter App Password.`);
        setSuccessMsg(null);
      }
    } else {
      setError(res.error || 'Unable to resend code');
    }
  };

  const handleSaveAndTestSmtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smtpUser.trim() || !smtpPassword.trim()) {
      setSmtpModalMsg({ type: 'error', text: 'Please enter both your Gmail address and 16-character Google App Password.' });
      return;
    }

    setIsTestingSmtp(true);
    setSmtpModalMsg(null);

    const testRes = await testSmtpConnection({
      user: smtpUser.trim(),
      password: smtpPassword.trim(),
      recipient: smtpTestRecipient.trim() || (email || (username.includes('@') ? username : '') || smtpUser.trim()),
    });

    setIsTestingSmtp(false);

    if (testRes.success) {
      setSmtpModalMsg({
        type: 'success',
        text: `✅ ${testRes.message || 'Gmail SMTP Connected successfully!'} Live delivery is now active.`,
      });
      const updatedStatus = await getSmtpStatus();
      setSmtpStatus(updatedStatus);
    } else {
      setSmtpModalMsg({
        type: 'error',
        text: `❌ ${testRes.error || 'Connection failed.'} ${testRes.hint || ''}`,
      });
    }
  };

  const handleInstantDemoLogin = () => {
    setIsLoading(true);
    setError(null);
    const authResult = authenticateOrRegisterUser({
      usernameOrEmail: 'alex_student',
      password: 'demopass123',
      isSignUp: false,
    });
    setIsLoading(false);
    if (!authResult.success) {
      setError(authResult.error || 'Failed to authenticate demo student');
      return;
    }
    setSuccessMsg(`Welcome, ${authResult.user?.name || 'Alex Rivera'}! Entering Neurobridge...`);
    setTimeout(() => {
      const dest = (location.state as any)?.from || '/';
      navigate(dest, { replace: true });
    }, 400);
  };

  const handleGuestLogin = () => {
    setIsLoading(true);
    setError(null);
    const guestUser = `learner_${Math.floor(100 + Math.random() * 900)}`;
    const authResult = authenticateOrRegisterUser({
      usernameOrEmail: guestUser,
      provider: 'Guest Pass',
    });
    setIsLoading(false);
    if (!authResult.success) {
      setError(authResult.error || 'Failed to enter as guest');
      return;
    }
    setSuccessMsg(`Welcome, Guest Learner! Entering Neurobridge...`);
    setTimeout(() => {
      const dest = (location.state as any)?.from || '/';
      navigate(dest, { replace: true });
    }, 400);
  };

  const handleDemoLogin = () => {
    setUsername('alex_student');
    setPassword('demopass123');
    setError(null);
    setSuccessMsg(null);
    setIsSignUp(false);
    setStep('auth');
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const authResult = authenticateOrRegisterUser({
        usernameOrEmail: `${provider.toLowerCase()}_user`,
        provider,
      });

      if (!authResult.success) {
        setError(authResult.error || 'Social sign-in rejected');
        return;
      }

      sessionStorage.setItem('just_logged_in_name', authResult.user?.name || `${provider} User`);
      setSuccessMsg(`Signed in with ${provider}! Synced with User Directory.`);
      setTimeout(() => {
        const dest = (location.state as any)?.from || '/';
        navigate(dest, { replace: true });
      }, 500);
    }, 500);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
      {/* 1. Marvel 3D Photorealistic Cinematic Engine & Particle Canvas */}
      <MarvelBackground3D />

      {/* Embedded Marvel 3D Holo Animations */}
      <style>{`
        @keyframes marvelSpinClockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes marvelSpinCounter {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes marvelArcCorePulse {
          0%, 100% {
            filter: drop-shadow(0 0 18px rgba(56, 189, 248, 0.7)) drop-shadow(0 0 45px rgba(245, 158, 11, 0.45));
            opacity: 0.92;
          }
          50% {
            filter: drop-shadow(0 0 35px rgba(56, 189, 248, 1)) drop-shadow(0 0 80px rgba(245, 158, 11, 0.8));
            opacity: 1;
          }
        }
      `}</style>
      {/* Top Bar with Back Link & Decoupled Admin Gateway Link */}
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
          id="login-back-to-app-button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#94a3b8',
            fontSize: '0.9rem',
            textDecoration: 'none',
            padding: '0.4rem 0.85rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#f59e0b';
            e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#94a3b8';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to App</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* Quick Demo Autofill button */}
          <button
            type="button"
            id="login-demo-account-button"
            onClick={handleDemoLogin}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#f59e0b',
              fontSize: '0.8rem',
              fontWeight: 500,
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            title="Autofill demo credentials"
          >
            <Sparkles size={14} />
            <span>Demo Account</span>
          </button>
        </div>
      </div>

      {/* Main 3D Perspective Reactor Dial Center Container */}
      <div
        style={{
          position: 'relative',
          width: '580px',
          height: '580px',
          maxWidth: '96vw',
          maxHeight: '96vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: '1200px',
          transform: `perspective(1200px) rotateX(${-mouseTilt.y * 14}deg) rotateY(${mouseTilt.x * 14}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)',
        }}
      >
        {/* Floating 3D Stark Marvel Hero Protocol Badge */}
        <div
          style={{
            position: 'absolute',
            top: '-26px',
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 16px 5px 6px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(9, 14, 26, 0.92)',
            border: '1px solid rgba(56, 189, 248, 0.45)',
            boxShadow: '0 0 24px rgba(56, 189, 248, 0.35), inset 0 0 12px rgba(245, 158, 11, 0.25)',
            backdropFilter: 'blur(16px)',
            transform: 'translateZ(45px)',
          }}
        >
          <MarvelAvatar hero="ironman" size="xs" title="Stark AI Protocol" />
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: '#38bdf8',
              textTransform: 'uppercase',
            }}
          >
            Stark Arc Protocol // Mark LXXXV
          </span>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 8px #10b981',
            }}
          />
        </div>

        {/* 3D Outer Rotating Quantum Gyro Ring */}
        <div
          style={{
            position: 'absolute',
            inset: '-18px',
            borderRadius: '50%',
            border: '1px dashed rgba(56, 189, 248, 0.3)',
            animation: 'marvelSpinClockwise 50s linear infinite',
            pointerEvents: 'none',
            transform: 'translateZ(-15px)',
          }}
        />

        {/* 3D Counter-Rotating Holographic Arc Segments Ring */}
        <div
          style={{
            position: 'absolute',
            inset: '6px',
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: 'rgba(245, 158, 11, 0.65)',
            borderBottomColor: 'rgba(56, 189, 248, 0.65)',
            animation: 'marvelSpinCounter 36s linear infinite',
            pointerEvents: 'none',
            filter: 'drop-shadow(0 0 10px rgba(56, 189, 248, 0.5))',
            transform: 'translateZ(-5px)',
          }}
        />

        {/* 3D Ambient Radiant Core Aura */}
        <div
          style={{
            position: 'absolute',
            width: '440px',
            height: '440px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.16) 0%, rgba(245, 158, 11, 0.12) 45%, transparent 72%)',
            pointerEvents: 'none',
            animation: 'marvelArcCorePulse 4s ease-in-out infinite',
            transform: 'translateZ(-25px)',
          }}
        />

        {/* SVG Circular Dial Ticks */}
        <svg
          viewBox="0 0 540 540"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            userSelect: 'none',
            transform: 'translateZ(5px)',
          }}
        >
          {ticks.map((tick) => {
            const cx = 270;
            const cy = 270;
            const rInner = 208;
            const rOuter = 236;
            const rad = (tick.angle * Math.PI) / 180;
            const x1 = cx + rInner * Math.cos(rad);
            const y1 = cy + rInner * Math.sin(rad);
            const x2 = cx + rOuter * Math.cos(rad);
            const y2 = cy + rOuter * Math.sin(rad);

            return (
              <line
                key={tick.index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={tick.color}
                strokeWidth={tick.isOrangeGlow ? 4.5 : 4.0}
                strokeLinecap="round"
                opacity={tick.opacity}
                style={{
                  filter: tick.filter,
                  transition: 'stroke 0.3s ease, filter 0.3s ease',
                }}
              />
            );
          })}
        </svg>

        {/* Center Form Container with Holographic 3D Floating Glass & HUD Brackets */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            width: '350px',
            maxWidth: '88%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            backgroundColor: 'rgba(9, 14, 25, 0.88)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '24px',
            padding: '24px 20px 20px 20px',
            boxShadow: '0 0 45px rgba(2, 132, 199, 0.28), 0 20px 50px rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(22px)',
            WebkitBackdropFilter: 'blur(22px)',
            transform: 'translateZ(35px)',
          }}
        >
          {/* Holographic HUD Top-Left Corner Bracket */}
          <div
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              width: '12px',
              height: '12px',
              borderTop: '2px solid #38bdf8',
              borderLeft: '2px solid #38bdf8',
              pointerEvents: 'none',
              filter: 'drop-shadow(0 0 4px #38bdf8)',
            }}
          />
          {/* Holographic HUD Top-Right Corner Bracket */}
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '12px',
              height: '12px',
              borderTop: '2px solid #38bdf8',
              borderRight: '2px solid #38bdf8',
              pointerEvents: 'none',
              filter: 'drop-shadow(0 0 4px #38bdf8)',
            }}
          />
          {/* Holographic HUD Bottom-Left Corner Bracket */}
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              left: '8px',
              width: '12px',
              height: '12px',
              borderBottom: '2px solid #f59e0b',
              borderLeft: '2px solid #f59e0b',
              pointerEvents: 'none',
              filter: 'drop-shadow(0 0 4px #f59e0b)',
            }}
          />
          {/* Holographic HUD Bottom-Right Corner Bracket */}
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              width: '12px',
              height: '12px',
              borderBottom: '2px solid #f59e0b',
              borderRight: '2px solid #f59e0b',
              pointerEvents: 'none',
              filter: 'drop-shadow(0 0 4px #f59e0b)',
            }}
          />

          {/* Header Title */}
          <h1
            style={{
              color: '#f59e0b',
              fontSize: '1.9rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginBottom: '1rem',
              textShadow: '0 0 20px rgba(245, 158, 11, 0.45)',
              margin: '0 0 0.85rem 0',
            }}
          >
            {step === 'otp' ? 'Verify Email' : isSignUp ? 'Sign Up' : 'Login'}
          </h1>

          {/* Feedback messages */}
          {error && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                fontSize: '0.78rem',
                padding: '0.45rem 0.75rem',
                borderRadius: '8px',
                marginBottom: '0.75rem',
                justifyContent: 'center',
                textAlign: 'left',
              }}
            >
              <AlertCircle size={14} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                color: '#86efac',
                fontSize: '0.78rem',
                padding: '0.45rem 0.75rem',
                borderRadius: '8px',
                marginBottom: '0.75rem',
                justifyContent: 'center',
                textAlign: 'left',
              }}
            >
              <CheckCircle2 size={14} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* STEP 2: EMAIL OTP VERIFICATION FORM */}
          {step === 'otp' ? (
            <form
              onSubmit={handleVerifyOtp}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 0.2rem 0' }}>
                  Verification passcode for: <br />
                  <strong style={{ color: '#38bdf8', fontSize: '0.88rem' }}>{email || username}</strong>
                </p>
              </div>

              {/* Live Delivery Status Indicator */}
              {isLiveDelivery ? (
                <div
                  style={{
                    backgroundColor: 'rgba(34, 197, 94, 0.12)',
                    border: '1px solid rgba(34, 197, 94, 0.35)',
                    borderRadius: '10px',
                    padding: '0.55rem 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.74rem',
                    color: '#86efac',
                    textAlign: 'left',
                  }}
                >
                  <CheckCircle size={15} style={{ flexShrink: 0, color: '#22c55e' }} />
                  <div>
                    <strong>Dispatched directly to your Gmail inbox!</strong>
                    <div style={{ color: '#bbf7d0', fontSize: '0.7rem', marginTop: '2px' }}>
                      Please check your Inbox (or Spam / Promotions tab if not seen immediately).
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    backgroundColor: 'rgba(245, 158, 11, 0.12)',
                    border: '1px solid rgba(245, 158, 11, 0.35)',
                    borderRadius: '10px',
                    padding: '0.65rem 0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    fontSize: '0.74rem',
                    color: '#fde68a',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertCircle size={15} style={{ flexShrink: 0, color: '#f59e0b' }} />
                    <strong style={{ color: '#fbbf24' }}>
                      {smtpUser && smtpUser.includes('@') ? 'Google App Password Required' : 'Gmail SMTP Sender Not Connected'}
                    </strong>
                  </div>
                  <div style={{ color: '#cbd5e1', fontSize: '0.72rem', lineHeight: 1.45 }}>
                    {smtpUser && smtpUser.includes('@') ? (
                      <>
                        Google requires a <strong>16-letter App Password</strong> (not your normal password) to send emails from{' '}
                        <span style={{ color: '#38bdf8' }}>{smtpUser}</span>.
                      </>
                    ) : (
                      'To receive real OTPs in your actual Gmail inbox, connect your Gmail sender using a 16-character Google App Password.'
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setSmtpModalOpen(true);
                        setSmtpModalMsg(null);
                      }}
                      style={{
                        background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.25) 0%, rgba(234, 88, 12, 0.25) 100%)',
                        border: '1px solid rgba(245, 158, 11, 0.5)',
                        color: '#f59e0b',
                        fontSize: '0.71rem',
                        fontWeight: 700,
                        borderRadius: '6px',
                        padding: '4px 10px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <Settings size={12} />
                      <span>Connect 16-Letter App Password</span>
                    </button>
                  </div>
                </div>
              )}

              {/* OTP Input Field */}
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  id="registration-otp-input"
                  type="text"
                  maxLength={6}
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="• • • • • •"
                  aria-label="6-digit OTP code"
                  autoFocus
                  required
                  style={{
                    width: '100%',
                    height: '46px',
                    backgroundColor: '#161f31',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    borderRadius: '9999px',
                    padding: '0 16px',
                    color: '#f59e0b',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    letterSpacing: '0.35em',
                    textAlign: 'center',
                    outline: 'none',
                    boxShadow: '0 0 16px rgba(245, 158, 11, 0.15), inset 0 2px 4px rgba(0,0,0,0.4)',
                  }}
                />
              </div>

              {/* Real Gmail Manual Entry Instruction */}
              <div
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.74rem',
                  color: '#94a3b8',
                  textAlign: 'left',
                }}
              >
                <Mail size={14} style={{ flexShrink: 0, color: '#38bdf8' }} />
                <span>
                  Open your Gmail inbox (or Spam folder) for{' '}
                  <strong style={{ color: '#38bdf8' }}>{email || (username.includes('@') ? username : email)}</strong>, find the
                  6-digit code, and type it above.
                </span>
              </div>

              {/* Countdown & Resend Option */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.75rem',
                  color: '#64748b',
                  padding: '0 4px',
                }}
              >
                <span>Expires in: {formatTimer(otpRemainingSeconds)}</span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || isLoading}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: resendCooldown > 0 ? '#475569' : '#f59e0b',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px',
                  }}
                >
                  <RefreshCw size={11} />
                  <span>{resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend Code'}</span>
                </button>
              </div>

              {/* Verify Button */}
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '0.25rem' }}>
                <button
                  id="verify-otp-submit-button"
                  type="submit"
                  disabled={isLoading || enteredOtp.length !== 6}
                  style={{
                    position: 'relative',
                    width: '230px',
                    height: '42px',
                    borderRadius: '9999px',
                    border: 'none',
                    cursor: isLoading || enteredOtp.length !== 6 ? 'not-allowed' : 'pointer',
                    background:
                      enteredOtp.length !== 6
                        ? '#334155'
                        : 'linear-gradient(90deg, #f59e0b 0%, #ff8f00 68%, #e65100 100%)',
                    boxShadow:
                      enteredOtp.length === 6 ? '0 0 25px rgba(245, 158, 11, 0.65)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span
                    style={{
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      paddingRight: '20px',
                      zIndex: 2,
                    }}
                  >
                    {isLoading ? 'VERIFYING...' : 'CONFIRM OTP'}
                  </span>
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      bottom: 0,
                      width: '40px',
                      backgroundColor: '#151e2f',
                      clipPath: 'polygon(35% 0%, 100% 0%, 100% 100%, 0% 100%)',
                      zIndex: 1,
                    }}
                  />
                </button>
              </div>

              {/* Back to Edit Details */}
              <button
                type="button"
                onClick={() => {
                  setStep('auth');
                  setError(null);
                  setSuccessMsg(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  marginTop: '0.25rem',
                  textDecoration: 'underline',
                }}
              >
                ← Back to Edit Details
              </button>
            </form>
          ) : (
            /* STEP 1: CREDENTIALS FORM (LOGIN OR REGISTRATION ENTRY) */
            <form
              onSubmit={handleSubmit}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              {/* Active User Session Notice */}
              {activeUser && (
                <div
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    borderRadius: '14px',
                    padding: '12px 14px',
                    marginBottom: '0.5rem',
                    textAlign: 'center',
                    boxShadow: '0 0 16px rgba(56, 189, 248, 0.15)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>
                    <Shield size={14} />
                    <span>Active Authenticated Session</span>
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
                    {activeUser.name || activeUser.username}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    @{activeUser.username} · Role: {activeUser.role}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <button
                      type="button"
                      id="login-continue-app-btn"
                      onClick={() => navigate((location.state as any)?.from || '/', { replace: true })}
                      style={{
                        flex: 1,
                        padding: '7px 10px',
                        background: 'linear-gradient(90deg, #0284c7 0%, #38bdf8 100%)',
                        color: '#ffffff',
                        borderRadius: '8px',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        boxShadow: '0 0 12px rgba(56, 189, 248, 0.4)',
                      }}
                    >
                      Enter App →
                    </button>
                    <button
                      type="button"
                      id="login-signout-btn"
                      onClick={() => {
                        logoutAuthUser();
                        setActiveUser(null);
                      }}
                      style={{
                        padding: '7px 12px',
                        background: 'rgba(239, 68, 68, 0.15)',
                        color: '#f87171',
                        borderRadius: '8px',
                        border: '1px solid rgba(239, 68, 68, 0.35)',
                        fontWeight: 600,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <LogOut size={13} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Instant 1-Click Access Options */}
              {!isSignUp && (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '0.4rem' }}>
                  <button
                    type="button"
                    id="login-instant-demo-btn"
                    onClick={handleInstantDemoLogin}
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '9px 14px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.25) 0%, rgba(56, 189, 248, 0.18) 100%)',
                      border: '1px solid rgba(56, 189, 248, 0.5)',
                      color: '#38bdf8',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: isLoading ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 0 16px rgba(56, 189, 248, 0.2)',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    <Sparkles size={15} color="#38bdf8" />
                    <span>⚡ Instant Student Access (1-Click Demo)</span>
                  </button>


                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      margin: '4px 0',
                      color: '#64748b',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                    }}
                  >
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
                    <span style={{ padding: '0 8px' }}>OR LOGIN WITH ACCOUNT</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
                  </div>
                </div>
              )}

              {/* Login Method Selector (Password vs Direct Gmail OTP) */}
              {!isSignUp && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'rgba(15, 23, 42, 0.75)',
                    padding: '3px',
                    borderRadius: '9999px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    marginBottom: '0.2rem',
                    gap: '4px',
                    width: '100%',
                  }}
                >
                  <button
                    type="button"
                    id="login-method-password-button"
                    onClick={() => setLoginMethod('password')}
                    style={{
                      flex: 1,
                      padding: '5px 0',
                      borderRadius: '9999px',
                      border: 'none',
                      background: loginMethod === 'password' ? 'rgba(56, 189, 248, 0.22)' : 'transparent',
                      color: loginMethod === 'password' ? '#38bdf8' : '#64748b',
                      fontWeight: loginMethod === 'password' ? 700 : 500,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    Password Login
                  </button>
                  <button
                    type="button"
                    id="login-method-otp-button"
                    onClick={() => setLoginMethod('otp')}
                    style={{
                      flex: 1,
                      padding: '5px 0',
                      borderRadius: '9999px',
                      border: 'none',
                      background: loginMethod === 'otp' ? 'rgba(245, 158, 11, 0.22)' : 'transparent',
                      color: loginMethod === 'otp' ? '#f59e0b' : '#64748b',
                      fontWeight: loginMethod === 'otp' ? 700 : 500,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    ⚡ Direct Gmail OTP
                  </button>
                </div>
              )}

              {/* In Direct Gmail OTP Login Mode */}
              {!isSignUp && loginMethod === 'otp' ? (
                <div style={{ position: 'relative', width: '100%' }}>
                  <input
                    id="login-email-otp-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your Gmail (e.g. name@gmail.com)"
                    aria-label="Gmail address for direct OTP"
                    required
                    style={{
                      width: '100%',
                      height: '42px',
                      backgroundColor: '#161f31',
                      border: '1px solid rgba(245, 158, 11, 0.45)',
                      borderRadius: '9999px',
                      padding: '0 40px 0 16px',
                      color: '#f1f5f9',
                      fontSize: '0.9rem',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 0 12px rgba(245, 158, 11, 0.15), inset 0 2px 4px rgba(0, 0, 0, 0.3)',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(245, 158, 11, 0.8)';
                      e.target.style.boxShadow =
                        '0 0 16px rgba(245, 158, 11, 0.35), inset 0 2px 4px rgba(0,0,0,0.3)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(245, 158, 11, 0.45)';
                      e.target.style.boxShadow = '0 0 12px rgba(245, 158, 11, 0.15), inset 0 2px 4px rgba(0, 0, 0, 0.3)';
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      right: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#f59e0b',
                      pointerEvents: 'none',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Mail size={16} />
                  </span>
                </div>
              ) : (
                <>
                  {/* Username Input */}
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      id="login-username-input"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={isSignUp ? 'Full Name or Username' : 'Username or Email'}
                      aria-label="Username or Email"
                      required
                      style={{
                        width: '100%',
                        height: '42px',
                        backgroundColor: '#161f31',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '9999px',
                        padding: '0 40px 0 16px',
                        color: '#f1f5f9',
                        fontSize: '0.9rem',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(245, 158, 11, 0.6)';
                        e.target.style.boxShadow =
                          '0 0 12px rgba(245, 158, 11, 0.25), inset 0 2px 4px rgba(0,0,0,0.3)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                        e.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.3)';
                      }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        right: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#64748b',
                        pointerEvents: 'none',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <User size={16} />
                    </span>
                  </div>

                  {/* Dedicated Email Input when in Sign Up Mode */}
                  {isSignUp && (
                    <div style={{ position: 'relative', width: '100%' }}>
                      <input
                        id="registration-email-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Gmail / Email (to receive OTP)"
                        aria-label="Email Address for OTP"
                        required
                        style={{
                          width: '100%',
                          height: '42px',
                          backgroundColor: '#161f31',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '9999px',
                          padding: '0 40px 0 16px',
                          color: '#f1f5f9',
                          fontSize: '0.9rem',
                          outline: 'none',
                          transition: 'all 0.2s ease',
                          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'rgba(245, 158, 11, 0.6)';
                          e.target.style.boxShadow =
                            '0 0 12px rgba(245, 158, 11, 0.25), inset 0 2px 4px rgba(0,0,0,0.3)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                          e.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.3)';
                        }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          right: '14px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#64748b',
                          pointerEvents: 'none',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Mail size={16} />
                      </span>
                    </div>
                  )}

                  {/* Password Input */}
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      id="login-password-input"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      aria-label="Password"
                      required
                      style={{
                        width: '100%',
                        height: '42px',
                        backgroundColor: '#161f31',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '9999px',
                        padding: '0 40px 0 16px',
                        color: '#f1f5f9',
                        fontSize: '0.9rem',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(245, 158, 11, 0.6)';
                        e.target.style.boxShadow =
                          '0 0 12px rgba(245, 158, 11, 0.25), inset 0 2px 4px rgba(0,0,0,0.3)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                        e.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.3)';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      style={{
                        position: 'absolute',
                        right: '12px',
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
                      {showPassword ? <EyeOff size={16} /> : <Lock size={16} />}
                    </button>
                  </div>
                </>
              )}

              {/* Forgot your password link */}
              {!isSignUp && loginMethod === 'password' && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    marginTop: '0.1rem',
                    marginBottom: '0.2rem',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setLoginMethod('otp')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '2px 6px',
                      transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#f59e0b')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                  >
                    <span>Forgot password? Log in with Gmail OTP</span>
                    <Mail size={13} style={{ color: '#d97706' }} />
                  </button>
                </div>
              )}

              {/* Action Button */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                <button
                  id="login-submit-button"
                  type="submit"
                  disabled={isLoading}
                  style={{
                    position: 'relative',
                    width: '230px',
                    height: '42px',
                    borderRadius: '9999px',
                    border: 'none',
                    cursor: isLoading ? 'wait' : 'pointer',
                    background: 'linear-gradient(90deg, #f59e0b 0%, #ff8f00 68%, #e65100 100%)',
                    boxShadow: '0 0 25px rgba(245, 158, 11, 0.65), 0 0 45px rgba(245, 158, 11, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    transition: 'transform 0.15s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.03)';
                    e.currentTarget.style.boxShadow =
                      '0 0 32px rgba(245, 158, 11, 0.8), 0 0 50px rgba(245, 158, 11, 0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow =
                      '0 0 25px rgba(245, 158, 11, 0.65), 0 0 45px rgba(245, 158, 11, 0.25)';
                  }}
                >
                  <span
                    style={{
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.86rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      paddingRight: '26px',
                      zIndex: 2,
                      textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    {isLoading
                      ? 'PROCESSING...'
                      : isSignUp
                      ? 'SEND REGISTRATION OTP'
                      : loginMethod === 'otp'
                      ? 'SEND OTP TO GMAIL'
                      : 'LOGIN'}
                  </span>

                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      bottom: 0,
                      width: '46px',
                      backgroundColor: '#151e2f',
                      clipPath: 'polygon(35% 0%, 100% 0%, 100% 100%, 0% 100%)',
                      zIndex: 1,
                    }}
                  />
                </button>
              </div>
            </form>
          )}

          {/* Social Logins & Sign Up Toggle */}
          {step === 'auth' && (
            <div
              style={{
                marginTop: '1.15rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.55rem',
              }}
            >


              {/* Sign Up / Login Toggle */}
              <button
                type="button"
                id="login-toggle-signup-button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setStep('auth');
                  setError(null);
                  setSuccessMsg(null);
                }}
                style={{
                  marginTop: '0.4rem',
                  background: 'none',
                  border: 'none',
                  color: '#f59e0b',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'opacity 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
              >
                {isSignUp ? 'Already have an account? Login' : 'New User? Sign Up with Email OTP'}
              </button>

              {/* Security Shield notice */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '0.5rem',
                  fontSize: '0.72rem',
                  color: '#94a3b8',
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    boxShadow: '0 0 6px #10b981',
                  }}
                />
                <span>Neurobridge Protected Gateway</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. GMAIL SMTP DIRECT DISPATCH SETUP MODAL */}
      {smtpModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="smtp-modal-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(3, 7, 18, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            padding: '1.25rem',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSmtpModalOpen(false);
              setSmtpModalMsg(null);
            }
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '520px',
              backgroundColor: '#0c1220',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: '20px',
              padding: '24px 26px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(56, 189, 248, 0.2)',
              color: '#f8fafc',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid #38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38bdf8',
                  }}
                >
                  <Mail size={20} />
                </div>
                <div>
                  <h2 id="smtp-modal-title" style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                    Gmail SMTP Direct Dispatch
                  </h2>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                    Deliver OTP verification codes directly to real Gmail inboxes
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSmtpModalOpen(false);
                  setSmtpModalMsg(null);
                }}
                aria-label="Close dialog"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Current Status Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '10px',
                backgroundColor: smtpStatus?.configured ? 'rgba(34, 197, 94, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                border: `1px solid ${smtpStatus?.configured ? 'rgba(34, 197, 94, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                marginBottom: '16px',
                fontSize: '0.78rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: smtpStatus?.configured ? '#22c55e' : '#f59e0b',
                    boxShadow: `0 0 8px ${smtpStatus?.configured ? '#22c55e' : '#f59e0b'}`,
                  }}
                />
                <span style={{ color: smtpStatus?.configured ? '#86efac' : '#fde68a', fontWeight: 600 }}>
                  {smtpStatus?.configured ? `Active Sender: ${smtpStatus.user}` : 'Status: Gmail Sender Not Configured'}
                </span>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Port 587 (TLS)</span>
            </div>

            {/* 3-Step Setup Instructions Card */}
            <div
              style={{
                backgroundColor: '#111827',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '12px 14px',
                marginBottom: '16px',
                fontSize: '0.75rem',
                lineHeight: 1.5,
              }}
            >
              <div style={{ color: '#38bdf8', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Sparkles size={13} />
                <span>How to connect your Gmail in 30 seconds:</span>
              </div>
              <ol style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>
                  Turn on <strong>2-Step Verification</strong> on your Google Account:{' '}
                  <a
                    href="https://myaccount.google.com/security"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#38bdf8', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
                  >
                    Google Security <ExternalLink size={10} />
                  </a>
                </li>
                <li>
                  Create a 16-character <strong>Google App Password</strong>:{' '}
                  <a
                    href="https://myaccount.google.com/apppasswords"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#f59e0b', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}
                  >
                    App Passwords Portal <ExternalLink size={10} />
                  </a>{' '}
                  (Under <em>App name</em> type <strong>Neurobridge</strong> and click <strong>Create</strong>)
                </li>
                <li>Copy the 16 letters (e.g. <code>abcd efgh ijkl mnop</code>) and paste below.</li>
              </ol>
              <div style={{ marginTop: '10px' }}>
                <a
                  href="https://myaccount.google.com/apppasswords"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'rgba(245, 158, 11, 0.2)',
                    border: '1px solid rgba(245, 158, 11, 0.45)',
                    borderRadius: '6px',
                    padding: '5px 10px',
                    color: '#fbbf24',
                    fontSize: '0.73rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  <KeyRound size={12} />
                  <span>Generate Google App Password (1-Click)</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>

            {/* Feedback Message */}
            {smtpModalMsg && (
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  lineHeight: 1.4,
                  marginBottom: '14px',
                  backgroundColor: smtpModalMsg.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: `1px solid ${smtpModalMsg.type === 'success' ? 'rgba(34, 197, 94, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`,
                  color: smtpModalMsg.type === 'success' ? '#86efac' : '#fca5a5',
                  whiteSpace: 'pre-line',
                }}
              >
                {smtpModalMsg.text}
              </div>
            )}

            {/* Credentials Configuration Form */}
            <form onSubmit={handleSaveAndTestSmtp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '4px', textAlign: 'left', fontWeight: 600 }}>
                  Sender Gmail Address (Your Gmail)
                </label>
                <input
                  id="smtp-user-input"
                  type="email"
                  value={smtpUser}
                  onChange={(e) => setSmtpUser(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                  required
                  style={{
                    width: '100%',
                    height: '38px',
                    backgroundColor: '#161f31',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '0 12px',
                    color: '#f8fafc',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '4px', textAlign: 'left', fontWeight: 600 }}>
                  Google App Password (16 letters, NOT normal account password)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="smtp-password-input"
                    type={showSmtpPass ? 'text' : 'password'}
                    value={smtpPassword}
                    onChange={(e) => setSmtpPassword(e.target.value)}
                    placeholder="e.g. abcd efgh ijkl mnop"
                    required
                    style={{
                      width: '100%',
                      height: '38px',
                      backgroundColor: '#161f31',
                      border: `1px solid ${
                        smtpPassword.trim() && (smtpPassword.replace(/\s/g, '').length !== 16 || /[^a-zA-Z]/.test(smtpPassword.replace(/\s/g, '')))
                          ? 'rgba(239, 68, 68, 0.6)'
                          : 'rgba(255, 255, 255, 0.15)'
                      }`,
                      borderRadius: '8px',
                      padding: '0 36px 0 12px',
                      color: '#f8fafc',
                      fontSize: '0.85rem',
                      letterSpacing: showSmtpPass ? '0.05em' : '0.1em',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSmtpPass(!showSmtpPass)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '2px',
                    }}
                  >
                    {showSmtpPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {/* Real-time App Password Format Validator */}
                {smtpPassword.trim().length > 0 && (
                  (() => {
                    const clean = smtpPassword.replace(/\s/g, '');
                    const isNormalPass = clean.length !== 16 || /[^a-zA-Z]/.test(clean);
                    if (isNormalPass) {
                      return (
                        <div style={{ marginTop: '5px', padding: '5px 8px', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', fontSize: '0.71rem', textAlign: 'left' }}>
                          ⚠️ <strong>Personal password detected ({clean.length} chars)!</strong> Google rejects personal passwords on SMTP. You must generate a 16-letter App Password (e.g. <code>abcd efgh ijkl mnop</code>).
                        </div>
                      );
                    }
                    return (
                      <div style={{ marginTop: '4px', color: '#86efac', fontSize: '0.71rem', display: 'flex', alignItems: 'center', gap: '4px', textAlign: 'left' }}>
                        <CheckCircle size={12} color="#22c55e" />
                        <span>Valid 16-character Google App Password format!</span>
                      </div>
                    );
                  })()
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', textAlign: 'left' }}>
                  Send Test Ping To (Optional recipient Gmail):
                </label>
                <input
                  id="smtp-recipient-test-input"
                  type="email"
                  value={smtpTestRecipient}
                  onChange={(e) => setSmtpTestRecipient(e.target.value)}
                  placeholder={smtpUser || 'recipient@gmail.com'}
                  style={{
                    width: '100%',
                    height: '36px',
                    backgroundColor: '#111827',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '0 12px',
                    color: '#cbd5e1',
                    fontSize: '0.82rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setSmtpModalOpen(false);
                    setSmtpModalMsg(null);
                  }}
                  style={{
                    flex: 1,
                    height: '38px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#94a3b8',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
                <button
                  id="smtp-save-test-submit-button"
                  type="submit"
                  disabled={isTestingSmtp}
                  style={{
                    flex: 2,
                    height: '38px',
                    background: 'linear-gradient(90deg, #f59e0b 0%, #ea580c 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: isTestingSmtp ? 'wait' : 'pointer',
                    boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  {isTestingSmtp ? (
                    <span>Verifying Handshake...</span>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Connect & Send Test Ping</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
