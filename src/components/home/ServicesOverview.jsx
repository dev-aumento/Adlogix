import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, Code2, CheckCircle2, Layers } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { DynamicIcon } from '../ui/DynamicIcon';
import { useCMS } from '../../hooks/useCMS';
import { servicesCategories } from '../../data/servicesData';
import { Link } from 'react-router-dom';

export const ServicesOverview = () => {
  const { services } = useCMS();
  const [activeTab, setActiveTab] = useState('marketing-creative');

  const currentCategory = servicesCategories.find((c) => c.id === activeTab);
  const currentServices = services.filter((s) => s.category === activeTab);

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <SectionHeading
          badge="Integrated Capabilities"
          badgeIcon={Layers}
          title="Everything Your Brand Needs to Move Forward."
          highlightWord="Move Forward"
          subtitle="From the first creative spark to scalable enterprise technology, we bring marketing, creative strategy, and engineering under one roof."
          align="center"
          className="mb-12"
        />

        {/* 2 Primary Category Switcher Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-full bg-brand-surface-soft border border-brand-border shadow-sm max-w-xl w-full">
            {servicesCategories.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex-1 py-3 px-5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                    isActive
                      ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/30'
                      : 'text-brand-muted hover:text-brand-navy'
                  }`}
                >
                  {cat.id === 'marketing-creative' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <Code2 className="w-4 h-4" />
                  )}
                  <span>{cat.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Description Banner */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <p className="text-sm font-medium text-brand-muted">
            {currentCategory?.tagline}
          </p>
        </div>

        {/* Services Interactive Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {currentServices.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <Link
                  to={`/services/${service.slug}`}
                  className="group flex flex-col justify-between h-full p-7 rounded-3xl bg-white border border-brand-border/90 hover:border-brand-blue/40 shadow-card-subtle hover:shadow-glossy-hover transition-all duration-300 relative overflow-hidden"
                >
                  {/* Subtle hover gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/[0.02] to-cyan-500/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div>
                    {/* Top Icon & Category Tag */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-brand-surface-soft group-hover:bg-brand-blue text-brand-blue group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm border border-brand-border/60">
                        <DynamicIcon name={service.icon} className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 group-hover:text-brand-blue uppercase tracking-wider transition-colors">
                        Explore →
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold font-display text-brand-navy group-hover:text-brand-blue transition-colors mb-2.5">
                      {service.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-sm text-brand-muted leading-relaxed mb-6">
                      {service.shortDesc}
                    </p>

                    {/* Feature Highlights Pills */}
                    {service.highlights && (
                      <div className="space-y-2 mb-6">
                        {service.highlights.slice(0, 3).map((item, hIdx) => (
                          <div key={hIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Footer: Technologies */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex flex-wrap gap-1">
                      {service.technologies?.slice(0, 3).map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md bg-brand-surface-soft text-[10px] font-semibold text-slate-500"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <ArrowRight className="w-4 h-4 text-brand-blue -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Bottom Callout Banner */}
        <div className="mt-14 p-8 rounded-3xl bg-gradient-to-r from-brand-surface-soft via-white to-brand-blue-light/50 border border-brand-border flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-blue text-white flex items-center justify-center font-bold shrink-0 shadow-md shadow-brand-blue/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold font-display text-brand-navy">
                Looking for a combined Marketing + Web Infrastructure retainer?
              </h4>
              <p className="text-xs sm:text-sm text-brand-muted mt-0.5">
                We design tailored monthly growth partnerships that align creative production with headless development.
              </p>
            </div>
          </div>
          <Link
            to="/contact"
            className="shrink-0 px-6 py-3 rounded-full bg-brand-navy hover:bg-brand-navy-dark text-white text-xs font-bold transition-all shadow-md"
          >
            Custom Scope Proposal
          </Link>
        </div>

      </div>
    </section>
  );
};
