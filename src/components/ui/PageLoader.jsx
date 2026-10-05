import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const PageLoader = ({ isInitial = false, isTransition = false, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Generate deterministic twinkling stars
  const stars = React.useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      x: `${(i * 17 + 7) % 96 + 2}%`,
      y: `${(i * 23 + 11) % 94 + 3}%`,
      size: (i % 3 === 0 ? 2.5 : i % 2 === 0 ? 1.8 : 1.2),
      opacity: 0.25 + (i % 5) * 0.15,
      delay: (i * 0.18) % 3.5,
      duration: 2.8 + (i % 4) * 1.2
    }));
  }, []);

  // Smooth cinematic progress counter for Initial Load (~2.4s total)
  useEffect(() => {
    if (!isInitial) return;

    const startTime = performance.now();
    const duration = 2200; // 2.2 seconds progression + 350ms hold at 100%
    let animationFrameId;

    const updateProgress = (currentTime) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(1, elapsed / duration);
      
      // Custom smooth cubic bezier easing for organic acceleration & deceleration
      // Easing: starts gentle, picks up speed, then slows gracefully into 100%
      const eased = t < 0.5 
        ? 4 * t * t * t 
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const currentVal = Math.min(100, Math.round(eased * 100));
      setProgress(currentVal);

      if (t < 1) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        setTimeout(() => {
          if (onCompleteRef.current) onCompleteRef.current();
        }, 380);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isInitial]);

  // Smooth route transition progression (~800ms)
  useEffect(() => {
    if (!isTransition) return;

    const startTime = performance.now();
    const duration = 650;
    let animationFrameId;

    const updateRouteProgress = (currentTime) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setProgress(Math.min(100, Math.round(eased * 100)));

      if (t < 1) {
        animationFrameId = requestAnimationFrame(updateRouteProgress);
      } else {
        setTimeout(() => {
          if (onCompleteRef.current) onCompleteRef.current();
        }, 220);
      }
    };

    animationFrameId = requestAnimationFrame(updateRouteProgress);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isTransition]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 1.03, 
        filter: 'blur(12px)',
        transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } 
      }}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#05060B] overflow-hidden select-none pointer-events-auto"
      style={{
        background: 'radial-gradient(circle at 50% 50%, #0A122E 0%, #05060B 70%, #020306 100%)'
      }}
    >
      {/* Background Starfield Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {stars.map((star) => (
          <motion.span
            key={star.id}
            initial={{ opacity: star.opacity * 0.4 }}
            animate={{
              opacity: [star.opacity * 0.25, star.opacity, star.opacity * 0.25],
              scale: [1, 1.25, 1]
            }}
            transition={{
              repeat: Infinity,
              duration: star.duration,
              delay: star.delay,
              ease: 'easeInOut'
            }}
            style={{
              position: 'absolute',
              left: star.x,
              top: star.y,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.id % 4 === 0 ? '#00E5FF' : '#FFFFFF',
              borderRadius: '9999px',
              boxShadow: star.size > 2 ? '0 0 8px rgba(0, 229, 255, 0.85)' : 'none'
            }}
          />
        ))}

        {/* Ambient Center Glow */}
        <motion.div 
          animate={{
            scale: [0.95, 1.05, 0.95],
            opacity: [0.7, 0.9, 0.7]
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: 'easeInOut'
          }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[360px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(35, 61, 255, 0.25) 0%, rgba(0, 229, 255, 0.1) 45%, transparent 70%)',
            filter: 'blur(45px)'
          }}
        />
      </div>

      {/* Center Brand Logo Capsule Container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Capsule Pill Wrapper */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-center"
        >
          {/* SVG Animated Capsule Border with Glowing Neon Trail */}
          <svg
            className="w-[270px] sm:w-[330px] h-[70px] sm:h-[82px] overflow-visible"
            viewBox="0 0 320 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Neon Cyan to Electric Blue Gradient */}
              <linearGradient id="neonTrailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity="1" />
                <stop offset="35%" stopColor="#233DFF" stopOpacity="0.95" />
                <stop offset="75%" stopColor="#233DFF" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#233DFF" stopOpacity="0" />
              </linearGradient>

              {/* Multi-layered Neon Bloom Filter */}
              <filter id="neonGlow" x="-35%" y="-35%" width="170%" height="170%">
                <feGaussianBlur stdDeviation="3" result="blur1" />
                <feGaussianBlur stdDeviation="6.5" result="blur2" />
                <feGaussianBlur stdDeviation="12" result="blur3" />
                <feMerge>
                  <feMergeNode in="blur3" />
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Base Capsule Background */}
            <rect
              x="3"
              y="3"
              width="314"
              height="74"
              rx="37"
              ry="37"
              fill="#060913"
              fillOpacity="0.88"
            />

            {/* Faint Static Capsule Rim */}
            <rect
              x="3"
              y="3"
              width="314"
              height="74"
              rx="37"
              ry="37"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1.2"
            />

            {/* Animated Glowing Comet Trail Orbiting the Capsule */}
            <rect
              x="3"
              y="3"
              width="314"
              height="74"
              rx="37"
              ry="37"
              stroke="url(#neonTrailGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#neonGlow)"
              className="animate-capsule-orbit"
              style={{
                strokeDasharray: '175 537',
              }}
            />
          </svg>

          {/* Centered Typography: adlogix. */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="flex items-baseline tracking-tight font-display">
              <span className="text-white text-2xl sm:text-3xl font-light tracking-tight">ad</span>
              <span className="text-white text-2xl sm:text-3xl font-black tracking-tight ml-[1px]">logix</span>
              <span 
                className="text-[#233DFF] text-3xl sm:text-4xl font-black leading-none ml-1 animate-pulse"
                style={{
                  textShadow: '0 0 16px rgba(35, 61, 255, 0.9), 0 0 30px rgba(0, 229, 255, 0.7)'
                }}
              >
                .
              </span>
            </span>
          </div>
        </motion.div>

        {/* Powered by Aumento Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease: 'easeOut' }}
          className="mt-5 flex items-center gap-2"
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-blue shadow-[0_0_8px_#233DFF]" />
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.26em] uppercase text-slate-400 font-display">
            POWERED BY <strong className="text-white font-extrabold tracking-[0.28em]">AUMENTO</strong>
          </span>
        </motion.div>

        {/* Minimal Progress Line & Counter (for initial load) */}
        {isInitial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-7 flex flex-col items-center gap-2.5 w-52"
          >
            {/* Progress track */}
            <div className="w-full h-[2.5px] bg-white/10 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-brand-blue via-[#00E5FF] to-white rounded-full transition-all duration-75 ease-out"
                style={{
                  width: `${progress}%`,
                  boxShadow: '0 0 12px rgba(0, 229, 255, 0.9)'
                }}
              />
            </div>

            {/* Percentage text */}
            <div className="text-[10px] font-mono tracking-widest text-slate-400 flex items-center justify-between w-full">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">INITIALIZING</span>
              <span className="font-bold text-white/90">{progress.toString().padStart(3, '0')}%</span>
            </div>
          </motion.div>
        )}

        {/* Route Transit Indicator (for page clicks) */}
        {isTransition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="mt-6 flex flex-col items-center gap-2 w-44"
          >
            <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-brand-blue via-[#00E5FF] to-white rounded-full transition-all duration-75 ease-out"
                style={{
                  width: `${progress}%`,
                  boxShadow: '0 0 10px rgba(0, 229, 255, 0.8)'
                }}
              />
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-slate-400 uppercase">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-ping" />
              <span>ENTERING PAGE</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
