import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Type,
  Moon,
  Sun,
  SpellCheck,
  RotateCcw,
  ZapOff,
  Zap,
  Eye,
  Sliders
} from 'lucide-react';
import { useAppMotion } from '../context/MotionContext';

export default function AccessibilityControls() {
  const { shouldReduceMotion, manualReducedMotion, toggleReducedMotion } = useAppMotion();

  const [screenReaderMode, setScreenReaderMode] = useState(() => {
    return localStorage.getItem('a11y_sr_mode') === 'true';
  });
  const [textScale, setTextScale] = useState(() => {
    return localStorage.getItem('a11y_text_scale') || 'normal'; // 'normal' | 'large' | 'xlarge'
  });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return document.documentElement.classList.contains('dark');
  });
  const [dyslexicFont, setDyslexicFont] = useState(() => {
    return localStorage.getItem('a11y_dyslexic') === 'true';
  });
  const [announcement, setAnnouncement] = useState('');

  // Vocalize announcement for Screen Reader Mode
  const speakText = (text) => {
    if ('speechSynthesis' in window && screenReaderMode) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Sync state with HTML root classes and localStorage
  useEffect(() => {
    const root = document.documentElement;

    // 1. Screen Reader Mode
    if (screenReaderMode) {
      root.classList.add('sr-mode');
    } else {
      root.classList.remove('sr-mode');
    }
    localStorage.setItem('a11y_sr_mode', screenReaderMode);

    // 2. Text Scaling
    root.classList.remove('text-scale-large', 'text-scale-xlarge');
    if (textScale === 'large') root.classList.add('text-scale-large');
    if (textScale === 'xlarge') root.classList.add('text-scale-xlarge');
    localStorage.setItem('a11y_text_scale', textScale);

    // 3. Dark Theme Mode
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');

    // 4. Dyslexic Font Mode
    if (dyslexicFont) {
      root.classList.add('dyslexia-font');
    } else {
      root.classList.remove('dyslexia-font');
    }
    localStorage.setItem('a11y_dyslexic', dyslexicFont);
  }, [screenReaderMode, textScale, darkMode, dyslexicFont]);

  // Synchronize with external theme triggers (e.g. Header theme button)
  useEffect(() => {
    const handleThemeEvent = (e) => {
      if (typeof e.detail?.darkMode === 'boolean') {
        setDarkMode(e.detail.darkMode);
      }
    };
    window.addEventListener('themechange', handleThemeEvent);
    return () => window.removeEventListener('themechange', handleThemeEvent);
  }, []);

  const toggleScreenReader = () => {
    const next = !screenReaderMode;
    setScreenReaderMode(next);
    const msg = next
      ? 'Screen reader assistance enabled. Vocalized highlights and enhanced ARIA descriptions active.'
      : 'Screen reader mode disabled.';
    setAnnouncement(msg);
    speakText(msg);
  };

  const cycleTextScale = () => {
    let next = 'normal';
    let label = 'Standard 100%';
    if (textScale === 'normal') {
      next = 'large';
      label = 'Enlarged 115%';
    } else if (textScale === 'large') {
      next = 'xlarge';
      label = 'Maximum 130%';
    }
    setTextScale(next);
    const msg = `Text size changed to ${label}.`;
    setAnnouncement(msg);
    speakText(msg);
  };

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    const root = document.documentElement;
    if (next) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    window.dispatchEvent(new CustomEvent('themechange', { detail: { darkMode: next } }));
    const msg = next ? 'Dark mode enabled.' : 'Light mode enabled.';
    setAnnouncement(msg);
    speakText(msg);
  };

  const toggleDyslexicFont = () => {
    const next = !dyslexicFont;
    setDyslexicFont(next);
    const msg = next
      ? 'Dyslexia-friendly high-contrast typeface applied.'
      : 'Standard system font restored.';
    setAnnouncement(msg);
    speakText(msg);
  };

  const handleToggleReducedMotion = () => {
    toggleReducedMotion();
    const next = !manualReducedMotion;
    const msg = next
      ? 'Reduced motion enabled: All slide and fade transitions disabled.'
      : 'Standard spring animations restored.';
    setAnnouncement(msg);
    speakText(msg);
  };

  const resetAll = () => {
    setScreenReaderMode(false);
    setTextScale('normal');
    setDarkMode(false);
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    window.dispatchEvent(new CustomEvent('themechange', { detail: { darkMode: false } }));
    setDyslexicFont(false);
    if (manualReducedMotion) {
      toggleReducedMotion();
    }
    setAnnouncement('All accessibility settings reset to default.');
    speakText('All accessibility settings reset to default.');
  };

  const hasOverrides = screenReaderMode || textScale !== 'normal' || darkMode || dyslexicFont || manualReducedMotion;

  return (
    <aside
      aria-label="Universal Accessibility Controls"
      className="w-full select-none print:hidden overflow-hidden"
    >
      {/* Live ARIA region for screen readers */}
      <div role="status" aria-live="assertive" className="sr-only">
        {announcement}
      </div>

      {/* Clean Crypto-Fintech Panel Container */}
      <div className="w-full bg-white dark:bg-[#151E32] rounded-2xl p-4 border border-[#E5E9F2] dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 min-w-0">
            <Sliders className="w-4 h-4 text-[#2563EB] shrink-0" />
            <h4 className="text-xs font-mono font-extrabold text-[#1A253C] dark:text-white uppercase tracking-wider truncate">
              Accessibility & Display
            </h4>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800 shrink-0">
            WCAG 2.1 AA
          </span>
        </div>

        {/* Toolbar Buttons Grid / Row */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Toggle 1: Screen Reader Mode [SR] */}
          <button
            onClick={toggleScreenReader}
            aria-pressed={screenReaderMode}
            aria-label="Screen Reader Mode [SR]. Enhances ARIA labels and highlights vocalized elements."
            title="Screen Reader Mode [SR]: Enhances ARIA labels and vocalizes highlights"
            className={`h-8 px-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0 ${
              screenReaderMode
                ? 'bg-blue-50 text-[#2563EB] border border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800 shadow-2xs font-extrabold'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
            }`}
          >
            {screenReaderMode ? (
              <Volume2 className="w-3.5 h-3.5 text-[#2563EB] animate-pulse" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>[SR]</span>
          </button>

          {/* Toggle 2: A+ Text Size */}
          <button
            onClick={cycleTextScale}
            aria-label={`Text Scaling. Current size: ${textScale}.`}
            title="A+ Text Scale: Enlarge typography globally"
            className={`h-8 px-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0 ${
              textScale !== 'normal'
                ? 'bg-blue-50 text-[#2563EB] border border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800 shadow-2xs font-extrabold'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
            }`}
          >
            <Type className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{textScale === 'normal' ? 'A+' : textScale === 'large' ? 'A++' : 'A+++'}</span>
          </button>

          {/* Toggle 3: Dark Mode / Dark Theme */}
          <button
            onClick={toggleDarkMode}
            aria-pressed={darkMode}
            aria-label={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            title={darkMode ? 'Theme: Dark (Click for Light)' : 'Theme: Light (Click for Dark)'}
            className={`h-8 px-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0 ${
              darkMode
                ? 'bg-blue-50 text-[#2563EB] border border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800 shadow-2xs font-extrabold'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
            }`}
          >
            {darkMode ? (
              <Moon className="w-3.5 h-3.5 text-blue-400" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span>{darkMode ? '[Dark]' : '[Light]'}</span>
          </button>

          {/* Toggle 4: Dyslexic Font [Abc] */}
          <button
            onClick={toggleDyslexicFont}
            aria-pressed={dyslexicFont}
            aria-label="Dyslexic Font [Abc]. Swaps global font family to a bottom-heavy typeface."
            title="Dyslexic Font [Abc]: High legibility typeface"
            className={`h-8 px-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0 ${
              dyslexicFont
                ? 'bg-blue-50 text-[#2563EB] border border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800 shadow-2xs font-extrabold'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
            }`}
          >
            <SpellCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>[Abc]</span>
          </button>

          {/* Toggle 5: Reduced Motion [RM] */}
          <button
            onClick={handleToggleReducedMotion}
            aria-pressed={shouldReduceMotion}
            aria-label="Reduced Motion Mode [RM]. Disables animations."
            title="Reduced Motion [RM]: Disable transitions (prefers-reduced-motion)"
            className={`h-8 px-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0 ${
              shouldReduceMotion
                ? 'bg-blue-50 text-[#2563EB] border border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800 shadow-2xs font-extrabold'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
            }`}
          >
            {shouldReduceMotion ? (
              <ZapOff className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>[RM]</span>
          </button>

          {/* Reset Action */}
          {hasOverrides && (
            <button
              onClick={resetAll}
              aria-label="Reset accessibility settings"
              title="Reset accessibility overrides to default"
              className="h-8 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 flex items-center gap-1 text-[11px] font-mono font-bold transition-all cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
