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

  // Interactive SaaS Hover/Tap States:
  const neuButtonProps = shouldReduceMotion
    ? {}
    : {
        whileHover: {
          scale: 1.01
        },
        whileTap: {
          scale: 0.98
        },
        transition: { type: 'spring', stiffness: 450, damping: 25 }
      };

  const neuCardProps = shouldReduceMotion
    ? {}
    : {
        whileHover: {
          y: -2
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
        whileHover: { scale: 1.01 },
        whileTap: { scale: 0.98 }
      },
      neuCardProps: {
        whileHover: { y: -2 }
      }
    };
  }
  return context;
}
