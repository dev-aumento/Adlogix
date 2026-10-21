import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Eye, Flame, ArrowRight } from 'lucide-react';
import { SEOHead } from '../components/ui/SEOHead';
import { Button } from '../components/ui/Button';
import { PageSections } from '../components/sections/PageSections';
import { GrowthPlansSection } from '../components/home/GrowthPlansSection';
import { StudioSection } from '../components/home/StudioSection';
import { useCMS, useCollection } from '../hooks/useCMS';
import { usePageContent } from '../hooks/usePageContent';
import { reelCategories } from '../data/reelsData';
import { presentCategories } from '../services/collections';
import { toRouterPath } from '../components/ui/SmartLink';
import { reelsDefaults } from '../content/reels';

const ReelsHero = ({ content = reelsDefaults.hero }) => {
  const { badge, headline, description } = content;
  const hasHeadline = Boolean(headline?.line1 || headline?.highlight1);

  if (!badge && !hasHeadline && !description) return null;

  return (
    <section className="py-20 lg:py-28 bg-brand-surface-soft/60 relative overflow-hidden border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          {badge && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blue-light text-brand-blue text-xs font-bold border border-brand-blue/20 mb-6"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{badge}</span>
            </motion.div>
          )}

          {hasHeadline && (
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="editorial-heading text-4xl sm:text-5xl lg:text-6xl text-brand-navy font-black leading-[1.1]"
            >
              {headline.line1}
              {headline.line1 && headline.highlight1 ? ' ' : ''}
              {headline.highlight1 && (
                <span className="gradient-text-blue block mt-1">
                  {headline.highlight1}
                </span>
              )}
            </motion.h1>
          )}

          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-brand-muted leading-relaxed"
            >
              {description}
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
};

// Colour per column is design, not content; the values and labels come from WordPress.
const PRODUCTION_VALUE_CLASS = ['text-white', 'text-cyan-300', 'text-white', 'text-emerald-400'];

const ReelsProductionBar = ({ content = reelsDefaults.production }) => {
  const items = content.items ?? [];
  if (items.length === 0) return null;

  return (
    <section className="py-8 bg-brand-navy text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {items.map((item, idx) => (
          <div key={idx}>
            <div
              className={`text-xl sm:text-2xl font-black font-display ${PRODUCTION_VALUE_CLASS[idx % PRODUCTION_VALUE_CLASS.length]}`}
            >
              {item.value}
            </div>
            {item.label && <div className="text-xs text-slate-300 mt-0.5">{item.label}</div>}
          </div>
        ))}
      </div>
    </section>
  );
};

// Filter bar and grid share the active category, so they move as one section.
const ReelsGallery = ({ content = reelsDefaults.gallery }) => {
  const { openVideoModal, openDiscoveryModal } = useCMS();
  const reels = useCollection('reels', 'reels');
  const [selectedCategory, setActiveCategory] = useState("All");

  const categories = presentCategories(reels, reelCategories.slice(1));
  const activeCategory = categories.includes(selectedCategory) ? selectedCategory : "All";
  const filteredReels = activeCategory === "All"
    ? reels
    : reels.filter(r => r.category === activeCategory);

  if (reels.length === 0) return null;

  return (
    <>
      {/* Filter Navigation */}
      <section className="py-8 border-b border-brand-border bg-white sticky top-20 z-30 shadow-xs backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          {categories.length > 1 && content.allLabel && (
            <div className="inline-flex items-center gap-1.5 p-1.5 bg-brand-surface-soft rounded-full border border-brand-border flex-nowrap overflow-x-auto no-scrollbar max-w-full">
              {[content.allLabel, ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat === content.allLabel ? "All" : cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all select-none ${
                    (cat === content.allLabel ? "All" : cat) === activeCategory
                      ? "bg-brand-blue text-white shadow-md shadow-brand-blue/30"
                      : "text-brand-muted hover:text-brand-navy"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {content.ctaLabel && (
            <Button onClick={openDiscoveryModal} variant="outline" size="sm" className="whitespace-nowrap shrink-0 ml-auto">
              {content.ctaLabel}
            </Button>
          )}
        </div>
      </section>

      {/* 9:16 Video Reels Grid */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredReels.map((reel, idx) => (
                <motion.div
                  key={reel.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="group"
                >
                  <div
                    onClick={() => openVideoModal(reel)}
                    className="relative rounded-3xl overflow-hidden aspect-[9/16] bg-slate-900 shadow-glossy hover:shadow-glossy-hover transition-all duration-300 cursor-pointer border border-brand-border/80"
                  >
                    <img
                      src={reel.thumbnail}
                      alt={reel.thumbnailAlt || reel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/30 group-hover:via-black/15 transition-colors" />

                    {/* Top Pill */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                      {reel.category && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/50 text-white backdrop-blur-md border border-white/10">
                          {reel.category}
                        </span>
                      )}
                      {reel.duration && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-white/90 bg-black/60 backdrop-blur-md ml-auto">
                          {reel.duration}
                        </span>
                      )}
                    </div>

                    {/* Center Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="w-16 h-16 rounded-full bg-brand-blue/90 text-white backdrop-blur-md flex items-center justify-center shadow-lg shadow-brand-blue/40 border border-white/20 group-hover:scale-110 group-hover:bg-brand-blue transition-all duration-300">
                        <Play className="w-6 h-6 fill-current translate-x-0.5" />
                      </div>
                    </div>

                    {/* Bottom Details */}
                    <div className="absolute bottom-5 left-5 right-5 z-10 text-white space-y-2">
                      {reel.client && (
                        <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                          {reel.client}
                        </div>
                      )}
                      {reel.title && (
                        <h3 className="text-base sm:text-lg font-bold font-display leading-snug">
                          {reel.title}
                        </h3>
                      )}

                      {reel.description && (
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {reel.description}
                        </p>
                      )}

                      {(reel.views || reel.ctr) && (
                        <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs">
                          {reel.views && (
                            <span className="flex items-center gap-1 font-semibold text-white">
                              <Eye className="w-3.5 h-3.5 text-brand-blue" />
                              {[reel.views, content.viewsSuffix].filter(Boolean).join(' ')}
                            </span>
                          )}
                          {reel.ctr && (
                            <span className="text-emerald-400 font-bold ml-auto">
                              {[reel.ctr, content.ctrSuffix].filter(Boolean).join(' ')}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  );
};

const ReelsCta = ({ content = reelsDefaults.cta }) => {
  const { title, text, buttonLabel, buttonLink } = content;
  const hasButton = Boolean(buttonLabel && buttonLink);
  // Site paths go through the router; another website opens in a new tab.
  const buttonPath = toRouterPath(buttonLink);

  if (!title && !text && !hasButton) return null;

  return (
    <section className="py-16 bg-brand-surface-soft/60 border-t border-brand-border text-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {title && (
          <h2 className="text-3xl font-black font-display text-brand-navy">
            {title}
          </h2>
        )}
        {text && <p className="text-sm text-brand-muted">{text}</p>}
        {hasButton && (
          <Button
            {...(buttonPath ? { to: buttonPath } : { href: buttonLink })}
            variant="primary"
            size="lg"
            icon={ArrowRight}
          >
            {buttonLabel}
          </Button>
        )}
      </div>
    </section>
  );
};

// Keys must match the "reels" entry in the plugin's section registry.
const reelsSections = {
  hero: ReelsHero,
  production: ReelsProductionBar,
  gallery: ReelsGallery,
  studio: StudioSection,
  plans: GrowthPlansSection,
  cta: ReelsCta
};

export const ReelsPage = () => {
  const { content, order } = usePageContent('reels');

  return (
    <>
      <SEOHead
        title="Creative Studio & Reels Showcase | 9:16 Video Production | Adlogix"
        description="Explore our in-house 9:16 vertical video reels, macro product shoots, cinematic brand films, and direct-response paid ad creatives engineered to stop the scroll."
        canonical="https://adlogix.in/reels"
      />

      <div className="bg-white">
        <PageSections sections={reelsSections} order={order} content={content} />
      </div>
    </>
  );
};
