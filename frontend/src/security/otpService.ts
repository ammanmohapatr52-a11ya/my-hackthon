/**
 * Neurobridge Email OTP Verification Service
 * Handles one-time verification passcode generation, dispatch via real Gmail SMTP,
 * fallback notification events, expiration timers, and registration/login completion.
 */

import { authenticateOrRegisterUser, type UserRecord } from '../services/userService';
import { getApiUrl, getBackendBaseUrl, isBackendConfigured, isLocalhost } from '../config/apiConfig';

export interface PendingRegistration {
  email: string;
  username: string;
  password?: string;
  otp: string;
  expiresAt: number;
  sentAt: number;
  attempts: number;
  mode?: 'registration' | 'login' | 'demo';
  validitySeconds?: number;
}

export interface DispatchedOtpNotification {
  id: string;
  email: string;
  otp: string;
  timestamp: string;
  subject: string;
  isLiveDelivery?: boolean;
}

export interface SendOtpResult {
  success: boolean;
  error?: string;
  otpPreview?: string;
  cooldownRemaining?: number;
  channel?: 'live_brevo_api' | 'live_gmail_smtp' | 'simulated_fallback';
  isLiveDelivery?: boolean;
  message?: string;
  smtpStatus?: any;
}

export interface SmtpConfigStatus {
  configured: boolean;
  host?: string;
  port?: number;
  user?: string;
  from_name?: string;
  masked_password?: string;
  provider?: string;
}

const STORAGE_PENDING_REGISTRATION_KEY = 'neurobridge_pending_registration';
const STORAGE_DISPATCHED_NOTIFICATIONS_KEY = 'neurobridge_dispatched_otps';
const STORAGE_USED_DEMO_EMAILS_KEY = 'neurobridge_used_demo_emails';

const OTP_VALIDITY_SECONDS = 300; // 5 minutes standard
export const OTP_DEMO_VALIDITY_SECONDS = 60; // 1 minute for demo access
const RESEND_COOLDOWN_SECONDS = 60; // 60 seconds

/**
 * Returns the list of all Gmail/email addresses that have already consumed their 1-time demo access.
 */
export const getUsedDemoEmails = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_USED_DEMO_EMAILS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Checks if a particular Gmail address has already been used for demo access.
 */
export const isDemoEmailAlreadyUsed = (email: string): boolean => {
  const clean = email.trim().toLowerCase();
  if (!clean) return false;
  return getUsedDemoEmails().includes(clean);
};

/**
 * Permanently records a Gmail address as having consumed its one-time demo access.
 */
export const recordUsedDemoEmail = (email: string): void => {
  const clean = email.trim().toLowerCase();
  if (!clean) return;
  const existing = getUsedDemoEmails();
  if (!existing.includes(clean)) {
    localStorage.setItem(STORAGE_USED_DEMO_EMAILS_KEY, JSON.stringify([...existing, clean]));
  }
};

/**
 * Generates a secure random 6-digit OTP
 */
export const generateRandomOtp = (): string => {
  const digits = Math.floor(100000 + Math.random() * 900000);
  return digits.toString();
};

/**
 * Retrieves the currently active pending registration or login session
 */
export const getPendingRegistration = (): PendingRegistration | null => {
  try {
    const raw = localStorage.getItem(STORAGE_PENDING_REGISTRATION_KEY);
    if (!raw) return null;
    const pending: PendingRegistration = JSON.parse(raw);

    if (Date.now() > pending.expiresAt) {
      clearPendingRegistration();
      return null;
    }
    return pending;
  } catch {
    return null;
  }
};

/**
 * Clears pending registration state
 */
export const clearPendingRegistration = (): void => {
  localStorage.removeItem(STORAGE_PENDING_REGISTRATION_KEY);
};

interface BackendOtpResponse {
  ok: boolean;
  isLiveDelivery: boolean;
  channel: 'live_brevo_api' | 'live_gmail_smtp' | 'simulated_fallback';
  message: string;
  smtpStatus?: any;
  error?: string;
  alreadyUsed?: boolean;
}

/**
 * Unified backend dispatch helper.
 * Safely communicates with FastAPI backend, with automatic localhost fallback to Vite proxy.
 */
const callBackendSendOtp = async (payload: {
  email: string;
  username: string;
  otp: string;
  mode: string;
  expires_in_seconds?: number;
}): Promise<BackendOtpResponse> => {
  const targetUrl = getApiUrl('/api/v1/auth/send-otp');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);

  let response: Response | null = null;
  let errorMsg = '';

  try {
    response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (err: any) {
    // If targetUrl failed on localhost, retry via relative Vite proxy
    if (isLocalhost() && targetUrl !== '/api/v1/auth/send-otp') {
      try {
        response = await fetch('/api/v1/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (proxyErr: any) {
        errorMsg = proxyErr?.message || 'Connection failed';
      }
    } else {
      errorMsg = err?.message || 'Connection failed';
    }
  } finally {
    clearTimeout(timer);
  }

  if (response && response.ok) {
    try {
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      if (data.status === 'error' && data.already_used) {
        return {
          ok: false,
          isLiveDelivery: false,
          channel: 'simulated_fallback',
          message: data.message,
          error: data.message,
          alreadyUsed: true,
        };
      }
      const isLive = Boolean(data.is_live_delivery || data.channel === 'live_brevo_api' || data.channel === 'live_gmail_smtp');
      return {
        ok: true,
        isLiveDelivery: isLive,
        channel: data.channel || (isLive ? 'live_brevo_api' : 'simulated_fallback'),
        message: data.message || 'Verification passcode dispatched',
        smtpStatus: data.smtp_status,
      };
    } catch {
      return {
        ok: false,
        isLiveDelivery: false,
        channel: 'simulated_fallback',
        message: 'Invalid backend response format',
      };
    }
  }

  const backendBase = getBackendBaseUrl();
  return {
    ok: false,
    isLiveDelivery: false,
    channel: 'simulated_fallback',
    message: response
      ? `Backend returned status ${response.status}`
      : `Backend service unreachable at ${backendBase || 'localhost:8000'}. Make sure FastAPI is running.`,
    error: errorMsg,
  };
};

/**
 * Dispatches an email OTP for user registration.
 * Connects directly to backend Brevo API / Gmail SMTP, saving pending state and alerting the UI.
 */
export const sendRegistrationOtp = async (params: {
  email: string;
  username: string;
  password?: string;
}): Promise<SendOtpResult> => {
  const { email, username, password } = params;
  const cleanEmail = email.trim().toLowerCase();
  const cleanUsername = username.trim();

  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Please enter a valid email address to receive verification code' };
  }

  // Check cooldown if existing pending request exists
  const existing = getPendingRegistration();
  if (existing && existing.email.toLowerCase() === cleanEmail) {
    const elapsedSeconds = Math.floor((Date.now() - existing.sentAt) / 1000);
    if (elapsedSeconds < RESEND_COOLDOWN_SECONDS) {
      return {
        success: false,
        error: `Please wait ${RESEND_COOLDOWN_SECONDS - elapsedSeconds} seconds before requesting a new code`,
        cooldownRemaining: RESEND_COOLDOWN_SECONDS - elapsedSeconds,
      };
    }
  }

  const otp = generateRandomOtp();
  const now = Date.now();
  const pendingData: PendingRegistration = {
    email: cleanEmail,
    username: cleanUsername,
    password,
    otp,
    sentAt: now,
    expiresAt: now + OTP_VALIDITY_SECONDS * 1000,
    attempts: 0,
    mode: 'registration',
  };

  localStorage.setItem(STORAGE_PENDING_REGISTRATION_KEY, JSON.stringify(pendingData));

  // Trigger backend email dispatch via Brevo API / Gmail SMTP
  const backendResult = await callBackendSendOtp({
    email: cleanEmail,
    username: cleanUsername,
    otp,
    mode: 'registration',
    expires_in_seconds: OTP_VALIDITY_SECONDS,
  });

  const channel = backendResult.channel;
  const isLiveDelivery = backendResult.isLiveDelivery;
  const backendMessage = backendResult.message;
  const smtpStatusInfo = backendResult.smtpStatus;

  // Store dispatched notification so user can inspect history
  const notification: DispatchedOtpNotification = {
    id: `notif-${Date.now()}`,
    email: cleanEmail,
    otp,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    subject: `Your Neurobridge Verification Code: ${otp}`,
    isLiveDelivery,
  };

  try {
    const rawNotifs = localStorage.getItem(STORAGE_DISPATCHED_NOTIFICATIONS_KEY);
    const notifs: DispatchedOtpNotification[] = rawNotifs ? JSON.parse(rawNotifs) : [];
    localStorage.setItem(STORAGE_DISPATCHED_NOTIFICATIONS_KEY, JSON.stringify([notification, ...notifs.slice(0, 19)]));
  } catch {
    // fallback
  }

  // Dispatch custom browser event
  window.dispatchEvent(
    new CustomEvent('neurobridge_otp_dispatched', {
      detail: notification,
    })
  );

  return {
    success: true,
    otpPreview: otp,
    channel,
    isLiveDelivery,
    message: backendMessage,
    smtpStatus: smtpStatusInfo,
  };
};

/**
 * Dispatches an email OTP for direct user Login without requiring a password.
 */
export const sendLoginOtp = async (params: {
  email: string;
}): Promise<SendOtpResult> => {
  const { email } = params;
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Please enter a valid Gmail / Email address' };
  }

  const existing = getPendingRegistration();
  if (existing && existing.email.toLowerCase() === cleanEmail) {
    const elapsedSeconds = Math.floor((Date.now() - existing.sentAt) / 1000);
    if (elapsedSeconds < RESEND_COOLDOWN_SECONDS) {
      return {
        success: false,
        error: `Please wait ${RESEND_COOLDOWN_SECONDS - elapsedSeconds}s before requesting a new code`,
        cooldownRemaining: RESEND_COOLDOWN_SECONDS - elapsedSeconds,
      };
    }
  }

  const otp = generateRandomOtp();
  const now = Date.now();
  const cleanUsername = cleanEmail.split('@')[0];

  const pendingData: PendingRegistration = {
    email: cleanEmail,
    username: cleanUsername,
    otp,
    sentAt: now,
    expiresAt: now + OTP_VALIDITY_SECONDS * 1000,
    attempts: 0,
    mode: 'login',
  };

  localStorage.setItem(STORAGE_PENDING_REGISTRATION_KEY, JSON.stringify(pendingData));

  // Trigger backend email dispatch via Brevo API / Gmail SMTP
  const backendResult = await callBackendSendOtp({
    email: cleanEmail,
    username: cleanUsername,
    otp,
    mode: 'login',
    expires_in_seconds: OTP_VALIDITY_SECONDS,
  });

  const channel = backendResult.channel;
  const isLiveDelivery = backendResult.isLiveDelivery;
  const backendMessage = backendResult.message;
  const smtpStatusInfo = backendResult.smtpStatus;

  const notification: DispatchedOtpNotification = {
    id: `notif-${Date.now()}`,
    email: cleanEmail,
    otp,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    subject: `Your Neurobridge Login Passcode: ${otp}`,
    isLiveDelivery,
  };

  try {
    const rawNotifs = localStorage.getItem(STORAGE_DISPATCHED_NOTIFICATIONS_KEY);
    const notifs: DispatchedOtpNotification[] = rawNotifs ? JSON.parse(rawNotifs) : [];
    localStorage.setItem(STORAGE_DISPATCHED_NOTIFICATIONS_KEY, JSON.stringify([notification, ...notifs.slice(0, 19)]));
  } catch {
    // fallback
  }

  window.dispatchEvent(
    new CustomEvent('neurobridge_otp_dispatched', {
      detail: notification,
    })
  );

  return {
    success: true,
    otpPreview: otp,
    channel,
    isLiveDelivery,
    message: backendMessage,
    smtpStatus: smtpStatusInfo,
  };
};

/**
 * Validates entered OTP and logs the existing user into session
 */
export const verifyLoginOtpAndAuthenticate = (
  email: string,
  enteredOtp: string
): { success: boolean; error?: string; user?: UserRecord } => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanOtp = enteredOtp.trim().replace(/\s/g, '');

  const pending = getPendingRegistration();
  if (!pending || pending.email.toLowerCase() !== cleanEmail) {
    return {
      success: false,
      error: 'No active OTP verification session found for this email. Please request a new code.',
    };
  }

  if (Date.now() > pending.expiresAt) {
    clearPendingRegistration();
    return {
      success: false,
      error: 'Verification passcode has expired. Please request a fresh OTP.',
    };
  }

  if (pending.attempts >= 5) {
    clearPendingRegistration();
    return {
      success: false,
      error: 'Exceeded maximum verification attempts (5). Session locked. Please request a new code.',
    };
  }

  if (cleanOtp !== pending.otp) {
    pending.attempts += 1;
    localStorage.setItem(STORAGE_PENDING_REGISTRATION_KEY, JSON.stringify(pending));
    const remainingAttempts = 5 - pending.attempts;
    return {
      success: false,
      error: `Invalid OTP code. Please verify and try again (${remainingAttempts} attempts remaining).`,
    };
  }

  // OTP verified! Authenticate user in userService
  const authResult = authenticateOrRegisterUser({
    usernameOrEmail: pending.email,
    isSignUp: false,
    provider: 'Gmail OTP Direct',
    isOtpVerified: true,
  });

  if (!authResult.success) {
    // If not yet registered, auto-register them
    const newReg = authenticateOrRegisterUser({
      usernameOrEmail: pending.email,
      isSignUp: true,
      provider: 'Gmail OTP Direct',
      isOtpVerified: true,
    });
    if (!newReg.success) {
      return { success: false, error: newReg.error || 'Failed to authenticate user session' };
    }
    clearPendingRegistration();
    return { success: true, user: newReg.user };
  }

  clearPendingRegistration();
  return { success: true, user: authResult.user };
};

/**
 * Dispatches an email OTP for Demo Access without requiring any password.
 * Strictly enforces 60-second (1-minute) expiration and single-use per Gmail address.
 */
export const sendDemoOtp = async (params: {
  email: string;
}): Promise<SendOtpResult> => {
  const { email } = params;
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Please enter a valid Gmail / Email address for demo access' };
  }

  // Enforce single-use per Gmail rule for demo access
  if (isDemoEmailAlreadyUsed(cleanEmail)) {
    return {
      success: false,
      error: `This Gmail address (${cleanEmail}) has already claimed its one-time demo access. The demo mode is strictly limited to one session per Gmail. Please use a different Gmail address to try the demo.`,
    };
  }

  const otp = generateRandomOtp();
  const now = Date.now();
  const cleanUsername = cleanEmail.split('@')[0];

  // Strictly 60 seconds (1 minute) validity for demo OTP
  const pendingData: PendingRegistration = {
    email: cleanEmail,
    username: cleanUsername,
    otp,
    sentAt: now,
    expiresAt: now + OTP_DEMO_VALIDITY_SECONDS * 1000,
    attempts: 0,
    mode: 'demo',
    validitySeconds: OTP_DEMO_VALIDITY_SECONDS,
  };

  localStorage.setItem(STORAGE_PENDING_REGISTRATION_KEY, JSON.stringify(pendingData));

  // Trigger backend email dispatch via Brevo API / Gmail SMTP
  const backendResult = await callBackendSendOtp({
    email: cleanEmail,
    username: `Demo Student (${cleanUsername})`,
    otp,
    mode: 'demo',
    expires_in_seconds: 60,
  });

  if (backendResult.alreadyUsed) {
    return { success: false, error: backendResult.message };
  }

  const channel = backendResult.channel as any;
  const isLiveDelivery = backendResult.isLiveDelivery;
  const backendMessage = backendResult.message;
  const smtpStatusInfo = backendResult.smtpStatus;

  const notification: DispatchedOtpNotification = {
    id: `notif-demo-${Date.now()}`,
    email: cleanEmail,
    otp,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    subject: `One-Time Demo Code: ${otp} (Valid for 1 Minute Only)`,
    isLiveDelivery,
  };

  try {
    const rawNotifs = localStorage.getItem(STORAGE_DISPATCHED_NOTIFICATIONS_KEY);
    const notifs: DispatchedOtpNotification[] = rawNotifs ? JSON.parse(rawNotifs) : [];
    localStorage.setItem(STORAGE_DISPATCHED_NOTIFICATIONS_KEY, JSON.stringify([notification, ...notifs.slice(0, 19)]));
  } catch {
    // fallback
  }

  window.dispatchEvent(
    new CustomEvent('neurobridge_otp_dispatched', {
      detail: notification,
    })
  );

  return {
    success: true,
    channel,
    isLiveDelivery,
    message: backendMessage,
    smtpStatus: smtpStatusInfo,
  };
};

/**
 * Validates the entered Demo OTP, enforces the 1-minute expiration window,
 * permanently blacklists this Gmail from ever claiming the demo again,
 * and completes demo session authentication without requiring any password.
 */
export const verifyDemoOtpAndAuthenticate = (
  email: string,
  enteredOtp: string
): { success: boolean; error?: string; user?: UserRecord } => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanOtp = enteredOtp.trim().replace(/\s/g, '');

  // Pre-check single-use rule
  if (isDemoEmailAlreadyUsed(cleanEmail)) {
    return {
      success: false,
      error: `This Gmail address (${cleanEmail}) has already consumed its one-time demo access. Please use another Gmail address to test the demo.`,
    };
  }

  const pending = getPendingRegistration();
  if (!pending || pending.email.toLowerCase() !== cleanEmail) {
    return {
      success: false,
      error: 'No active Demo verification session found for this email. Please request a new code.',
    };
  }

  // Strict 1-minute expiration check (60 seconds)
  if (Date.now() > pending.expiresAt) {
    clearPendingRegistration();
    return {
      success: false,
      error: 'Demo passcode has expired! The 1-minute validity window has elapsed. Please request a fresh code or try another Gmail address.',
    };
  }

  if (pending.attempts >= 5) {
    clearPendingRegistration();
    return {
      success: false,
      error: 'Exceeded maximum attempts. Demo session locked. Please request a new code with another Gmail.',
    };
  }

  if (cleanOtp !== pending.otp) {
    pending.attempts += 1;
    localStorage.setItem(STORAGE_PENDING_REGISTRATION_KEY, JSON.stringify(pending));
    const remainingAttempts = 5 - pending.attempts;
    return {
      success: false,
      error: `Invalid OTP code. Please check and try again (${remainingAttempts} attempts remaining).`,
    };
  }

  // OTP verified! Permanently blacklist this Gmail from claiming the demo again
  recordUsedDemoEmail(cleanEmail);
  clearPendingRegistration();

  // Authenticate / register user into demo session without password
  const authResult = authenticateOrRegisterUser({
    usernameOrEmail: cleanEmail,
    isSignUp: false,
    provider: 'Demo Gmail OTP (1-Min Pass)',
    isOtpVerified: true,
  });

  if (!authResult.success) {
    const newReg = authenticateOrRegisterUser({
      usernameOrEmail: cleanEmail,
      isSignUp: true,
      provider: 'Demo Gmail OTP (1-Min Pass)',
      isOtpVerified: true,
    });
    if (!newReg.success) {
      return { success: false, error: newReg.error || 'Failed to authenticate demo student session' };
    }
    return { success: true, user: newReg.user };
  }

  return { success: true, user: authResult.user };
};

/**
 * Validates the entered OTP and completes new user registration upon success
 */
export const verifyOtpAndRegister = (
  email: string,
  enteredOtp: string
): { success: boolean; error?: string; user?: UserRecord } => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanOtp = enteredOtp.trim().replace(/\s/g, '');

  const pending = getPendingRegistration();

  if (!pending || pending.email.toLowerCase() !== cleanEmail) {
    return {
      success: false,
      error: 'No active OTP verification session found for this email. Please request a new code.',
    };
  }

  if (Date.now() > pending.expiresAt) {
    clearPendingRegistration();
    return {
      success: false,
      error: 'Verification code has expired. Please request a fresh OTP.',
    };
  }

  if (pending.attempts >= 5) {
    clearPendingRegistration();
    return {
      success: false,
      error: 'Exceeded maximum verification attempts (5). Registration locked. Please restart registration.',
    };
  }

  if (cleanOtp !== pending.otp) {
    pending.attempts += 1;
    localStorage.setItem(STORAGE_PENDING_REGISTRATION_KEY, JSON.stringify(pending));
    const remainingAttempts = 5 - pending.attempts;
    return {
      success: false,
      error: `Invalid OTP code. Please verify and try again (${remainingAttempts} attempts remaining).`,
    };
  }

  // OTP is valid! Finalize user registration into Admin Console registry
  const regResult = authenticateOrRegisterUser({
    usernameOrEmail: pending.email,
    password: pending.password,
    isSignUp: true,
    isOtpVerified: true,
  });

  if (!regResult.success) {
    return {
      success: false,
      error: regResult.error || 'Failed to initialize account in directory',
    };
  }

  clearPendingRegistration();

  return {
    success: true,
    user: regResult.user,
  };
};

/**
 * Retrieves the currently active SMTP configuration status from backend
 */
export const getSmtpStatus = async (): Promise<SmtpConfigStatus> => {
  try {
    const res = await fetch(getApiUrl('/api/v1/auth/smtp-status'));
    if (res.ok) return await res.json();
    return { configured: false };
  } catch {
    return { configured: false };
  }
};

/**
 * Saves Gmail SMTP credentials to backend .env for real direct email dispatch
 */
export const saveSmtpConfig = async (params: {
  user: string;
  password: string;
  host?: string;
  port?: number;
  fromName?: string;
}): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    const res = await fetch(getApiUrl('/api/v1/auth/smtp-config'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: params.user.trim(),
        password: params.password.trim().replace(/\s/g, ''),
        host: params.host || 'smtp.gmail.com',
        port: params.port || 587,
        from_name: params.fromName || 'Neurobridge Stark Academy',
      }),
    });
    const data = await res.json();
    if (data.status === 'success') {
      return { success: true, message: 'Gmail SMTP credentials saved successfully!' };
    }
    return { success: false, error: data.message || 'Failed to save SMTP config' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error saving SMTP config' };
  }
};

/**
 * Tests the live SMTP handshake and optionally transmits a test ping to recipient
 */
export const testSmtpConnection = async (params: {
  recipient?: string;
  user?: string;
  password?: string;
  host?: string;
  port?: number;
  fromName?: string;
}): Promise<{ success: boolean; message?: string; error?: string; details?: string; hint?: string }> => {
  try {
    const res = await fetch(getApiUrl('/api/v1/auth/smtp-test'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: params.recipient?.trim(),
        user: params.user?.trim(),
        password: params.password ? params.password.trim().replace(/\s/g, '') : undefined,
        host: params.host || 'smtp.gmail.com',
        port: params.port || 587,
        from_name: params.fromName || 'Neurobridge Stark Academy',
      }),
    });
    if (!res.ok) {
      return { success: false, error: `Backend returned HTTP status ${res.status}` };
    }
    return await res.json();
  } catch (err: any) {
    const base = getBackendBaseUrl();
    return {
      success: false,
      error: `Cannot connect to backend server (${base || 'Render'}). Please make sure the backend is active.`,
    };
  }
};

/**
 * Retrieves past dispatched OTP notifications for the in-app Mail preview
 */
export const getDispatchedNotifications = (): DispatchedOtpNotification[] => {
  try {
    const raw = localStorage.getItem(STORAGE_DISPATCHED_NOTIFICATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
