import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Shield,
  KeyRound,
  RefreshCw,
  Send,
  Check,
  X,
  Radio,
  CheckCircle,
  LogOut,
  Clock,
  Globe,
  Zap,
  Wifi,
  WifiOff,
  Download,
} from 'lucide-react';
import {
  authenticateOrRegisterUser,
  getCurrentAuthUser,
  logoutAuthUser,
  type AuthSessionUser,
} from '../services/userService';
import {
  getAppMode,
  setAppMode,
  loginOffline,
  isBrowserNetworkOnline,
  type AppMode,
} from '../services/offlineService';
import {
  sendRegistrationOtp,
  sendLoginOtp,
  verifyLoginOtpAndAuthenticate,
  verifyOtpAndRegister,
  sendDemoOtp,
  verifyDemoOtpAndAuthenticate,
  isDemoEmailAlreadyUsed,
  OTP_DEMO_VALIDITY_SECONDS,
  getPendingRegistration,
  type DispatchedOtpNotification,
} from '../security/otpService';
import { MarvelBackground3D } from '../components/ui/MarvelBackground3D';
import { MarvelAvatar } from '../components/ui/MarvelAvatar';
import { AppDownloadModal } from '../components/ui/AppDownloadModal';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeUser, setActiveUser] = useState<AuthSessionUser | null>(() => getCurrentAuthUser());
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState<'auth' | 'otp'>('auth');
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');

  // Dual Operating Mode: 'online' | 'offline'
  const [appMode, setAppModeState] = useState<AppMode>(() => getAppMode());
  const [isNetworkOnline, setIsNetworkOnline] = useState<boolean>(() => isBrowserNetworkOnline());
  const [offlineName, setOfflineName] = useState<string>('Offline Scholar');
  const [downloadModalOpen, setDownloadModalOpen] = useState<boolean>(false);

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

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Demo Access Modal State (Gmail + 1-Minute OTP, strictly single-use per Gmail)
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoEmail, setDemoEmail] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [demoStep, setDemoStep] = useState<'email' | 'otp'>('email');
  const [demoTimer, setDemoTimer] = useState(OTP_DEMO_VALIDITY_SECONDS);
  const [demoError, setDemoError] = useState<string | null>(null);
  const [demoSuccess, setDemoSuccess] = useState<string | null>(null);
  const [isDemoSubmitting, setIsDemoSubmitting] = useState(false);

  // Demo 60-second OTP countdown timer
  useEffect(() => {
    if (!demoModalOpen || demoStep !== 'otp') return;

    const interval = setInterval(() => {
      setDemoTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [demoModalOpen, demoStep]);

  // Countdown timer for OTP expiry and resend cooldown
  useEffect(() => {
    if (step !== 'otp') return;

    const interval = setInterval(() => {
      setOtpRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  // Reactive listener for application mode, network connectivity, and session changes
  useEffect(() => {
    const handleAuthChange = () => {
      setActiveUser(getCurrentAuthUser());
    };
    const handleModeChange = (e: any) => {
      if (e.detail?.mode) {
        setAppModeState(e.detail.mode);
      }
    };
    const handleOnline = () => setIsNetworkOnline(true);
    const handleOffline = () => setIsNetworkOnline(false);

    window.addEventListener('neurobridge_auth_changed', handleAuthChange);
    window.addEventListener('neurobridge_mode_changed', handleModeChange);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('neurobridge_auth_changed', handleAuthChange);
      window.removeEventListener('neurobridge_mode_changed', handleModeChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleToggleMode = (targetMode: AppMode) => {
    setAppModeState(targetMode);
    setAppMode(targetMode);
    setError(null);
    setSuccessMsg(
      targetMode === 'offline'
        ? '⚡ Offline Mode activated: 100% In-Browser features ready without internet or server.'
        : '🌐 Online Mode activated: Connected to Cloud API & live authentication.'
    );
  };

  const handleOfflineLaunch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg('⚡ Initializing Offline Workspace...');

    setTimeout(() => {
      const studentName = (offlineName || username || 'Offline Scholar').trim();
      const user = loginOffline(studentName);
      sessionStorage.setItem('just_logged_in_name', user.name || studentName);
      setSuccessMsg(`⚡ Welcome, ${user.name}! Offline mode initialized.`);
      setIsLoading(false);

      setTimeout(() => {
        const dest = (location.state as any)?.from || '/';
        navigate(dest, { replace: true });
      }, 400);
    }, 450);
  };

  // 54 tick marks around the dial ring with bright neon luminescence
  const TOTAL_TICKS = 54;
  const ticks = Array.from({ length: TOTAL_TICKS }, (_, i) => {
    const angle = (i * 360) / TOTAL_TICKS;
    const isOrangeGlow = angle >= 110 && angle <= 165;
    const isDimmed = angle > 165 && angle < 235;

    let color = '#38bdf8';
    let filter = 'drop-shadow(0 0 6px rgba(56, 189, 248, 0.9))';
    let opacity = 0.9;

    if (isOrangeGlow) {
      color = '#f59e0b';
      filter = 'drop-shadow(0 0 8px #f59e0b) drop-shadow(0 0 16px rgba(245, 158, 11, 0.8))';
      opacity = 1;
    } else if (isDimmed) {
      color = 'rgba(56, 189, 248, 0.45)';
      filter = 'drop-shadow(0 0 4px rgba(56, 189, 248, 0.5))';
      opacity = 0.55;
    } else if (angle >= 235 && angle <= 330) {
      opacity = 1;
      color = '#e0f2fe';
      filter = 'drop-shadow(0 0 8px #38bdf8) drop-shadow(0 0 14px rgba(224, 242, 254, 0.8))';
    } else {
      opacity = 0.85;
      color = '#38bdf8';
      filter = 'drop-shadow(0 0 6px rgba(56, 189, 248, 0.75))';
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
      setLiveOtpPreview(otpRes.otpPreview || null);
      setOtpRemainingSeconds(300);
      setResendCooldown(60);
      setStep('otp');

      if (otpRes.isLiveDelivery) {
        setSuccessMsg(`⚡ Verification code dispatched directly to your Gmail: ${regEmail}! Please check your Inbox (or Spam/Promotions folder).`);
        setError(null);
      } else {
        setSuccessMsg(null);
        setError(`Notice: Live email delivery encountered an issue (${otpRes.message || 'Backend offline'}). Instant verification passcode is provided below.`);
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
      setLiveOtpPreview(otpRes.otpPreview || null);
      setOtpRemainingSeconds(300);
      setResendCooldown(60);
      setStep('otp');

      if (otpRes.isLiveDelivery) {
        setSuccessMsg(`⚡ Login code dispatched directly to your Gmail: ${loginEmail}! Please check your Inbox (or Spam/Promotions folder).`);
        setError(null);
      } else {
        setSuccessMsg(null);
        setError(`Notice: Live email delivery encountered an issue (${otpRes.message || 'Backend offline'}). Instant verification passcode is provided below.`);
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

    const pending = getPendingRegistration();
    const targetEmail = (pending?.email || email || (username.includes('@') ? username : '')).trim().toLowerCase();
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

    const pending = getPendingRegistration();
    const targetEmail = (pending?.email || email || (username.includes('@') ? username : '')).trim().toLowerCase();
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
      setLiveOtpPreview(res.otpPreview || null);
      setResendCooldown(60);
      setOtpRemainingSeconds(300);
      if (res.isLiveDelivery) {
        setSuccessMsg(`⚡ A fresh verification OTP has been dispatched directly to your Gmail: ${targetEmail}`);
        setError(null);
      } else {
        setSuccessMsg(`⚡ Fresh OTP generated: ${res.otpPreview}`);
        setError(null);
      }
    } else {
      setError(res.error || 'Unable to resend code');
    }
  };

  const handleOpenDemoModal = () => {
    setDemoModalOpen(true);
    setDemoStep('email');
    setDemoEmail('');
    setDemoOtp('');
    setDemoError(null);
    setDemoSuccess(null);
    setDemoTimer(OTP_DEMO_VALIDITY_SECONDS);
  };

  const handleInstantDemoLogin = () => {
    handleOpenDemoModal();
  };

  const handleDemoLogin = () => {
    handleOpenDemoModal();
  };

  const handleSendDemoOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setDemoError(null);
    setDemoSuccess(null);
    const clean = demoEmail.trim().toLowerCase();

    if (!clean || !clean.includes('@')) {
      setDemoError('Please enter a valid Gmail address to receive your 1-minute demo passcode.');
      return;
    }

    // Single-use Gmail rule enforcement
    if (isDemoEmailAlreadyUsed(clean)) {
      setDemoError(
        `❌ This Gmail address (${clean}) has already consumed its one-time demo access. The demo can only be used once per Gmail. Please use a different Gmail address to test the demo.`
      );
      return;
    }

    setIsDemoSubmitting(true);
    try {
      const res = await sendDemoOtp({ email: clean });
      setIsDemoSubmitting(false);

      if (!res.success) {
        setDemoError(res.error || 'Failed to dispatch demo passcode.');
        return;
      }

      setDemoStep('otp');
      setDemoTimer(OTP_DEMO_VALIDITY_SECONDS);
      if (res.isLiveDelivery) {
        setDemoSuccess(`⚡ 6-digit passcode dispatched directly to your Gmail: ${clean}! Valid for 60 seconds.`);
      } else {
        setDemoSuccess(`Demo passcode active. (Live delivery note: ${res.message || 'Render backend is awake or warming up.'}).`);
        if (res.otpPreview) {
          setDemoOtp(res.otpPreview);
        }
      }
    } catch (err: any) {
      setIsDemoSubmitting(false);
      setDemoError('Network error connecting to verification service.');
    }
  };

  const handleVerifyDemoOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setDemoError(null);

    if (demoTimer <= 0) {
      setDemoError('❌ Demo passcode has expired! (1-minute limit reached). Please request a new code with another Gmail address.');
      return;
    }

    if (!demoOtp.trim()) {
      setDemoError('Please enter the 6-digit passcode sent to your Gmail.');
      return;
    }

    setIsDemoSubmitting(true);
    const res = verifyDemoOtpAndAuthenticate(demoEmail, demoOtp);
    setIsDemoSubmitting(false);

    if (!res.success) {
      setDemoError(res.error || 'Verification failed. Please check the code.');
      return;
    }

    setDemoSuccess('🎉 Demo Passcode Verified! Welcome to Neurobridge.');
    sessionStorage.setItem('just_logged_in_name', `Demo Student (${demoEmail.split('@')[0]})`);
    setTimeout(() => {
      const dest = (location.state as any)?.from || '/';
      navigate(dest, { replace: true });
    }, 500);
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
        background: 'radial-gradient(circle at 50% 40%, #0d1629 0%, #080f1e 50%, #040813 100%)',
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
      {/* 1. Marvel 3D Photorealistic Luminous Engine & Particle Canvas */}
      <MarvelBackground3D variant="login" />

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
      {/* Top Bar with Demo Mode Action */}
      <div
        style={{
          position: 'absolute',
          top: '1.25rem',
          right: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          zIndex: 40,
        }}
      >
        {/* Top-Right Online/Offline Mode Toggle Switch */}
        <div
          role="radiogroup"
          aria-label="Operating Mode Switch"
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(8, 14, 28, 0.92)',
            borderRadius: '9999px',
            padding: '3px',
            border: appMode === 'offline' ? '1.5px solid rgba(245, 158, 11, 0.65)' : '1.5px solid rgba(56, 189, 248, 0.6)',
            boxShadow: appMode === 'offline' ? '0 0 14px rgba(245, 158, 11, 0.35)' : '0 0 12px rgba(56, 189, 248, 0.25)',
          }}
        >
          <button
            type="button"
            id="top-mode-online-btn"
            onClick={() => handleToggleMode('online')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 11px',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.74rem',
              background: appMode === 'online' ? 'rgba(56, 189, 248, 0.3)' : 'transparent',
              color: appMode === 'online' ? '#38bdf8' : '#64748b',
              transition: 'all 0.15s ease',
            }}
          >
            <Globe size={13} />
            <span>Online</span>
          </button>
          <button
            type="button"
            id="top-mode-offline-btn"
            onClick={() => handleToggleMode('offline')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 11px',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.74rem',
              background: appMode === 'offline' ? 'rgba(245, 158, 11, 0.35)' : 'transparent',
              color: appMode === 'offline' ? '#f59e0b' : '#64748b',
              transition: 'all 0.15s ease',
            }}
          >
            <Zap size={13} />
            <span>⚡ Offline</span>
          </button>
        </div>

        {/* Download App for Mobile & Laptop Button */}
        <button
          type="button"
          id="login-top-download-app-btn"
          onClick={() => setDownloadModalOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.25) 0%, rgba(245, 158, 11, 0.22) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.55)',
            color: '#38bdf8',
            fontSize: '0.8rem',
            fontWeight: 700,
            padding: '0.35rem 0.8rem',
            borderRadius: '9999px',
            cursor: 'pointer',
            boxShadow: '0 0 12px rgba(56, 189, 248, 0.25)',
            transition: 'all 0.2s ease',
          }}
          title="Download & Install Mobile App (.apk) or Laptop App — Offline Ready"
        >
          <Download size={14} color="#38bdf8" />
          <span>📱 Mobile App (.apk)</span>
        </button>

        {/* Quick Demo Button (Opens Gmail + 1-Min OTP modal) */}
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
          title="Start One-Time Demo Session via Gmail OTP (No password required, 1-minute validity)"
        >
          <Sparkles size={14} />
          <span>Demo Mode (Gmail OTP)</span>
        </button>
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
          <img
            src="/images/login_logo.png"
            alt="Academy Logo"
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1.5px solid #f59e0b',
              boxShadow: '0 0 10px rgba(245, 158, 11, 0.5)',
            }}
          />
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: '#f59e0b',
              textTransform: 'uppercase',
            }}
          >
            Neurobridge Academic Portal
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
            inset: '-20px',
            borderRadius: '50%',
            border: '1.5px dashed rgba(56, 189, 248, 0.65)',
            boxShadow: '0 0 25px rgba(56, 189, 248, 0.35)',
            animation: 'marvelSpinClockwise 50s linear infinite',
            pointerEvents: 'none',
            transform: 'translateZ(-15px)',
          }}
        />

        {/* 3D Counter-Rotating Holographic Arc Segments Ring */}
        <div
          style={{
            position: 'absolute',
            inset: '4px',
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: 'rgba(245, 158, 11, 0.9)',
            borderBottomColor: 'rgba(56, 189, 248, 0.9)',
            animation: 'marvelSpinCounter 36s linear infinite',
            pointerEvents: 'none',
            filter: 'drop-shadow(0 0 16px rgba(56, 189, 248, 0.75)) drop-shadow(0 0 14px rgba(245, 158, 11, 0.65))',
            transform: 'translateZ(-5px)',
          }}
        />

        {/* 3D Ambient Radiant Core Aura */}
        <div
          style={{
            position: 'absolute',
            width: '460px',
            height: '460px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.28) 0%, rgba(245, 158, 11, 0.22) 45%, transparent 72%)',
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
            background: 'linear-gradient(145deg, rgba(16, 26, 48, 0.84) 0%, rgba(10, 16, 32, 0.8) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.5)',
            borderRadius: '24px',
            padding: '26px 22px 22px 22px',
            boxShadow: '0 0 55px rgba(56, 189, 248, 0.32), 0 25px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.18)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
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

          {/* Official Academic Academy Logo */}
          <div
            style={{
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '82px',
                height: '82px',
                borderRadius: '50%',
                padding: '3px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #38bdf8 50%, #d97706 100%)',
                boxShadow: '0 0 35px rgba(245, 158, 11, 0.6), 0 0 16px rgba(56, 189, 248, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/images/login_logo.png"
                alt="Neurobridge Learning Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
          </div>

          {/* Cyberpunk High-Tech Dual Mode Toggle Button (Online vs Offline) */}
          <div
            style={{
              width: '100%',
              marginBottom: '1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <div
              role="radiogroup"
              aria-label="Application Operating Mode"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                maxWidth: '290px',
                background: 'rgba(8, 14, 28, 0.92)',
                borderRadius: '9999px',
                padding: '4px',
                border:
                  appMode === 'offline'
                    ? '1.5px solid rgba(245, 158, 11, 0.65)'
                    : '1.5px solid rgba(56, 189, 248, 0.65)',
                boxShadow:
                  appMode === 'offline'
                    ? '0 0 20px rgba(245, 158, 11, 0.35), inset 0 0 10px rgba(245, 158, 11, 0.15)'
                    : '0 0 20px rgba(56, 189, 248, 0.35), inset 0 0 10px rgba(56, 189, 248, 0.15)',
                transition: 'all 0.25s ease',
              }}
            >
              <button
                type="button"
                id="login-mode-online-toggle"
                role="radio"
                aria-checked={appMode === 'online'}
                onClick={() => handleToggleMode('online')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '7px 10px',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: appMode === 'online' ? 800 : 600,
                  fontSize: '0.76rem',
                  letterSpacing: '0.04em',
                  background:
                    appMode === 'online'
                      ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.75) 0%, rgba(56, 189, 248, 0.55) 100%)'
                      : 'transparent',
                  color: appMode === 'online' ? '#ffffff' : '#64748b',
                  boxShadow: appMode === 'online' ? '0 0 12px rgba(56, 189, 248, 0.5)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <Globe size={13} color={appMode === 'online' ? '#ffffff' : '#64748b'} />
                <span>Online Cloud</span>
              </button>

              <button
                type="button"
                id="login-mode-offline-toggle"
                role="radio"
                aria-checked={appMode === 'offline'}
                onClick={() => handleToggleMode('offline')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '7px 10px',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: appMode === 'offline' ? 800 : 600,
                  fontSize: '0.76rem',
                  letterSpacing: '0.04em',
                  background:
                    appMode === 'offline'
                      ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.75) 0%, rgba(217, 119, 6, 0.55) 100%)'
                      : 'transparent',
                  color: appMode === 'offline' ? '#ffffff' : '#64748b',
                  boxShadow: appMode === 'offline' ? '0 0 14px rgba(245, 158, 11, 0.6)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <Zap size={13} color={appMode === 'offline' ? '#ffffff' : '#64748b'} />
                <span>⚡ Offline Mode</span>
              </button>
            </div>

            {/* Offline/Online Mode Sub-badge */}
            <div
              style={{
                fontSize: '0.68rem',
                color: appMode === 'offline' ? '#f59e0b' : '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: appMode === 'offline' ? '#f59e0b' : '#38bdf8',
                  boxShadow: appMode === 'offline' ? '0 0 6px #f59e0b' : '0 0 6px #38bdf8',
                }}
              />
              <span>
                {appMode === 'offline'
                  ? '⚡ 100% In-Browser · No Internet or Server Needed'
                  : '🌐 Live Cloud Sync · FastAPI & Email OTP'}
              </span>
            </div>
          </div>

          {/* Network offline alert when in online mode */}
          {!isNetworkOnline && appMode === 'online' && (
            <div
              style={{
                width: '100%',
                backgroundColor: 'rgba(245, 158, 11, 0.18)',
                border: '1px solid rgba(245, 158, 11, 0.5)',
                color: '#fde68a',
                padding: '6px 10px',
                borderRadius: '8px',
                fontSize: '0.72rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.6rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <WifiOff size={13} />
                <span>No Internet detected</span>
              </div>
              <button
                type="button"
                onClick={() => handleToggleMode('offline')}
                style={{
                  background: '#f59e0b',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '2px 7px',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Switch to Offline
              </button>
            </div>
          )}

          {/* Header Title */}
          <h1
            style={{
              color: appMode === 'offline' ? '#f59e0b' : '#38bdf8',
              fontSize: '1.85rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginBottom: '0.85rem',
              textShadow:
                appMode === 'offline'
                  ? '0 0 20px rgba(245, 158, 11, 0.45)'
                  : '0 0 20px rgba(56, 189, 248, 0.45)',
              margin: '0 0 0.85rem 0',
            }}
          >
            {appMode === 'offline'
              ? '⚡ Offline Workspace'
              : step === 'otp'
              ? 'Verify Email'
              : isSignUp
              ? 'Sign Up'
              : 'Login'}
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

          {/* OFFLINE WORKSPACE MODE PANEL */}
          {appMode === 'offline' ? (
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
              }}
            >
              {/* Glowing Offline Feature Checklist */}
              <div
                style={{
                  background: 'linear-gradient(145deg, rgba(245, 158, 11, 0.08) 0%, rgba(15, 23, 42, 0.75) 100%)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  borderRadius: '16px',
                  padding: '12px 14px',
                  textAlign: 'left',
                  boxShadow: '0 0 20px rgba(245, 158, 11, 0.15)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    color: '#f59e0b',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    marginBottom: '7px',
                  }}
                >
                  <Zap size={15} />
                  <span>Offline Ready Capabilities</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.72rem', color: '#cbd5e1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={13} color="#10b981" />
                    <span>Local Step-by-Step Math Solver (Symbolic Engine)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={13} color="#10b981" />
                    <span>SRS Flashcards & Spaced Repetition (Saved in Browser)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={13} color="#10b981" />
                    <span>Built-in AI Academic Tutor & Knowledge Base</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={13} color="#10b981" />
                    <span>Audio Speech Synthesis & Question History</span>
                  </div>
                </div>
              </div>

              {/* Offline Profile Input & Launch Form */}
              <form onSubmit={handleOfflineLaunch} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                  <label htmlFor="offline-name-input" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>
                    Learner Profile Name (Optional):
                  </label>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      id="offline-name-input"
                      type="text"
                      value={offlineName}
                      onChange={(e) => setOfflineName(e.target.value)}
                      placeholder="e.g. Aman, Student, Scholar..."
                      style={{
                        width: '100%',
                        padding: '10px 38px 10px 14px',
                        backgroundColor: 'rgba(9, 14, 26, 0.85)',
                        border: '1px solid rgba(245, 158, 11, 0.45)',
                        borderRadius: '10px',
                        color: '#ffffff',
                        fontSize: '0.85rem',
                        outline: 'none',
                        boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.5)',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = '#f59e0b')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.45)')}
                    />
                    <User size={16} color="#f59e0b" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                {/* Big Glowing Launch Button */}
                <button
                  id="login-launch-offline-btn"
                  type="submit"
                  disabled={isLoading}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '44px',
                    borderRadius: '9999px',
                    border: 'none',
                    cursor: isLoading ? 'wait' : 'pointer',
                    background: 'linear-gradient(90deg, #f59e0b 0%, #ea580c 100%)',
                    boxShadow: '0 0 25px rgba(245, 158, 11, 0.65), 0 0 40px rgba(245, 158, 11, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    transition: 'all 0.18s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 0 32px rgba(245, 158, 11, 0.85)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 0 25px rgba(245, 158, 11, 0.65)';
                  }}
                >
                  <Zap size={16} />
                  <span>{isLoading ? 'LAUNCHING...' : '⚡ LAUNCH OFFLINE WORKSPACE →'}</span>
                </button>
              </form>

              {/* Download App for Mobile & Laptop Button */}
              <button
                type="button"
                id="login-offline-download-btn"
                onClick={() => setDownloadModalOpen(true)}
                style={{
                  width: '100%',
                  padding: '9px 14px',
                  borderRadius: '12px',
                  border: '1px solid rgba(56, 189, 248, 0.45)',
                  background: 'rgba(56, 189, 248, 0.12)',
                  color: '#38bdf8',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '7px',
                  boxShadow: '0 0 14px rgba(56, 189, 248, 0.2)',
                  transition: 'all 0.2s ease',
                }}
              >
                <Download size={15} color="#38bdf8" />
                <span>📥 Download Mobile App (.apk) / Install</span>
              </button>

              {/* Switch back link */}
              <button
                type="button"
                onClick={() => handleToggleMode('online')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#38bdf8',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  marginTop: '0.2rem',
                }}
              >
                <Globe size={13} />
                <span>Switch to Online Mode (Cloud & Live OTP)</span>
              </button>
            </div>
          ) : step === 'otp' ? (
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

              {/* Delivery Status Indicator */}
              {isLiveDelivery ? (
                <div
                  style={{
                    backgroundColor: 'rgba(34, 197, 94, 0.12)',
                    border: '1px solid rgba(34, 197, 94, 0.35)',
                    borderRadius: '10px',
                    padding: '0.65rem 0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.76rem',
                    color: '#86efac',
                    textAlign: 'left',
                  }}
                >
                  <CheckCircle size={16} style={{ flexShrink: 0, color: '#22c55e' }} />
                  <div>
                    <strong>Verification Code Sent Directly to Your Gmail!</strong>
                    <div style={{ color: '#cbd5e1', fontSize: '0.72rem', marginTop: '2px' }}>
                      Delivered to <span style={{ color: '#38bdf8', fontWeight: 600 }}>{email || (username.includes('@') ? username : '')}</span> from <em>neurobridge123@gmail.com</em>. Please check your Inbox (or Spam/Promotions folder) and enter the 6 digits below.
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
                    fontSize: '0.76rem',
                    color: '#fde68a',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={16} style={{ flexShrink: 0, color: '#f59e0b' }} />
                    <strong>Live Email Server Notice</strong>
                  </div>
                  <div style={{ color: '#cbd5e1', fontSize: '0.72rem' }}>
                    Live email delivery could not be completed. You can use the instant backup passcode below to continue without interruption.
                  </div>
                  {liveOtpPreview && (
                    <div
                      style={{
                        marginTop: '4px',
                        padding: '6px 10px',
                        backgroundColor: 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid rgba(245, 158, 11, 0.5)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Backup Passcode: </span>
                        <strong style={{ color: '#38bdf8', fontSize: '0.95rem', letterSpacing: '0.12em' }}>
                          {liveOtpPreview}
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEnteredOtp(liveOtpPreview)}
                        style={{
                          padding: '3px 8px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: '#f59e0b',
                          color: '#0f172a',
                          cursor: 'pointer',
                        }}
                      >
                        Autofill
                      </button>
                    </div>
                  )}
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
                    <span>⚡ Demo Student Access (Gmail + 1-Min OTP)</span>
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

              {/* Login Method Selector (Password vs Direct Gmail OTP vs Offline Mode) */}
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
                      fontSize: '0.74rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    Password
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
                      fontSize: '0.74rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    ⚡ Gmail OTP
                  </button>
                  <button
                    type="button"
                    id="login-method-offline-button"
                    onClick={() => handleToggleMode('offline')}
                    style={{
                      flex: 1,
                      padding: '5px 0',
                      borderRadius: '9999px',
                      border: '1px solid rgba(245, 158, 11, 0.35)',
                      background: 'rgba(245, 158, 11, 0.12)',
                      color: '#f59e0b',
                      fontWeight: 700,
                      fontSize: '0.74rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '3px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Zap size={12} />
                    <span>⚡ Offline</span>
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

          {/* Social Logins & Sign Up Toggle - Only in Online Mode */}
          {appMode === 'online' && step === 'auth' && (
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

              {/* Bottom Quick Offline Mode Button */}
              <button
                type="button"
                id="login-bottom-offline-mode-btn"
                onClick={() => handleToggleMode('offline')}
                style={{
                  marginTop: '0.65rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.16) 0%, rgba(217, 119, 6, 0.1) 100%)',
                  border: '1px solid rgba(245, 158, 11, 0.5)',
                  color: '#f59e0b',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  boxShadow: '0 0 14px rgba(245, 158, 11, 0.25)',
                  transition: 'all 0.18s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(217, 119, 6, 0.25) 100%)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(245, 158, 11, 0.45)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(245, 158, 11, 0.16) 0%, rgba(217, 119, 6, 0.1) 100%)';
                  e.currentTarget.style.boxShadow = '0 0 14px rgba(245, 158, 11, 0.25)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Zap size={15} color="#f59e0b" />
                <span>⚡ Run Project in Offline Mode</span>
              </button>

              {/* Direct Mobile App Download Button (.apk) */}
              <button
                type="button"
                id="login-bottom-download-apk-btn"
                onClick={() => setDownloadModalOpen(true)}
                style={{
                  marginTop: '0.45rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.15) 100%)',
                  border: '1px solid rgba(16, 185, 129, 0.55)',
                  color: '#34d399',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  boxShadow: '0 0 14px rgba(16, 185, 129, 0.25)',
                  transition: 'all 0.18s ease',
                }}
              >
                <Download size={15} color="#34d399" />
                <span>📥 Download Mobile App (.apk)</span>
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

      {/* ONE-TIME DEMO ACCESS MODAL (Gmail + 1-Minute OTP, Strictly Single-Use per Gmail) */}
      {demoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-modal-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(3, 7, 18, 0.88)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            padding: '1.25rem',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isDemoSubmitting) {
              setDemoModalOpen(false);
              setDemoError(null);
            }
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '480px',
              backgroundColor: '#0c1220',
              border: '1px solid rgba(56, 189, 248, 0.45)',
              borderRadius: '20px',
              padding: '24px 26px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(56, 189, 248, 0.25)',
              color: '#f8fafc',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img
                  src="/images/login_logo.png"
                  alt="Neurobridge Logo"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    objectFit: 'cover',
                    border: '1.5px solid #f59e0b',
                    boxShadow: '0 0 12px rgba(245, 158, 11, 0.4)',
                  }}
                />
                <div>
                  <h2 id="demo-modal-title" style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                    Demo Access · Gmail OTP
                  </h2>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                    No password required · One-time access per Gmail
                  </p>
                </div>
              </div>
              <button
                type="button"
                id="demo-modal-close-button"
                onClick={() => {
                  setDemoModalOpen(false);
                  setDemoError(null);
                }}
                aria-label="Close demo modal"
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

            {/* Protocol Rules Callout */}
            <div
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '12px',
                padding: '10px 14px',
                marginBottom: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontSize: '0.76rem',
                color: '#cbd5e1',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontWeight: 700 }}>
                <Clock size={13} />
                <span>Demo Access Rules:</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#38bdf8' }}>•</span>
                <span><strong>No Password:</strong> Verified purely through one-time Gmail passcode.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#f59e0b' }}>•</span>
                <span><strong>60-Second Validity:</strong> Passcode expires strictly after 1 minute.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#ef4444' }}>•</span>
                <span><strong>Single-Use Gmail:</strong> Each Gmail can only claim demo access once. Using the same Gmail again will be rejected.</span>
              </div>
            </div>

            {/* Error & Success Alerts */}
            {demoError && (
              <div
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#fca5a5',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  marginBottom: '14px',
                }}
              >
                <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{demoError}</span>
              </div>
            )}

            {demoSuccess && (
              <div
                style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.4)',
                  color: '#86efac',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '14px',
                }}
              >
                <CheckCircle2 size={16} color="#22c55e" style={{ flexShrink: 0 }} />
                <span>{demoSuccess}</span>
              </div>
            )}

            {/* STEP 1: Enter Gmail Address */}
            {demoStep === 'email' ? (
              <form onSubmit={handleSendDemoOtp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label htmlFor="demo-email-input" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                    Enter Gmail Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="demo-email-input"
                      type="email"
                      value={demoEmail}
                      onChange={(e) => setDemoEmail(e.target.value)}
                      placeholder="e.g. yourname@gmail.com"
                      required
                      style={{
                        width: '100%',
                        height: '42px',
                        backgroundColor: '#161f31',
                        border: '1px solid rgba(56, 189, 248, 0.35)',
                        borderRadius: '10px',
                        padding: '0 40px 0 14px',
                        color: '#f1f5f9',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
                      }}
                    />
                    <Mail size={16} color="#38bdf8" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                  <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                    No password required. Passcode will be valid for 1 minute.
                  </span>
                </div>

                <button
                  type="submit"
                  id="demo-send-otp-button"
                  disabled={isDemoSubmitting}
                  style={{
                    marginTop: '6px',
                    width: '100%',
                    height: '42px',
                    backgroundColor: '#0284c7',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: isDemoSubmitting ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 0 16px rgba(2, 132, 199, 0.35)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isDemoSubmitting ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
                  <span>{isDemoSubmitting ? 'Dispatching Demo Passcode...' : 'Send 1-Minute Demo Passcode'}</span>
                </button>
              </form>
            ) : (
              /* STEP 2: Enter 6-digit OTP with 60-Second Countdown */
              <form onSubmit={handleVerifyDemoOtp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* 60s Timer Badge & Target Info */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    backgroundColor: demoTimer <= 15 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    border: `1px solid ${demoTimer <= 15 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={13} color="#94a3b8" />
                    <span style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                      Sent to: <strong>{demoEmail}</strong>
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      color: demoTimer <= 15 ? '#ef4444' : '#f59e0b',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      fontFamily: 'monospace',
                    }}
                  >
                    <Clock size={14} />
                    <span>00:{demoTimer < 10 ? `0${demoTimer}` : demoTimer}</span>
                  </div>
                </div>

                {/* Secure Delivery Notice (Passcode sent to user's Gmail) */}
                <div
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    fontSize: '0.78rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    color: '#86efac',
                  }}
                >
                  <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: '#ecfdf5', display: 'block', marginBottom: '2px' }}>
                      Passcode sent directly to your Gmail inbox!
                    </strong>
                    <span style={{ color: '#a7f3d0', fontSize: '0.74rem', lineHeight: '1.4' }}>
                      Please open your Gmail ({demoEmail}), find the 6-digit passcode in your Inbox (or Spam/Promotions folder), and enter it below.
                    </span>
                  </div>
                </div>

                {/* OTP Input */}
                <div>
                  <label htmlFor="demo-otp-input" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                    Enter 6-Digit Passcode
                  </label>
                  <input
                    id="demo-otp-input"
                    type="text"
                    maxLength={6}
                    value={demoOtp}
                    onChange={(e) => setDemoOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    disabled={demoTimer <= 0 || isDemoSubmitting}
                    autoFocus
                    required
                    style={{
                      width: '100%',
                      height: '46px',
                      backgroundColor: '#161f31',
                      border: `1px solid ${demoTimer <= 0 ? 'rgba(239, 68, 68, 0.5)' : 'rgba(245, 158, 11, 0.45)'}`,
                      borderRadius: '10px',
                      textAlign: 'center',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      letterSpacing: '0.3em',
                      color: '#f8fafc',
                      outline: 'none',
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
                    }}
                  />
                </div>

                {/* If Timer Expired */}
                {demoTimer <= 0 && (
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#fca5a5', fontSize: '0.78rem', margin: '0 0 8px 0' }}>
                      ⏱️ Passcode expired! The 60-second validity period has ended.
                    </p>
                    <button
                      type="button"
                      id="demo-try-another-email-btn"
                      onClick={() => {
                        setDemoStep('email');
                        setDemoOtp('');
                        setDemoError(null);
                        setDemoTimer(OTP_DEMO_VALIDITY_SECONDS);
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#f1f5f9',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                      }}
                    >
                      Try With Another Gmail Address
                    </button>
                  </div>
                )}

                {/* Submit Verify Button */}
                {demoTimer > 0 && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setDemoStep('email');
                        setDemoOtp('');
                        setDemoError(null);
                      }}
                      style={{
                        flex: '0 0 auto',
                        padding: '0 14px',
                        height: '42px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '10px',
                        color: '#94a3b8',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      id="demo-verify-otp-button"
                      disabled={isDemoSubmitting || demoOtp.length < 6}
                      style={{
                        flex: 1,
                        height: '42px',
                        backgroundColor: demoOtp.length === 6 ? '#f59e0b' : 'rgba(245, 158, 11, 0.4)',
                        border: 'none',
                        borderRadius: '10px',
                        color: '#0f172a',
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        cursor: demoOtp.length === 6 && !isDemoSubmitting ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: demoOtp.length === 6 ? '0 0 16px rgba(245, 158, 11, 0.4)' : 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {isDemoSubmitting ? <RefreshCw size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                      <span>{isDemoSubmitting ? 'Verifying Demo Access...' : 'Verify & Enter Demo'}</span>
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      )}

      {/* App Download & Install Modal */}
      <AppDownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
      />
    </div>
  );
};

export default LoginPage;
