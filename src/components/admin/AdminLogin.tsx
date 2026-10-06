import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Logo } from '../Logo';
import {
  signInAdmin,
  AUTHORIZED_ADMIN_EMAIL,
} from '../../services/supabase';
import { AdminUser } from '../../types';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToBoutique: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToBoutique }) => {
  const [email, setEmail] = useState(AUTHORIZED_ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both administrative email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signInAdmin(email, password);

      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setErrorMessage(
          result.error || 'Authentication denied. Verify credentials or contact systems administrator.'
        );
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#041A13] text-cream-50 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-[#D4AF37]/30 selection:text-[#041A13]">
      {/* Background Decorative Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0E4937]/30 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none -ml-40 -mb-40" />

      {/* Top Bar */}
      <header className="px-6 py-6 border-b border-[#D4AF37]/20 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <Logo variant="emblem-only" />
          <div>
            <span className="font-serif text-lg tracking-[0.2em] font-bold text-cream-100 block">
              DEE HAVILAH
            </span>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] block font-medium">
              ATELIER MANAGEMENT SYSTEM
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBackToBoutique}
            className="text-xs uppercase tracking-wider text-cream-200/80 hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Back to Boutique</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10 my-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-[#062319]/90 backdrop-blur-xl border border-[#D4AF37]/40 rounded-2xl p-8 sm:p-10 shadow-2xl relative"
        >
          {/* Subtle gold line accent */}
          <div className="absolute top-0 left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

          {/* Crest & Title */}
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="mb-5 relative flex items-center justify-center">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[2px] bg-gradient-to-b from-[#D4AF37] via-[#F3E5AB] to-[#996515] shadow-xl shadow-[#D4AF37]/20">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#041A13] flex items-center justify-center ring-2 ring-[#041A13]">
                  <img
                    src="/logo-dark.jpg"
                    alt="Dee Havilah Logo"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover scale-110 object-center"
                    onError={(e) => {
                      // Fallback to /logo.jpg if /logo-dark.jpg fails
                      (e.currentTarget as HTMLImageElement).src = '/logo.jpg';
                    }}
                  />
                </div>
                {/* Ambient glow */}
                <div className="absolute inset-0 rounded-full bg-[#D4AF37]/25 blur-md -z-10" />
              </div>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cream-50 tracking-wide">
              Executive Portal
            </h1>
            <p className="text-xs text-cream-200/70 mt-2 font-light tracking-wide">
              Restricted to authorized DEE HAVILAH DESIGN administration.
            </p>
          </div>

          {/* Error Banner */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-3.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{errorMessage}</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#D4AF37] mb-2">
                Authorized Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-cream-200/50 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={AUTHORIZED_ADMIN_EMAIL}
                  className="w-full pl-10 pr-4 py-3 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-sm text-cream-100 placeholder-cream-200/30 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <div className="mb-2">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#D4AF37]">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-cream-200/50 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full pl-10 pr-11 py-3 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-sm text-cream-100 placeholder-cream-200/30 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-cream-200/50 hover:text-cream-200 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-[#041A13] font-bold text-xs uppercase tracking-[0.24em] rounded-lg shadow-xl shadow-[#D4AF37]/20 hover:brightness-105 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#041A13] border-t-transparent rounded-full animate-spin" />
                    Authenticating Credentials...
                  </span>
                ) : (
                  <>
                    <span>Enter Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-[#D4AF37]/15 text-center text-xs text-cream-200/50 relative z-10">
        <p className="font-serif">
          &copy; 2026 DEE HAVILAH DESIGN ATELIER. Confidential & Proprietary Infrastructure.
        </p>
      </footer>
    </div>
  );
};
