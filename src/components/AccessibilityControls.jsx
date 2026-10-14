import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Type,
  SunMoon,
  SpellCheck,
  RotateCcw,
  Sparkles,
  Check,
  ChevronDown,
  ZapOff,
  Zap
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
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('a11y_contrast') === 'true';
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

    // 3. High Contrast Mode
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    localStorage.setItem('a11y_contrast', highContrast);

    // 4. Dyslexic Font Mode
    if (dyslexicFont) {
      root.classList.add('dyslexia-font');
    } else {
      root.classList.remove('dyslexia-font');
    }
    localStorage.setItem('a11y_dyslexic', dyslexicFont);
  }, [screenReaderMode, textScale, highContrast, dyslexicFont]);

  const toggleScreenReader = () => {
    const next = !screenReaderMode;
    setScreenReaderMode(next);
    const msg = next
      ? 'Screen reader assistance enabled. Vocalized highlights and enhanced ARIA descriptions active.'
      : 'Screen reader mode disabled.';
    setAnnouncement(msg);
    if (next && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(msg);
      window.speechSynthesis.speak(u);
    }
  };

  const cycleTextScale = () => {
    const scales = ['normal', 'large', 'xlarge'];
    const nextIndex = (scales.indexOf(textScale) + 1) % scales.length;
    const nextScale = scales[nextIndex];
    setTextScale(nextScale);
    const label = nextScale === 'normal' ? 'Standard 100%' : nextScale === 'large' ? 'Large 114%' : 'X-Large 128%';
    const msg = `Base text scaled to ${label}`;
    setAnnouncement(msg);
    speakText(msg);
  };

  const toggleContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    const msg = next
      ? 'High Contrast mode active: Soft neumorphic shadows overridden with stark high-contrast borders.'
      : 'Standard Neumorphic soft shadows restored.';
    setAnnouncement(msg);
    speakText(msg);
  };

  const toggleDyslexicFont = () => {
    const next = !dyslexicFont;
    setDyslexicFont(next);
    const msg = next
      ? 'Bottom-heavy Dyslexic font enabled.'
      : 'Standard interface typeface restored.';
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
    setHighContrast(false);
    setDyslexicFont(false);
    if (manualReducedMotion) {
      toggleReducedMotion();
    }
    setAnnouncement('All accessibility settings reset to default.');
    speakText('All accessibility settings reset to default.');
  };

  return (
    <aside
      aria-label="Universal Accessibility Panel"
      className="fixed top-3 right-4 z-50 select-none print:hidden"
    >
      {/* Live ARIA region for screen readers */}
      <div role="status" aria-live="assertive" className="sr-only">
        {announcement}
      </div>

      {/* Floating Neumorphic Toolbar Strip */}
      <div className="bg-[#E0E5EC] rounded-2xl p-1.5 shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] border border-white/40 flex items-center gap-1.5 transition-all">
        {/* Toggle 1: Screen Reader Mode [SR] */}
        <button
          onClick={toggleScreenReader}
          aria-pressed={screenReaderMode}
          aria-label="Screen Reader Mode [SR]. Enhances ARIA labels and highlights vocalized elements."
          title="Screen Reader Mode [SR]: Enhances ARIA labels and highlights vocalized elements"
          className={`h-9 px-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400 ${
            screenReaderMode
              ? 'bg-[#E0E5EC] shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] text-blue-600'
              : 'bg-[#E0E5EC] shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[5px_5px_10px_#A3B1C6,-5px_-5px_10px_#FFFFFF] text-[#1A253C]'
          }`}
        >
          {screenReaderMode ? (
            <Volume2 className="w-4 h-4 text-blue-600 animate-pulse" />
          ) : (
            <VolumeX className="w-4 h-4 text-[#52607B]" />
          )}
          <span>[SR]</span>
        </button>

        {/* Toggle 2: A+ Text Size */}
        <button
          onClick={cycleTextScale}
          aria-label={`A+ Text Size. Current size: ${textScale}. Scales up base typography globally for improved legibility.`}
          title="A+ Text Size: Scales up base typography globally for improved legibility"
          className={`h-9 px-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400 ${
            textScale !== 'normal'
              ? 'bg-[#E0E5EC] shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] text-blue-600'
              : 'bg-[#E0E5EC] shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[5px_5px_10px_#A3B1C6,-5px_-5px_10px_#FFFFFF] text-[#1A253C]'
          }`}
        >
          <Type className="w-3.5 h-3.5 text-blue-600" />
          <span>
            {textScale === 'normal' ? 'A+' : textScale === 'large' ? 'A++' : 'A+++'}
          </span>
        </button>

        {/* Toggle 3: Contrast [🌓] */}
        <button
          onClick={toggleContrast}
          aria-pressed={highContrast}
          aria-label="Contrast Mode [🌓]. Overrides soft shadows with stark outlines and black text."
          title="Contrast [🌓]: Overrides soft shadows with stark outlines and black text for visually impaired users"
          className={`h-9 px-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400 ${
            highContrast
              ? 'bg-[#E0E5EC] shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] text-blue-600'
              : 'bg-[#E0E5EC] shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[5px_5px_10px_#A3B1C6,-5px_-5px_10px_#FFFFFF] text-[#1A253C]'
          }`}
        >
          <SunMoon className="w-4 h-4 text-amber-600" />
          <span>[🌓]</span>
        </button>

        {/* Toggle 4: Dyslexic Font [Abc] */}
        <button
          onClick={toggleDyslexicFont}
          aria-pressed={dyslexicFont}
          aria-label="Dyslexic Font [Abc]. Swaps the global font family to a bottom-heavy typeface."
          title="Dyslexic Font [Abc]: Swaps global font family to a bottom-heavy typeface (Lexend/OpenDyslexic)"
          className={`h-9 px-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400 ${
            dyslexicFont
              ? 'bg-[#E0E5EC] shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] text-blue-600'
              : 'bg-[#E0E5EC] shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[5px_5px_10px_#A3B1C6,-5px_-5px_10px_#FFFFFF] text-[#1A253C]'
          }`}
        >
          <SpellCheck className="w-4 h-4 text-emerald-600" />
          <span>[Abc]</span>
        </button>

        {/* Toggle 5: Reduced Motion [RM] */}
        <button
          onClick={handleToggleReducedMotion}
          aria-pressed={shouldReduceMotion}
          aria-label="Reduced Motion Mode [RM]. Disables slide and fade animations and defaults to zero animation."
          title="Reduced Motion [RM]: Disables all slide and fade transitions (prefers-reduced-motion / WCAG 2.3.3)"
          className={`h-9 px-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400 ${
            shouldReduceMotion
              ? 'bg-[#E0E5EC] shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] text-blue-600'
              : 'bg-[#E0E5EC] shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[5px_5px_10px_#A3B1C6,-5px_-5px_10px_#FFFFFF] text-[#1A253C]'
          }`}
        >
          {shouldReduceMotion ? (
            <ZapOff className="w-4 h-4 text-blue-600" />
          ) : (
            <Zap className="w-4 h-4 text-[#52607B]" />
          )}
          <span>[RM]</span>
        </button>

        {/* Reset / More Toggle */}
        {(screenReaderMode || textScale !== 'normal' || highContrast || dyslexicFont || manualReducedMotion) && (
          <button
            onClick={resetAll}
            aria-label="Reset all accessibility settings to standard Soft UI"
            title="Reset accessibility overrides"
            className="h-9 w-9 rounded-xl bg-[#E0E5EC] shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] active:shadow-[inset_3px_3px_6px_#A3B1C6] text-rose-600 hover:text-rose-700 flex items-center justify-center transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </aside>
  );
}
