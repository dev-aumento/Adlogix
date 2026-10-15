import React, { useState } from 'react';
import { Play, Sparkles, Eye, ArrowUpRight, Flame } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { useCMS, useCollection } from '../../hooks/useCMS';
import { reelCategories } from '../../data/reelsData';
import { presentCategories } from '../../services/collections';
import { SmartLink } from '../ui/SmartLink';

export const ReelShowcase = ({ content }) => {
  const { openVideoModal } = useCMS();
  const reels = useCollection('reels', 'home');
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = presentCategories(reels, reelCategories.slice(1));
  const activeCategory = categories.includes(selectedCategory) ? selectedCategory : "All";
  const filteredReels = activeCategory === "All"
    ? reels
    : reels.filter(r => r.category === activeCategory);

  if (reels.length === 0) return null;

  const hasCta = Boolean(content.ctaLabel && content.ctaLink);

  // Duplicate reels for continuous infinite horizontal stream
  const loopReels = [...filteredReels, ...filteredReels, ...filteredReels, ...filteredReels];

  return (
    <section className="py-20 lg:py-28 bg-brand-surface-soft/60 relative overflow-hidden border-y border-brand-border/80">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        
        {/* Section Heading & Category Filters */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <SectionHeading
            badge={content.heading.badge}
            badgeIcon={Flame}
            badgeVariant="blue"
            title={content.heading.title}
            highlightWord={content.heading.highlight}
            subtitle={content.heading.subtitle}
            align="left"
            className="max-w-2xl"
          />

          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div className="inline-flex items-center gap-1.5 p-1.5 bg-white rounded-full border border-brand-border shadow-card-subtle flex-nowrap overflow-x-auto no-scrollbar max-w-full shrink-0">
              {["All", ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all select-none ${
                    activeCategory === cat
                      ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/30'
                      : 'text-brand-muted hover:text-brand-navy hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Infinite Looping 9:16 Reel Track */}
      <div className="relative w-full overflow-hidden group/track">
        {/* Left and Right Fade Gradients */}
        <div className="absolute top-0 left-0 bottom-0 w-16 sm:w-36 bg-gradient-to-r from-[#F5F7FF] via-[#F5F7FF]/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-16 sm:w-36 bg-gradient-to-l from-[#F5F7FF] via-[#F5F7FF]/80 to-transparent z-20 pointer-events-none" />

        {/* Continuous Looping Stream */}
        <div className="animate-reels-loop gap-6 py-4 px-4 will-change-transform">
          {loopReels.map((reel, idx) => (
            <div
              key={`${reel.id}-${idx}`}
              onClick={() => openVideoModal(reel)}
              className="flex-none w-[230px] sm:w-[260px] md:w-[290px] aspect-[9/16] relative rounded-3xl overflow-hidden bg-slate-900 shadow-glossy hover:shadow-glossy-hover transition-all duration-300 cursor-pointer border border-brand-border/90 hover:border-brand-blue/60 group/card select-none transform hover:-translate-y-2 hover:scale-[1.02]"
              title={reel.title ? `Click to watch ${reel.title}` : undefined}
            >
              {/* Poster Thumbnail */}
              <img
                src={reel.thumbnail}
                alt={reel.thumbnailAlt || reel.title}
                className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700"
                loading="lazy"
              />

              {/* Cinematic Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/35 group-hover/card:via-black/15 transition-colors" />

              {/* Top Floating Badge & Duration */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                {reel.category && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-black/60 text-white backdrop-blur-md border border-white/10">
                    {reel.category}
                  </span>
                )}
                {reel.duration && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-white/90 bg-black/70 backdrop-blur-md ml-auto">
                    {reel.duration}
                  </span>
                )}
              </div>

              {/* Centered Glowing Play Button */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-brand-blue/90 text-white backdrop-blur-md flex items-center justify-center shadow-lg shadow-brand-blue/50 border border-white/25 group-hover/card:scale-115 group-hover/card:bg-brand-blue transition-all duration-300">
                  <Play className="w-5 h-5 fill-current translate-x-0.5" />
                </div>
              </div>

              {/* Bottom Video Metadata */}
              <div className="absolute bottom-4 left-4 right-4 z-10 text-white space-y-1.5">
                {reel.client && (
                  <div className="text-[10px] sm:text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
                    {reel.client}
                  </div>
                )}
                {reel.title && (
                  <h3 className="text-xs sm:text-sm font-bold font-display leading-snug line-clamp-2">
                    {reel.title}
                  </h3>
                )}

                {(reel.views || reel.ctr) && (
                  <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px] sm:text-xs text-slate-300">
                    {reel.views && (
                      <span className="flex items-center gap-1 font-semibold text-white">
                        <Eye className="w-3.5 h-3.5 text-brand-blue" />
                        {reel.views}
                      </span>
                    )}
                    {reel.ctr && (
                      <span className="text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20 ml-auto">
                        {reel.ctr} CTR
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Helper & Link to Reels Studio */}
      {(content.helperText || hasCta) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          {content.helperText && (
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-muted">
              <Sparkles className="w-4 h-4 text-brand-blue" />
              <span>{content.helperText}</span>
            </div>
          )}

          {hasCta && (
            <SmartLink
              href={content.ctaLink}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-blue hover:text-brand-blue-hover transition-colors group sm:ml-auto"
            >
              <span>{content.ctaLabel}</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </SmartLink>
          )}
        </div>
      )}
    </section>
  );
};
