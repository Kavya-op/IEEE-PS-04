import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAppMotion } from '../context/MotionContext';
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Radio
} from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const { neuButtonProps, shouldReduceMotion } = useAppMotion();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [retainCredentials, setRetainCredentials] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (auth && auth.app?.options?.apiKey && !auth.app.options.apiKey.includes('Placeholder')) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (!email.includes('@') || password.length < 4) {
          throw new Error('Please enter a valid investigator email and passcode.');
        }
      }

      setSuccess(true);
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess({ email, role: 'Lead Threat Analyst' });
        }
      }, 400);
    } catch (err) {
      console.error('Auth Error:', err);
      setError(err.message || 'Authorization failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoBypass = () => {
    setEmail('investigator@cyberpulse.net');
    setPassword('PulseSecOps2026!');
    setError(null);
    setSuccess(true);
    if (onLoginSuccess) {
      onLoginSuccess({ email: 'investigator@cyberpulse.net', role: 'Lead Threat Analyst' });
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#E0E5EC] text-[#1A253C] flex items-center justify-center p-4 sm:p-6 md:p-10 font-sans selection:bg-blue-600/20 selection:text-[#1A253C]">
      {/* Main Floating Double-Column Neumorphic Container */}
      <div className="relative w-full max-w-4xl bg-[#E0E5EC] border border-white/80 rounded-[32px] shadow-[16px_16px_32px_#A3B1C6,-16px_-16px_32px_#FFFFFF] overflow-hidden">
        <div className="relative grid grid-cols-1 md:grid-cols-2">
          {/* Left Column (System Branding) */}
          <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-between space-y-6 relative border-b md:border-b-0 md:border-r border-[#A3B1C6]/30">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider bg-[#E0E5EC] text-[#2563EB] shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
                <span>SKIT004 OSINT ENGINE</span>
              </div>

              <h1 className="mt-5 text-3xl sm:text-4xl font-black tracking-tight leading-none text-[#1A253C]">
                THREAT INTELLIGENCE PORTAL
              </h1>
              <p className="mt-2 text-xs text-[#52607B] font-medium tracking-wide">
                Autonomous social media reconnaissance & deep neural threat monitoring.
              </p>
            </div>

            {/* Central Neumorphic Badge Graphic */}
            <div className="relative my-4 py-8 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full bg-[#E0E5EC] shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF] flex items-center justify-center relative">
                <div className="w-32 h-32 rounded-full bg-[#E0E5EC] shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] flex items-center justify-center">
                  <Shield className="w-16 h-16 text-[#2563EB]" />
                </div>
              </div>
            </div>

            {/* Bottom Telemetry Bar */}
            <div className="rounded-2xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#A3B1C6,inset_-3px_-3px_6px_#FFFFFF] p-3.5 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-[#2563EB] animate-pulse" />
                <span className="text-[#52607B] font-medium">OSINT SURVEILLANCE</span>
              </div>
              <span className="text-emerald-600 font-bold tracking-wider">DEFCON // SECURE</span>
            </div>
          </div>

          {/* Right Column (Authentication Form) */}
          <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider bg-[#E0E5EC] text-[#52607B] shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] font-mono">
                <Radio className="w-3 h-3 text-[#2563EB] animate-pulse" />
                <span>RESTRICTED ACCESS</span>
              </div>
              <h2 className="mt-3 text-2xl font-black text-[#1A253C] tracking-tight">
                Operator Clearance
              </h2>
              <p className="mt-1 text-xs text-[#52607B] font-medium">
                Enter clearance credentials to initialize the Neumorphic threat intelligence terminal.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div
                role="alert"
                aria-live="polite"
                className="p-3.5 rounded-2xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#A3B1C6,inset_-3px_-3px_6px_#FFFFFF] text-rose-600 text-xs flex items-start gap-2.5"
              >
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" aria-hidden="true" />
                <span className="flex-1 font-medium">{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div
                role="alert"
                aria-live="polite"
                className="p-3.5 rounded-2xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#A3B1C6,inset_-3px_-3px_6px_#FFFFFF] text-emerald-600 text-xs flex items-center gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />
                <span className="font-bold">Access Authorized. Entering System...</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="investigator-email" className="block text-xs font-bold text-[#1A253C]">
                  Investigator Email
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#52607B] pointer-events-none">
                    <Shield className="w-4 h-4" />
                  </div>
                  <input
                    id="investigator-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="investigator@cyberpulse.net"
                    className="w-full rounded-2xl bg-[#E0E5EC] text-[#1A253C] pl-11 pr-5 py-3.5 text-sm shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF] placeholder-[#52607B] focus:outline-none focus:ring-4 focus:ring-blue-400 font-mono transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="gateway-passkey" className="block text-xs font-bold text-[#1A253C]">
                  Security Passkey
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#52607B] pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="gateway-passkey"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-2xl bg-[#E0E5EC] text-[#1A253C] pl-11 pr-11 py-3.5 text-sm shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF] placeholder-[#52607B] focus:outline-none focus:ring-4 focus:ring-blue-400 font-mono transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#52607B] hover:text-[#1A253C] p-1.5 rounded-full cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Utility Row */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={retainCredentials}
                    onChange={(e) => setRetainCredentials(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2563EB] accent-[#2563EB] cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400"
                  />
                  <span className="font-mono text-[11px] text-[#52607B] font-semibold">
                    RETAIN CLEARANCE
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => setError('Contact Gateway Administrator for credential assistance.')}
                  className="font-mono text-[11px] text-[#2563EB] hover:underline font-semibold cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400 rounded-sm"
                >
                  FORGOT PASSKEY?
                </button>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 space-y-3">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02, boxShadow: '8px 8px 18px rgba(37,99,235,0.45), -6px -6px 14px #FFFFFF' }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98, boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.3)' }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  className="w-full rounded-2xl bg-[#2563EB] text-white font-bold py-3.5 px-6 flex items-center justify-center gap-2.5 shadow-[6px_6px_14px_rgba(37,99,235,0.4),-4px_-4px_10px_#FFFFFF] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)] transition-colors cursor-pointer disabled:opacity-60 text-sm tracking-wider uppercase focus:outline-none focus:ring-4 focus:ring-blue-400"
                >
                  {loading ? (
                    <span>AUTHORIZING...</span>
                  ) : (
                    <>
                      <span>AUTHORIZE ACCESS</span>
                      <ArrowRight className="w-4 h-4 text-white stroke-[2.5]" />
                    </>
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  {...neuButtonProps}
                  onClick={handleQuickDemoBypass}
                  className="w-full rounded-2xl bg-[#E0E5EC] text-[#1A253C] font-bold py-3 px-6 flex items-center justify-center gap-2 shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] active:shadow-[inset_2px_2px_5px_#A3B1C6,inset_-2px_-2px_5px_#FFFFFF] transition-colors cursor-pointer text-xs tracking-wider uppercase hover:text-[#2563EB] focus:outline-none focus:ring-4 focus:ring-blue-400"
                >
                  <span>QUICK DEMO BYPASS -&gt;</span>
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
