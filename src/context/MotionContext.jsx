import React, { createContext, useContext, useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

const MotionContext = createContext(null);

export function MotionProvider({ children }) {
  const osReducedMotion = useReducedMotion();
  const [manualReducedMotion, setManualReducedMotion] = useState(() => {
    return localStorage.getItem('a11y_reduced_motion') === 'true';
  });

  const shouldReduceMotion = Boolean(osReducedMotion || manualReducedMotion);

  useEffect(() => {
    const root = document.documentElement;
    if (shouldReduceMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    localStorage.setItem('a11y_reduced_motion', manualReducedMotion);
  }, [shouldReduceMotion, manualReducedMotion]);

  const toggleReducedMotion = () => {
    setManualReducedMotion((prev) => !prev);
  };

  // Global Page Load Transitions (Slide & Fade):
  // When a page mounts, fade in from opacity: 0 and slide up slightly from y: 20 to y: 0 with a smooth spring physics duration of 0.6s
  const pageVariants = shouldReduceMotion
    ? {
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 1, y: 0 },
        transition: { duration: 0 }
      }
    : {
        initial: { opacity: 0, y: 20 },
        animate: {
          opacity: 1,
          y: 0,
          transition: {
            type: 'spring',
            damping: 24,
            stiffness: 110,
            duration: 0.6
          }
        },
        exit: {
          opacity: 0,
          y: -12,
          transition: { duration: 0.25, ease: 'easeOut' }
        }
      };

  // Staggered Scroll Reveals (Alerts & Widgets):
  // Framer Motion staggerChildren property with 0.1s delay between each item
  const getStaggerContainer = (staggerDelay = 0.1, delayChildren = 0.05) =>
    shouldReduceMotion
      ? {
          hidden: { opacity: 1 },
          visible: { opacity: 1, transition: { duration: 0 } }
        }
      : {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: staggerDelay,
              delayChildren
            }
          }
        };

  const staggerItemVariants = shouldReduceMotion
    ? {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 1, y: 0, transition: { duration: 0 } }
      }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            type: 'spring',
            damping: 22,
            stiffness: 130
          }
        }
      };

  // Interactive Neumorphic Hover/Tap States:
  // whileHover: shadow-[12px_12px_20px_#A3B1C6,-12px_-12px_20px_#FFFFFF], scale: 1.02
  // whileTap: shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF], scale: 0.98
  const neuButtonProps = shouldReduceMotion
    ? {}
    : {
        whileHover: {
          scale: 1.02,
          boxShadow: '12px 12px 20px #A3B1C6, -12px -12px 20px #FFFFFF'
        },
        whileTap: {
          scale: 0.98,
          boxShadow: 'inset 6px 6px 12px #A3B1C6, inset -6px -6px 12px #FFFFFF'
        },
        transition: { type: 'spring', stiffness: 450, damping: 25 }
      };

  const neuCardProps = shouldReduceMotion
    ? {}
    : {
        whileHover: {
          scale: 1.015,
          boxShadow: '12px 12px 20px #A3B1C6, -12px -12px 20px #FFFFFF'
        },
        transition: { type: 'spring', stiffness: 350, damping: 25 }
      };

  return (
    <MotionContext.Provider
      value={{
        shouldReduceMotion,
        manualReducedMotion,
        toggleReducedMotion,
        pageVariants,
        getStaggerContainer,
        staggerItemVariants,
        neuButtonProps,
        neuCardProps
      }}
    >
      {children}
    </MotionContext.Provider>
  );
}

export function useAppMotion() {
  const context = useContext(MotionContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      shouldReduceMotion: false,
      manualReducedMotion: false,
      toggleReducedMotion: () => {},
      pageVariants: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 }
      },
      getStaggerContainer: () => ({ hidden: { opacity: 0 }, visible: { opacity: 1 } }),
      staggerItemVariants: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } },
      neuButtonProps: {
        whileHover: { scale: 1.02, boxShadow: '12px 12px 20px #A3B1C6, -12px -12px 20px #FFFFFF' },
        whileTap: { scale: 0.98, boxShadow: 'inset 6px 6px 12px #A3B1C6, inset -6px -6px 12px #FFFFFF' }
      },
      neuCardProps: {
        whileHover: { scale: 1.015, boxShadow: '12px 12px 20px #A3B1C6, -12px -12px 20px #FFFFFF' }
      }
    };
  }
  return context;
}
