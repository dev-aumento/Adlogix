import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Phone, Play, Sparkles, TrendingUp, ShieldCheck, Zap, Star, Trophy, Handshake } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCMS } from '../../hooks/useCMS';
import { useWordPressData } from '../../hooks/useWordPressData';
import { api } from '../../services/api';
import { mergeHomeHero } from '../../services/normalizers';
import { homeHeroFallback } from '../../data/homeHeroData';

// Icons stay in React; WordPress only supplies the metric text, in this order.
const metricIcons = [
  { Icon: Handshake, className: '' },
  { Icon: Sparkles, className: '' },
  { Icon: Trophy, className: '' },
  { Icon: Star, className: 'fill-brand-blue' }
];

export const HeroSection = () => {
  const { settings, openVideoModal, openDiscoveryModal, reels } = useCMS();
  const featuredReel = reels && reels.length > 0 ? reels[0] : null;

  // While loading, on empty content, or on API failure the static fallback renders,
  // so the hero never collapses or shifts layout.
  const { data: wpHero, status: heroStatus } = useWordPressData('home-hero', api.getHomeHero);
  const { content: hero, missing: missingHeroFields } = useMemo(
    () => mergeHomeHero(wpHero, homeHeroFallback),
    [wpHero]
  );

  useEffect(() => {
    if (import.meta.env.DEV && heroStatus === 'success' && missingHeroFields.length > 0) {
      console.warn(
        `[WordPress] home-hero: empty fields fell back to static content: ${missingHeroFields.join(', ')}`
      );
    }
  }, [heroStatus, missingHeroFields]);

  const specializations = hero.specializations;
  const [currentSpecIndex, setCurrentSpecIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSpecIndex((prev) => (prev + 1) % specializations.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [specializations.length]);

  const primaryCtaIsInternal = hero.primaryCta.href.startsWith('/');

  return (
    <section
      aria-busy={heroStatus === 'loading'}
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-white text-brand-navy pt-28 pb-20 lg:pt-32 lg:pb-28"
    >
      {/* Glossy White Mesh & Ambient Blue Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Radial Ambient Blue Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[550px] bg-gradient-to-tr from-brand-blue/10 via-cyan-400/10 to-transparent rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-[10%] w-[450px] h-[450px] bg-brand-blue/5 rounded-full blur-[100px]" />
        <div className="absolute -bottom-10 left-[8%] w-[400px] h-[400px] bg-cyan-400/8 rounded-full blur-[90px]" />

        {/* Subtle geometric dot grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(#233DFF 1.5px, transparent 1.5px)`,
            backgroundSize: '36px 36px'
          }}
        />
      </div>

      {/* Floating 3D Geometric Elements (Active on Mobile & Desktop for Rich Glossy Depth) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        {/* Central Frosted Glass Octagon Backdrop */}
        <motion.div
          animate={{
            scale: [1, 1.04, 1],
            rotate: [0, 3, 0],
            opacity: [0.55, 0.75, 0.55]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="w-[320px] sm:w-[540px] md:w-[640px] aspect-square absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-60 sm:opacity-75"
          style={{
            clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
            background: "linear-gradient(135deg, rgba(35, 61, 255, 0.09) 0%, rgba(0, 210, 255, 0.06) 50%, rgba(245, 247, 255, 0.92) 100%)",
            border: "1px solid rgba(35, 61, 255, 0.15)",
            boxShadow: "0 20px 60px rgba(35, 61, 255, 0.1)"
          }}
        />

        {/* Floating 3D Torus Ring (Glossy Electric Blue & Cyan) */}
        <motion.div
          animate={{
            y: [-12, 12, -12],
            rotate: [0, 15, 0],
            scale: [1, 1.03, 1]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-4 sm:right-[4%] lg:right-[10%] top-[14%] sm:top-[32%] w-24 sm:w-36 md:w-44 aspect-square z-0 opacity-70 sm:opacity-85 pointer-events-none"
        >
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_15px_35px_rgba(35,61,255,0.25)]">
            <defs>
              <linearGradient id="glossyTorusGrad" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00D2FF" />
                <stop offset="0.5" stopColor="#233DFF" />
                <stop offset="1" stopColor="#EBF0FF" />
              </linearGradient>
              <radialGradient id="glossyTorusHighlight" cx="60" cy="50" r="80" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="0.6" stopColor="#00D2FF" stopOpacity="0.2" />
                <stop offset="1" stopColor="#233DFF" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="75" stroke="url(#glossyTorusGrad)" strokeWidth="34" fill="none" />
            <circle cx="100" cy="100" r="75" stroke="url(#glossyTorusHighlight)" strokeWidth="34" fill="none" />
            <ellipse cx="70" cy="70" rx="35" ry="14" fill="white" opacity="0.6" transform="rotate(-30 70 70)" />
          </svg>
        </motion.div>

        {/* Floating 3D Hexagon/Crystal (Top-Right) */}
        <motion.div
          animate={{
            y: [8, -8, 8],
            rotate: [15, -15, 15]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute right-[8%] sm:right-[18%] top-[6%] sm:top-[12%] w-10 sm:w-16 aspect-square z-0 opacity-70 sm:opacity-80 pointer-events-none drop-shadow-[0_10px_20px_rgba(0,210,255,0.25)]"
        >
          <div 
            className="w-full h-full bg-gradient-to-tr from-brand-blue/80 via-cyan-400 to-indigo-500/80 backdrop-blur-md"
            style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
          />
        </motion.div>

        {/* Floating 3D Octagon Glass (Left side) */}
        <motion.div
          animate={{
            y: [-10, 10, -10],
            rotate: [-10, 10, -10]
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute -left-3 sm:left-[5%] top-[22%] sm:top-[28%] w-16 sm:w-28 aspect-square z-0 opacity-60 sm:opacity-50 pointer-events-none drop-shadow-[0_10px_25px_rgba(35,61,255,0.15)]"
        >
          <div 
            className="w-full h-full bg-gradient-to-br from-white/90 via-brand-surface-soft to-brand-blue-light/70 backdrop-blur-md border border-brand-blue/20 shadow-glossy"
            style={{ clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)" }}
          />
        </motion.div>

        {/* Floating 3D Spherical Glow (Bottom-Left) */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[10%] bottom-[12%] w-12 sm:w-20 aspect-square rounded-full bg-gradient-to-tr from-cyan-400/30 to-brand-blue/30 blur-md pointer-events-none"
        />
      </div>

      {/* Main Content Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center w-full">
        
        {/* Top Reference-Style Badge with Pulsing Blue Dot - Responsive & Properly Aligned */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center gap-2 sm:gap-2.5 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-white/95 border border-brand-blue/25 shadow-sm backdrop-blur-md mb-5 sm:mb-8 select-none max-w-full"
        >
          <span className="flex h-2 w-2 sm:h-2.5 sm:w-2.5 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-brand-blue"></span>
          </span>
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-brand-navy text-center leading-tight">
            {hero.badge.text}
            {hero.badge.highlight && (
              <>
                {' '}<span className="text-slate-300">•</span> <span className="text-brand-blue font-black">{hero.badge.highlight}</span>
              </>
            )}
          </span>
        </motion.div>

        {/* High-Impact Creative & Professional Hero Headline with Balanced Mobile & Desktop Spacing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col items-center justify-center text-center my-3 sm:my-6 space-y-2 sm:space-y-4 select-none w-full"
        >
          {/* Part 1: Attention */}
          <div className="flex flex-col items-center w-full">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[64px] font-extrabold uppercase tracking-tight text-brand-navy leading-tight sm:leading-[1.1] font-display">
              {hero.headline.line1}
            </h1>
            <div className="mt-0.5 sm:mt-1.5">
              <span className="text-3xl sm:text-5xl md:text-6xl lg:text-[76px] font-black uppercase tracking-tight text-brand-blue leading-tight sm:leading-[1.05] font-display relative inline-block drop-shadow-[0_4px_24px_rgba(35,61,255,0.35)]">
                {hero.headline.highlight1}
                <span className="absolute -inset-x-3 -inset-y-1 bg-brand-blue/15 blur-xl -z-10 rounded-full pointer-events-none" />
              </span>
            </div>
          </div>

          {/* Part 2: Business */}
          <div className="flex flex-col items-center w-full pt-1 sm:pt-2">
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[64px] font-extrabold uppercase tracking-tight text-brand-navy leading-tight sm:leading-[1.1] font-display">
              {hero.headline.line2}
            </h2>
            <div className="mt-0.5 sm:mt-1.5">
              <span className="text-3xl sm:text-5xl md:text-6xl lg:text-[76px] font-black uppercase tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-blue via-indigo-600 to-cyan-500 leading-tight sm:leading-[1.05] font-display relative inline-block drop-shadow-[0_4px_24px_rgba(35,61,255,0.3)]">
                {hero.headline.highlight2}
                <span className="absolute -inset-x-3 -inset-y-1 bg-cyan-400/15 blur-xl -z-10 rounded-full pointer-events-none" />
              </span>
            </div>
          </div>
        </motion.div>

        {/* Dynamic Specialization Rotator - Clean Mobile Alignment (No Awkward Word Break) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-base md:text-lg font-medium text-brand-navy mt-4 mb-6 sm:mb-8 text-center"
        >
          <span className="text-brand-muted text-xs sm:text-sm font-medium">{hero.specializationsIntro}</span>
          <div className="h-7 sm:h-8 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentSpecIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.25 }}
                className="font-extrabold text-brand-blue border-b-2 border-brand-blue pb-0.5 whitespace-nowrap text-xs sm:text-sm md:text-base"
              >
                {specializations[currentSpecIndex % specializations.length]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Supporting Copy */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="max-w-2xl text-center space-y-2 mb-6 text-brand-muted text-xs sm:text-base font-normal leading-relaxed px-2"
        >
          <p className="font-semibold text-brand-navy text-xs sm:text-base">
            {hero.lead}
          </p>
          <p className="text-slate-600 text-[11px] sm:text-sm leading-relaxed">
            {hero.description}
          </p>
        </motion.div>

        {/* Dedicated "Powered by Aumento" Trust Line in Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="mb-8 flex items-center justify-center select-none"
        >
          <a
            href={hero.partner.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-surface-soft/90 hover:bg-brand-blue-light/50 border border-brand-blue/20 hover:border-brand-blue/40 text-xs text-slate-600 hover:text-brand-blue transition-all shadow-xs backdrop-blur-sm group"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-[11px] sm:text-xs font-semibold">
              {hero.partner.label} <strong className="text-brand-navy group-hover:text-brand-blue font-bold transition-colors">{hero.partner.name}</strong>
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-brand-blue group-hover:translate-x-0.5 transition-transform shrink-0" />
          </a>
        </motion.div>

        {/* Dual High-Impact Pill CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto px-4 sm:px-0"
        >
          {/* Primary CTA in Solid Vibrant Electric Blue */}
          <Button
            to={primaryCtaIsInternal ? hero.primaryCta.href : undefined}
            href={primaryCtaIsInternal ? undefined : hero.primaryCta.href}
            variant="primary"
            size="lg"
            icon={ArrowRight}
            className="w-full sm:w-auto px-7 sm:px-9 py-3.5 sm:py-4 text-sm sm:text-base font-extrabold rounded-full bg-brand-blue hover:bg-brand-blue-hover text-white shadow-lg shadow-brand-blue/35 hover:shadow-brand-blue/50 hover:scale-105 transition-all duration-300 cursor-pointer justify-center"
          >
            {hero.primaryCta.label}
          </Button>

          {/* Secondary CTA in Glossy White Pill */}
          <button
            onClick={openDiscoveryModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold rounded-full bg-white hover:bg-brand-surface-soft text-brand-navy border border-brand-border hover:border-brand-blue/40 shadow-card-subtle transition-all duration-300 hover:scale-105 cursor-pointer group"
          >
            <span className="text-brand-blue group-hover:scale-110 transition-transform">📞</span>
            <span>{hero.secondaryCta.label}</span>
          </button>
        </motion.div>

        {/* Bottom Verified Trust Metrics Scorecard on Glossy White */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 sm:mt-14 w-full max-w-4xl p-4 sm:p-6 sm:py-7 rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-xl border border-brand-blue/20 shadow-glossy hover:shadow-glossy-hover transition-all duration-300 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x divide-slate-100 relative overflow-hidden"
        >
          {/* Subtle glossy glass highlight reflection across top */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-blue/30 to-transparent pointer-events-none" />

          {hero.metrics.map((metric, idx) => {
            const { Icon, className: iconClassName } = metricIcons[idx % metricIcons.length];
            return (
              <div key={idx} className="flex flex-col items-center justify-center p-2 sm:p-4 text-center group">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-blue-light/70 text-brand-blue flex items-center justify-center mb-2 sm:mb-2.5 shadow-sm group-hover:scale-110 transition-transform">
                  <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-blue ${iconClassName} drop-shadow-[0_0_8px_rgba(35,61,255,0.4)]`} />
                </div>
                <div className="text-2xl sm:text-4xl font-black font-display text-brand-blue tracking-tight leading-none drop-shadow-[0_2px_10px_rgba(35,61,255,0.2)]">
                  {metric.value}
                </div>
                <div className="text-[9px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mt-1.5 sm:mt-2">
                  {metric.label}
                </div>
                <div className="w-10 sm:w-16 h-0.5 bg-gradient-to-r from-brand-blue to-cyan-400 rounded-full mx-auto mt-2 sm:mt-2.5 shadow-[0_0_6px_rgba(35,61,255,0.3)]" />
              </div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};
