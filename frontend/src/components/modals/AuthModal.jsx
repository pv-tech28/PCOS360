import React, { useState } from 'react';
import { X, ArrowRight, Sparkles, Mail, Lock, UserCheck, Shield } from 'lucide-react';
import Logo from '../common/Logo';
import { useHealth } from '../../context/HealthContext';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, isUserLoggedIn, setIsUserLoggedIn } = useHealth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('ananya.sharma@example.com');
  const [password, setPassword] = useState('••••••••••');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsUserLoggedIn(true);
    setIsAuthModalOpen(false);
  };

  const handleDemoLogin = () => {
    setIsUserLoggedIn(true);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#292431]/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-[0_25px_70px_rgba(41,36,49,0.25)] border border-[#EFEAF4] overflow-hidden relative">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-full text-[#77717F] hover:bg-[#FAF9FC] z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Decorative soft pastel banner matching Screen 1 illustration */}
        <div className="pt-8 pb-6 px-6 text-center bg-gradient-to-b from-[#FAF9FC] to-white relative overflow-hidden">
          <div className="mx-auto flex justify-center mb-4">
            <Logo size="lg" showTagline={true} />
          </div>

          <p className="text-xs text-[#77717F] max-w-xs mx-auto leading-relaxed mt-2">
            Your AI-powered companion for understanding, managing and exploring PCOS.
          </p>
        </div>

        {/* Auth form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
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
                className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-[#EFEAF4] focus:outline-none focus:border-[#7950A8]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-[#292431]">Password</label>
              {!isRegister && (
                <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[11px] text-[#7950A8] hover:underline">
                  Forgot?
                </a>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#9E98A8] absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-[#EFEAF4] focus:outline-none focus:border-[#7950A8]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#7950A8] text-white text-xs sm:text-sm font-semibold hover:bg-[#694195] transition-all shadow-xs cursor-pointer"
          >
            <span>{isRegister ? 'Create Secure Account' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Demo Mode entry */}
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#EDE5F7] text-[#7950A8] text-xs font-semibold hover:bg-[#E3D6F2] transition-all border border-[#DFCDEE] cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>Continue as Ananya (Demo User)</span>
          </button>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-[#77717F] hover:text-[#7950A8]"
            >
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
            </button>
          </div>

          <div className="pt-2 border-t border-[#FAF9FC] flex items-center justify-center gap-1.5 text-[10px] text-[#9E98A8]">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>End-to-End Encrypted Health Records</span>
          </div>
        </form>
      </div>
    </div>
  );
}
