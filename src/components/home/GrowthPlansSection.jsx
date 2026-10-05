import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, Sparkles, Star, Zap, ShieldCheck } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { useCMS } from '../../hooks/useCMS';
import { growthPlansData } from '../../data/pricingData';
import { useNavigate } from 'react-router-dom';

export const GrowthPlansSection = ({ className = "" }) => {
  const { openDiscoveryModal } = useCMS();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'quarterly' | 'annual'

  const handleSelectPlan = (plan) => {
    navigate(`/contact?service=${encodeURIComponent(plan.name)}&plan=${encodeURIComponent(plan.id)}`);
  };

  return (
    <section className={`py-20 lg:py-28 bg-white relative overflow-hidden border-t border-brand-border ${className}`}>
      {/* Background Ambient Lighting & Glossy Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-brand-blue/8 via-cyan-400/5 to-transparent rounded-full blur-[130px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-blue/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-blue-light text-brand-blue text-xs font-black uppercase tracking-wider border border-brand-blue/20 mb-4 select-none"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>— {growthPlansData.badge}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="editorial-heading text-3xl sm:text-5xl lg:text-6xl font-black text-brand-navy tracking-tight uppercase"
          >
            Choose Your{' '}
            <span className="text-brand-blue font-black drop-shadow-[0_4px_24px_rgba(35,61,255,0.25)]">
              Growth Plan
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-xs sm:text-sm text-brand-muted leading-relaxed max-w-2xl mx-auto font-medium"
          >
            {growthPlansData.subtitle}
          </motion.p>

          {/* Billing Cycle Switcher Pills */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-8 inline-flex items-center gap-1.5 p-1.5 bg-brand-surface-soft rounded-full border border-brand-border shadow-card-subtle select-none"
          >
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/30'
                  : 'text-brand-muted hover:text-brand-navy'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('quarterly')}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === 'quarterly'
                  ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/30'
                  : 'text-brand-muted hover:text-brand-navy'
              }`}
            >
              <span>Quarterly</span>
              <span className={`px-1.5 py-0.2 text-[9px] font-black rounded-full uppercase ${
                billingCycle === 'quarterly' ? 'bg-white text-brand-blue' : 'bg-emerald-100 text-emerald-700'
              }`}>
                Save 10%
              </span>
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/30'
                  : 'text-brand-muted hover:text-brand-navy'
              }`}
            >
              <span>Annual</span>
              <span className={`px-1.5 py-0.2 text-[9px] font-black rounded-full uppercase ${
                billingCycle === 'annual' ? 'bg-white text-brand-blue' : 'bg-brand-blue-light text-brand-blue'
              }`}>
                Save 20%
              </span>
            </button>
          </motion.div>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
          {growthPlansData.plans.map((plan, idx) => {
            const pricingInfo = plan.pricing[billingCycle];
            const isFeatured = plan.isPopular;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  isFeatured
                    ? 'bg-white border-2 border-brand-blue shadow-glossy-hover md:-translate-y-3 z-20'
                    : 'bg-white/95 border border-brand-border/90 shadow-card-subtle hover:shadow-glossy hover:border-brand-blue/40 z-10'
                }`}
              >
                {/* Popular Badge on Top */}
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-brand-blue text-white text-[10px] font-black uppercase tracking-widest shadow-md shadow-brand-blue/40 border border-white/20 whitespace-nowrap">
                      <Star className="w-3 h-3 fill-white" />
                      <span>{plan.popularBadge}</span>
                      <Star className="w-3 h-3 fill-white" />
                    </span>
                  </div>
                )}

                <div>
                  {/* Plan Name & Tagline */}
                  <div className="text-center pb-5 border-b border-slate-100">
                    <h3 className="text-2xl font-black font-display text-brand-navy">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-brand-muted mt-1 min-h-[32px] leading-relaxed">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Price Block in Electric Blue */}
                  <div className="py-6 text-center">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl sm:text-5xl font-black font-display text-brand-blue tracking-tight drop-shadow-[0_2px_12px_rgba(35,61,255,0.25)]">
                        {pricingInfo.price}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-500">
                        {pricingInfo.period}
                      </span>
                    </div>

                    {/* Cycle Switcher inside Card */}
                    <div className="mt-4 inline-flex p-1 bg-brand-surface-soft rounded-full border border-brand-border text-[11px] font-bold">
                      <button
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-3 py-1 rounded-full transition-all ${
                          billingCycle === 'monthly'
                            ? 'bg-brand-blue text-white shadow-xs'
                            : 'text-slate-500 hover:text-brand-navy'
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        onClick={() => setBillingCycle('quarterly')}
                        className={`px-3 py-1 rounded-full transition-all ${
                          billingCycle === 'quarterly'
                            ? 'bg-brand-blue text-white shadow-xs'
                            : 'text-slate-500 hover:text-brand-navy'
                        }`}
                      >
                        Quarterly
                      </button>
                      <button
                        onClick={() => setBillingCycle('annual')}
                        className={`px-3 py-1 rounded-full transition-all ${
                          billingCycle === 'annual'
                            ? 'bg-brand-blue text-white shadow-xs'
                            : 'text-slate-500 hover:text-brand-navy'
                        }`}
                      >
                        Annual
                      </button>
                    </div>

                    {pricingInfo.total && (
                      <div className="text-[11px] font-semibold text-emerald-600 mt-2">
                        {pricingInfo.total}
                      </div>
                    )}
                  </div>

                  {/* 3 Metric Summary Boxes */}
                  <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-100">
                    {plan.metrics.map((m, mIdx) => (
                      <div
                        key={mIdx}
                        className="p-2.5 rounded-2xl bg-brand-surface-soft border border-brand-border/80 text-center"
                      >
                        <div className="text-lg sm:text-xl font-black font-display text-brand-navy">
                          {m.value}
                        </div>
                        <div className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider mt-0.5">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Features Checklist */}
                  <div className="py-6 space-y-3">
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-700 font-medium">
                        <div className="w-4 h-4 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA Button */}
                <div className="pt-4 mt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full py-3.5 px-6 rounded-full text-sm font-extrabold transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer shadow-md ${
                      isFeatured
                        ? 'bg-brand-blue hover:bg-brand-blue-hover text-white shadow-brand-blue/35 hover:shadow-brand-blue/50 hover:scale-[1.02]'
                        : 'bg-brand-navy hover:bg-brand-navy-dark text-white shadow-brand-navy/20 hover:scale-[1.02]'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-12 pt-8 border-t border-brand-border text-center max-w-4xl mx-auto">
          <p className="text-[11px] sm:text-xs text-brand-muted leading-relaxed font-normal">
            {growthPlansData.disclaimer}
          </p>

          {/* Custom Scope Help Callout */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 p-3 px-6 rounded-full bg-brand-surface-soft border border-brand-border text-xs text-brand-navy">
            <span className="font-semibold">Need a custom enterprise scope, web application, or nationwide video crew?</span>
            <button
              onClick={openDiscoveryModal}
              className="font-extrabold text-brand-blue hover:text-brand-blue-hover underline cursor-pointer"
            >
              Book a Strategy Call →
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
