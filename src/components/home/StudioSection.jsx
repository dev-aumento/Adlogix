import React, { useState } from 'react';
import { Camera, ArrowRight, Eye } from 'lucide-react';
import { Button } from '../ui/Button';
import { usePageContent } from '../../hooks/usePageContent';

// Owned by the Home page in WordPress; other pages (e.g. Reels) render it without passing content.
export const StudioSection = ({ content }) => {
  const { content: home } = usePageContent('home');
  const studio = content || home.studio;
  const [selectedShoot, setSelectedShoot] = useState(null);

  // Duplicate items for seamless continuous infinite loop
  const infiniteShoots = [...studio.shoots, ...studio.shoots];
  const infiniteTicker = [...studio.ticker, ...studio.ticker, ...studio.ticker, ...studio.ticker];

  return (
    <section className="py-20 bg-white border-t border-brand-border/60 overflow-hidden relative">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          {/* Left Title */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block w-2 h-2 rounded-full bg-brand-blue" />
              <span className="text-xs font-bold tracking-wider uppercase text-brand-blue font-display">
                {studio.badge}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-brand-navy tracking-tight">
              {studio.title}<span className="text-brand-blue">.</span>
            </h2>
          </div>

          {/* Right Subtitle */}
          <div className="max-w-md">
            <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
              {studio.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Infinite Seamless Looping Gallery Carousel */}
      <div className="relative w-full overflow-hidden py-4 group">
        {/* Soft Left & Right Edge Vignette Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

        {/* Animated Infinite Loop Track */}
        <div className="flex w-max animate-studio-loop hover:[animation-play-state:paused] gap-5 sm:gap-7 items-center pl-4">
          {infiniteShoots.map((item, index) => (
            <div
              key={index}
              onClick={() => setSelectedShoot(item)}
              className="relative w-[230px] sm:w-[280px] h-[330px] sm:h-[400px] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 shrink-0 cursor-pointer group/card border border-brand-border/80 bg-slate-900"
            >
              {/* Shoot Image */}
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover/card:scale-108 transition-transform duration-700 ease-out"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover/card:opacity-90 transition-opacity" />

              {/* Category Pill Tag (Top Left) */}
              <div className="absolute top-3.5 left-3.5 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-black/50 backdrop-blur-md text-white border border-white/20 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                  {item.category}
                </span>
              </div>

              {/* View Icon (Top Right Hover) */}
              <div className="absolute top-3.5 right-3.5 z-10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-brand-navy flex items-center justify-center shadow-lg">
                  <Eye className="w-4 h-4 text-brand-blue" />
                </div>
              </div>

              {/* Bottom Card Meta */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-10 text-white transform translate-y-1 group-hover/card:translate-y-0 transition-transform duration-300">
                <h3 className="text-base sm:text-lg font-extrabold font-display leading-snug line-clamp-2 text-white">
                  {item.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-1 font-medium flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-brand-blue" />
                  <span>{item.location}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navy Marquee Bar ("Perfect For:") */}
      <div className="mt-12 bg-[#0A1633] text-white py-3.5 sm:py-4 overflow-hidden relative shadow-inner border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          {/* Static "Perfect For:" Badge on Left */}
          <div className="shrink-0 z-20 pr-4 sm:pr-8 bg-[#0A1633] border-r border-slate-700/80 flex items-center gap-2 shadow-[10px_0_15px_#0A1633]">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
            <span className="text-xs sm:text-sm font-black tracking-wider uppercase font-display text-white whitespace-nowrap">
              {studio.tickerLabel}
            </span>
          </div>

          {/* Scrolling Ticker Loop */}
          <div className="overflow-hidden relative w-full flex items-center">
            <div className="flex w-max animate-ticker-loop whitespace-nowrap gap-8 sm:gap-12 pl-6 items-center">
              {infiniteTicker.map((tag, idx) => (
                <div
                  key={`ticker-${idx}`}
                  className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-200 tracking-wide hover:text-white transition-colors"
                >
                  <span className="text-brand-blue font-black text-lg leading-none">•</span>
                  <span>{tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox / Preview Modal */}
      {selectedShoot && (
        <div 
          onClick={() => setSelectedShoot(null)}
          className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-white/20 shadow-2xl"
          >
            <button
              onClick={() => setSelectedShoot(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors border border-white/20"
            >
              ✕
            </button>
            <div className="max-h-[70vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={selectedShoot.image}
                alt={selectedShoot.title}
                className="w-full h-full max-h-[70vh] object-contain"
              />
            </div>
            <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-brand-blue tracking-wider uppercase font-display">
                  {selectedShoot.category}
                </span>
                <h3 className="text-xl font-bold font-display mt-0.5">{selectedShoot.title}</h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-brand-blue" />
                  {selectedShoot.location}
                </p>
              </div>
              <Button
                to="/contact?service=Video+Production"
                variant="primary"
                size="md"
                icon={ArrowRight}
                onClick={() => setSelectedShoot(null)}
              >
                {studio.ctaLabel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
