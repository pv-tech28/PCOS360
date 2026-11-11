import React, { useState } from 'react';
import {
  X,
  ArrowRight,
  Mail,
  Lock,
  User,
  UserCheck,
  Shield,
  AlertCircle,
  Loader2,
  WifiOff,
} from 'lucide-react';
import Logo from '../common/Logo';
import { useHealth } from '../../context/HealthContext';

export function AuthFormCard({ isModal = false, onClose }) {
  const { login, register, enterDemoMode, dbConnected, syncNotice } = useHealth();
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (isRegister) {
      const trimmedName = fullName.trim();
      if (trimmedName.length < 2) {
        setError('Please enter your full name (at least 2 characters).');
        return;
      }
      if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
        setError('Password must be at least 8 characters and include both a letter and a number.');
        return;
      }
    }

    setSubmitting(true);
    try {
      if (isRegister) {
        await register({ fullName: fullName.trim(), email: trimmedEmail, password });
      } else {
        await login({ email: trimmedEmail, password });
      }
      if (onClose) onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoEntry = () => {
    setError('');
    enterDemoMode();
    if (onClose) onClose();
  };

  return (
    <div className="bg-white rounded-3xl w-full max-w-md shadow-[0_25px_70px_rgba(41,36,49,0.20)] border border-[#EFEAF4] overflow-hidden relative">
      {isModal && onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-[#77717F] hover:bg-[#FAF9FC] z-10 cursor-pointer"
          aria-label="Close sign in dialog"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Header */}
      <div className="pt-8 pb-5 px-6 text-center bg-gradient-to-b from-[#FAF9FC] to-white">
        <div className="mx-auto flex justify-center mb-3">
          <Logo size="lg" showTagline={true} />
        </div>
        <h2 className="text-lg font-bold text-[#292431]">
          {isRegister ? 'Create Your Private Account' : 'Sign In to PCOS360'}
        </h2>
        <p className="text-xs text-[#77717F] max-w-xs mx-auto leading-relaxed mt-1">
          Personal cycle tracking, symptom history, and biomarker insights isolated to your account.
        </p>

        {!dbConnected && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-medium text-amber-800">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Backend API offline — start FastAPI on port 8000 to sign in or register</span>
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
        {(error || (syncNotice && syncNotice.type !== 'success' && !isModal)) && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
              error || syncNotice?.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-[#FAF9FC] border-[#EFEAF4] text-[#553878]'
            }`}
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error || syncNotice?.text}</span>
          </div>
        )}

        {isRegister && (
          <div>
            <label className="block text-xs font-semibold text-[#292431] mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#9E98A8] absolute left-3.5 top-3" />
              <input
                type="text"
                required
                minLength={2}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                autoComplete="name"
                className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-[#EFEAF4] focus:outline-none focus:border-[#7950A8]"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-[#292431] mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#9E98A8] absolute left-3.5 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              autoComplete="email"
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-[#EFEAF4] focus:outline-none focus:border-[#7950A8]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#292431] mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#9E98A8] absolute left-3.5 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isRegister ? 'At least 8 chars, letters + numbers' : 'Enter your password'}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-[#EFEAF4] focus:outline-none focus:border-[#7950A8]"
            />
          </div>
          {isRegister && (
            <p className="text-[10px] text-[#77717F] mt-1">
              Minimum 8 characters, including at least one letter and one number.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#7950A8] text-white text-xs sm:text-sm font-semibold hover:bg-[#694195] disabled:opacity-60 transition-all shadow-xs cursor-pointer"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{isRegister ? 'Creating Account...' : 'Signing In...'}</span>
            </>
          ) : (
            <>
              <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-xs font-medium text-[#7950A8] hover:underline cursor-pointer"
          >
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
          </button>
        </div>

        {/* Clearly Separated Local Demo Mode Option */}
        <div className="pt-3 border-t border-[#F4EFFB] space-y-2">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-[#9E98A8] text-center">
            Offline Sample Preview
          </p>
          <button
            type="button"
            onClick={handleDemoEntry}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#FAF9FC] text-[#553878] text-xs font-semibold hover:bg-[#EDE5F7] transition-all border border-[#DFCDEE] cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>Explore Sample Demo (Not Saved to Account)</span>
          </button>
        </div>

        <div className="pt-1 flex items-center justify-center gap-1.5 text-[10px] text-[#9E98A8]">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>Salted Scrypt Password Hashing • Server-Tracked Sessions</span>
        </div>
      </form>
    </div>
  );
}

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen } = useHealth();
  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#292431]/40 backdrop-blur-xs animate-in fade-in duration-150">
      <AuthFormCard isModal={true} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
