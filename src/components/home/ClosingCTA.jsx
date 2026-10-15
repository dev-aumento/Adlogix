import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle2, Video } from 'lucide-react';
import { Button } from '../ui/Button';
import { HighlightedTitle } from '../ui/HighlightedTitle';
import { useCMS } from '../../hooks/useCMS';
import { useNavigate } from 'react-router-dom';

export const ClosingCTA = ({ content }) => {
  const { openDiscoveryModal } = useCMS();
  const navigate = useNavigate();
  const [quickService, setQuickService] = useState(null);

  // Keep the selection valid if the options change after WordPress content loads.
  const selectedService = content.options.some((o) => o.value === quickService)
    ? quickService
    : content.options[0]?.value || '';

  const handleQuickStart = (e) => {
    e.preventDefault();
    navigate(`/contact?service=${encodeURIComponent(selectedService)}`);
  };

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden border-t border-brand-border">
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-blue/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Top Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blue-light text-brand-blue text-xs font-bold border border-brand-blue/20 mb-6"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{content.badge}</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="editorial-heading text-3xl sm:text-5xl lg:text-6xl font-black text-brand-navy leading-tight tracking-tight max-w-3xl mx-auto"
        >
          <HighlightedTitle text={content.title} highlight={content.highlight} highlightClassName="gradient-text-blue" />
        </motion.h2>

        {/* Supporting Copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-5 text-base sm:text-lg text-brand-muted max-w-2xl mx-auto leading-relaxed"
        >
          {content.text}
        </motion.p>

        {/* Interactive Quick Launch Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 max-w-xl mx-auto p-2 bg-brand-surface-soft rounded-full border border-brand-border shadow-sm flex flex-col sm:flex-row items-center gap-2"
        >
          <select
            value={selectedService}
            onChange={(e) => setQuickService(e.target.value)}
            className="w-full sm:w-auto flex-1 bg-transparent px-4 py-2.5 text-xs sm:text-sm font-semibold text-brand-navy outline-none cursor-pointer"
          >
            {content.options.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <Button
            onClick={handleQuickStart}
            variant="primary"
            size="md"
            className="w-full sm:w-auto shrink-0 shadow-md shadow-brand-blue/30"
            icon={ArrowRight}
          >
            {content.buttonLabel}
          </Button>
        </motion.div>

        {/* Secondary Discovery Call CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 flex items-center justify-center gap-4 text-xs font-semibold text-brand-muted"
        >
          <span>{content.altText}</span>
          <button
            onClick={openDiscoveryModal}
            className="text-brand-blue hover:text-brand-blue-hover underline font-bold flex items-center gap-1"
          >
            <Video className="w-3.5 h-3.5" />
            <span>{content.altLinkLabel}</span>
          </button>
        </motion.div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-slate-500">
          {content.trustBadges.map((badge) => (
            <span key={badge} className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              {badge}
            </span>
          ))}
        </div>

      </div>
    </section>
  );
};
