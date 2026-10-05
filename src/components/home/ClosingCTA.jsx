import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle2, Video } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCMS } from '../../hooks/useCMS';
import { useNavigate } from 'react-router-dom';

export const ClosingCTA = () => {
  const { openDiscoveryModal } = useCMS();
  const navigate = useNavigate();
  const [quickService, setQuickService] = useState("Performance Marketing & Ads");

  const handleQuickStart = (e) => {
    e.preventDefault();
    navigate(`/contact?service=${encodeURIComponent(quickService)}`);
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
          <span>Your Next Big Move Starts Here</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="editorial-heading text-3xl sm:text-5xl lg:text-6xl font-black text-brand-navy leading-tight tracking-tight max-w-3xl mx-auto"
        >
          Have a Brand to Grow or an{' '}
          <span className="gradient-text-blue">Idea to Build?</span>
        </motion.h2>

        {/* Supporting Copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-5 text-base sm:text-lg text-brand-muted max-w-2xl mx-auto leading-relaxed"
        >
          Let's turn your next business challenge into a meaningful digital opportunity. Schedule a strategy session or request a custom proposal today.
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
            value={quickService}
            onChange={(e) => setQuickService(e.target.value)}
            className="w-full sm:w-auto flex-1 bg-transparent px-4 py-2.5 text-xs sm:text-sm font-semibold text-brand-navy outline-none cursor-pointer"
          >
            <option value="Performance Marketing & Ads">I need Performance Marketing & Paid Ads</option>
            <option value="Video Reels & Content Production">I need 9:16 Video Reels & Content Shoots</option>
            <option value="React & Next.js Web Development">I need React / Next.js Web Development</option>
            <option value="Shopify D2C Storefront">I need a High-Converting Shopify Store</option>
            <option value="Headless WordPress CMS">I need Headless WordPress Solutions</option>
          </select>

          <Button
            onClick={handleQuickStart}
            variant="primary"
            size="md"
            className="w-full sm:w-auto shrink-0 shadow-md shadow-brand-blue/30"
            icon={ArrowRight}
          >
            Start Project
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
          <span>Prefer a direct conversation?</span>
          <button
            onClick={openDiscoveryModal}
            className="text-brand-blue hover:text-brand-blue-hover underline font-bold flex items-center gap-1"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Book a 30-Min Discovery Call</span>
          </button>
        </motion.div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            No Long-Term Lock-in Required
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            NDA Protected Inquiries
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Direct Access to Senior Strategists
          </span>
        </div>

      </div>
    </section>
  );
};
