import React from 'react';

export const BrandMarquee = ({ content }) => {
  // Duplicate array for seamless infinite marquee loop
  const marqueeBrands = [...content.items, ...content.items, ...content.items];

  return (
    <section className="py-14 bg-white border-b border-brand-border/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-muted">
          {content.label}
        </p>
      </div>

      {/* Infinite Scrolling Track */}
      <div className="relative w-full flex overflow-x-hidden">
        {/* Left and Right Fade Gradients */}
        <div className="absolute top-0 left-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex items-center space-x-8 sm:space-x-12 animate-marquee whitespace-nowrap py-2">
          {marqueeBrands.map((brand, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-brand-surface-soft/60 border border-brand-border/60 hover:border-brand-blue/30 hover:bg-white hover:shadow-card-subtle transition-all duration-300 group cursor-default select-none"
            >
              <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-brand-blue transition-colors" />
              <span className="text-base sm:text-lg font-black font-display tracking-wider text-slate-500 group-hover:text-brand-navy transition-colors">
                {brand.name}
              </span>
              {brand.sector && (
                <span className="text-[10px] uppercase font-semibold text-slate-400 group-hover:text-brand-blue/80 transition-colors hidden sm:inline">
                  {brand.sector}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
