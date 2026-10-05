import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Building, Sparkles } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { DynamicIcon } from '../ui/DynamicIcon';
import { useCMS } from '../../hooks/useCMS';

export const IndustriesSection = () => {
  const { industries } = useCMS();

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <SectionHeading
          badge="Specialized Sectors"
          badgeIcon={Building}
          title="Engineered for Your Industry's Nuances."
          highlightWord="Industry's Nuances"
          subtitle="We tailor our creative frameworks, acquisition funnels, and web architectures to match the distinct buyer journeys of specialized markets."
          align="center"
          className="mb-14"
        />

        {/* 8 Industries Visual Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((ind, idx) => (
            <motion.div
              key={ind.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <Link
                to={`/industries/${ind.slug}`}
                className="group flex flex-col justify-between h-full p-6 rounded-3xl bg-brand-surface-soft/60 hover:bg-white border border-brand-border hover:border-brand-blue/30 shadow-card-subtle hover:shadow-glossy transition-all duration-300 relative overflow-hidden"
              >
                {/* Top Image Preview Strip */}
                <div className="relative h-32 rounded-2xl overflow-hidden mb-4 bg-slate-900">
                  <img
                    src={ind.heroImage}
                    alt={ind.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3 p-2 rounded-xl bg-white/20 text-white backdrop-blur-md">
                    <DynamicIcon name={ind.icon} className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-display text-brand-navy group-hover:text-brand-blue transition-colors mb-2">
                    {ind.name}
                  </h3>

                  <p className="text-xs text-brand-muted leading-relaxed line-clamp-2 mb-4">
                    {ind.shortDesc}
                  </p>
                </div>

                {/* Key Metric & Link */}
                <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-brand-blue line-clamp-1">
                    {ind.keyMetrics}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-blue group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Industries Link */}
        <div className="mt-10 text-center">
          <Link
            to="/industries"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-navy hover:text-brand-blue transition-colors"
          >
            <span>Explore All Industry Landing Pages & Solutions →</span>
          </Link>
        </div>

      </div>
    </section>
  );
};
