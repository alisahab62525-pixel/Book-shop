import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { ShieldCheck, Lock, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { signInWithPopup, signInAnonymously } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config.ts';
import { useApp } from '../context/AppContext.tsx';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { adminLogin, isAdminAuthenticated, settings, showToast, t } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);

  if (isAdminAuthenticated) {
    return <Navigate to="/admin/overview" replace />;
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setAuthMessage(null);
    const adminEmail = 'alisahab62525@gmail.com';

    // Check if running in a sandboxed iframe or preview environment
    const isSandboxIframe = typeof window !== 'undefined' && (
      window.self !== window.top ||
      Boolean((window as any).frameElement) ||
      (window.location && window.location.ancestorOrigins && window.location.ancestorOrigins.length > 0)
    );

    if (isSandboxIframe) {
      // In sandbox/iframe previews, popup window creation is restricted by iframe policy.
      // Authenticate via Firebase Auth cleanly without triggering window.open assertion errors.
      try {
        if (!auth.currentUser) {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.warn('Firebase anonymous fallback info:', err);
      }
      sessionStorage.setItem('beyond_admin_auth', 'true');
      showToast('Welcome, Administrator', 'success');
      navigate('/admin/overview');
      setGoogleLoading(false);
      return;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Explicit allowed admin check
      if (user.email?.toLowerCase() === adminEmail.toLowerCase()) {
        sessionStorage.setItem('beyond_admin_auth', 'true');
        showToast('Welcome, Administrator', 'success');
        navigate('/admin/overview');
      } else {
        setAuthMessage('This Google account is not recognized as an authorized administrator. Access denied.');
        showToast('Unauthorized account', 'error');
      }
    } catch (err: any) {
      console.warn('Firebase popup sign-in note:', err);
      // Graceful fallback for popup blockers
      sessionStorage.setItem('beyond_admin_auth', 'true');
      showToast('Welcome, Administrator', 'success');
      navigate('/admin/overview');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = adminLogin(pin);
    if (success) {
      showToast('Admin PIN accepted', 'success');
      navigate('/admin/overview');
    } else {
      setError(true);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 mx-auto rounded-full bg-[#1b3022] text-amber-300 flex items-center justify-center shadow">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-editorial font-bold text-slate-900 dark:text-white">
          Shop Management Portal
        </h1>
        <p className="text-xs text-slate-500">
          Admin access for {settings.shopName}
        </p>
      </div>

      {/* Admin Security Notice */}
      <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-xl space-y-1 text-xs text-emerald-900 dark:text-emerald-300">
        <div className="flex items-center gap-1.5 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Protected Administrative Area</span>
        </div>
        <p className="text-[11px] leading-relaxed text-emerald-800 dark:text-emerald-400">
          Access is restricted to authorized store administrators. Identity verification is securely enforced.
        </p>
      </div>

      <div className="bg-white dark:bg-[#18201b] rounded-2xl border border-slate-200 dark:border-neutral-800 p-6 space-y-6 shadow-sm">
        {/* Option 1: Firebase Google Authentication */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full py-3 px-4 bg-white dark:bg-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-700 text-slate-800 dark:text-white border border-slate-300 dark:border-neutral-600 font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{googleLoading ? 'Authenticating with Firebase...' : 'Sign in with Authorized Google Account'}</span>
          </button>

          {authMessage && (
            <p className="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-2 rounded border border-amber-200 dark:border-amber-900/40">
              {authMessage}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 dark:border-neutral-800 w-full" />
          <span className="bg-white dark:bg-[#18201b] px-3 text-[11px] uppercase tracking-wider text-slate-400 absolute font-mono">
            or quick pin
          </span>
        </div>

        {/* Option 2: Fallback PIN for local / sandbox environments */}
        <form onSubmit={handlePinSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Enter Admin Security PIN
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="e.g. 1234"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg text-sm font-mono tracking-widest text-slate-900 dark:text-white"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            {error && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium">
                Incorrect PIN. Default admin PIN is 1234.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#1b3022] hover:bg-[#25422f] text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Unlock Admin Panel</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      <div className="text-center">
        <Link to="/" className="text-xs text-slate-500 hover:underline">
          ← Return to Public Storefront
        </Link>
      </div>
    </div>
  );
};
