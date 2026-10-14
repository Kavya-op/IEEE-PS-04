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
    <div className="min-h-screen w-full relative overflow-hidden bg-[#F3F5F6] text-[#0B2115] flex items-center justify-center p-4 sm:p-6 md:p-10 font-sans">
      {/* Main Floating Double-Column SaaS Card */}
      <div className="relative w-full max-w-4xl bg-white border border-[#E5E7EB] rounded-2xl shadow-xl overflow-hidden">
        <div className="relative grid grid-cols-1 md:grid-cols-2">
          {/* Left Column (System Branding) */}
          <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-between space-y-6 relative border-b md:border-b-0 md:border-r border-[#E5E7EB] bg-gray-50/60">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider bg-white border border-[#E5E7EB] text-[#0B2115] shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#9FE846] animate-pulse" />
                <span>SKIT004 OSINT ENGINE</span>
              </div>

              <h1 className="mt-5 text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-[#0B2115]">
                THREAT INTELLIGENCE PORTAL
              </h1>
              <p className="mt-2 text-xs text-gray-500 font-medium tracking-wide">
                Autonomous social media reconnaissance & deep neural threat monitoring.
              </p>
            </div>

            {/* Central Graphic */}
            <div className="relative my-4 py-8 flex items-center justify-center">
              <div className="w-40 h-40 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm flex items-center justify-center">
                <div className="w-24 h-24 rounded-xl bg-[#0B2115] border border-[#153423] flex items-center justify-center text-[#9FE846] shadow-sm">
                  <Shield className="w-12 h-12 text-[#9FE846]" />
                </div>
              </div>
            </div>

            {/* Bottom Telemetry Bar */}
            <div className="rounded-xl bg-white border border-[#E5E7EB] shadow-sm p-3 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-[#0B2115] animate-pulse" />
                <span className="text-gray-600 font-medium">OSINT SURVEILLANCE</span>
              </div>
              <span className="text-[#5C901A] font-bold tracking-wider">DEFCON // SECURE</span>
            </div>
          </div>

          {/* Right Column (Authentication Form) */}
          <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center space-y-6 bg-white">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wider bg-[#F3FAEB] text-[#5C901A] border border-[#9FE846]/40 font-mono">
                <Radio className="w-3 h-3 text-[#5C901A] animate-pulse" />
                <span>RESTRICTED ACCESS</span>
              </div>
              <h2 className="mt-3 text-xl sm:text-2xl font-bold text-[#0B2115] tracking-tight">
                Operator Clearance
              </h2>
              <p className="mt-1 text-xs text-gray-500 font-medium">
                Enter clearance credentials to initialize the threat intelligence terminal.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div
                role="alert"
                aria-live="polite"
                className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5"
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
                className="p-3.5 rounded-lg bg-[#F3FAEB] border border-[#9FE846]/40 text-[#5C901A] text-xs flex items-center gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-[#5C901A] shrink-0" aria-hidden="true" />
                <span className="font-bold">Access Authorized. Entering System...</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="investigator-email" className="block text-xs font-bold text-[#0B2115]">
                  Investigator Email
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
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
                    className="w-full rounded-lg bg-white border border-[#E5E7EB] text-[#0B2115] pl-10 pr-4 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-[#0B2115] focus:ring-1 focus:ring-[#0B2115] font-mono transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="gateway-passkey" className="block text-xs font-bold text-[#0B2115]">
                  Security Passkey
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
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
                    className="w-full rounded-lg bg-white border border-[#E5E7EB] text-[#0B2115] pl-10 pr-10 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-[#0B2115] focus:ring-1 focus:ring-[#0B2115] font-mono transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0B2115] p-1 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0B2115]"
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
                    className="w-4 h-4 rounded text-[#0B2115] accent-[#0B2115] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0B2115]"
                  />
                  <span className="font-mono text-[11px] text-gray-600 font-semibold">
                    RETAIN CLEARANCE
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => setError('Contact Gateway Administrator for credential assistance.')}
                  className="font-mono text-[11px] text-[#0B2115] hover:text-[#5C901A] hover:underline font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0B2115] rounded-sm"
                >
                  FORGOT PASSKEY?
                </button>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 space-y-2.5">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[#9FE846] hover:bg-[#8fd838] text-[#0B2115] font-semibold py-2.5 px-5 flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer disabled:opacity-60 text-xs tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-[#9FE846]"
                >
                  {loading ? (
                    <span>AUTHORIZING...</span>
                  ) : (
                    <>
                      <span>AUTHORIZE ACCESS</span>
                      <ArrowRight className="w-4 h-4 text-[#0B2115] stroke-[2.5]" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleQuickDemoBypass}
                  className="w-full rounded-lg bg-white border border-[#E5E7EB] text-[#0B2115] font-semibold py-2 px-5 flex items-center justify-center gap-2 shadow-sm hover:bg-[#F3FAEB] hover:text-[#5C901A] hover:border-[#9FE846]/40 transition-colors cursor-pointer text-xs tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-[#0B2115]"
                >
                  <span>QUICK DEMO BYPASS -&gt;</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
