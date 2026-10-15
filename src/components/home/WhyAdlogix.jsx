import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { DynamicIcon } from '../ui/DynamicIcon';

export const WhyAdlogix = ({ content }) => {
  return (
    <section className="py-20 lg:py-28 bg-brand-surface-soft/60 relative overflow-hidden border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <SectionHeading
          badge={content.heading.badge}
          badgeIcon={ShieldCheck}
          title={content.heading.title}
          highlightWord={content.heading.highlight}
          subtitle={content.heading.subtitle}
          align="center"
          className="mb-16"
        />

        {/* 6 Differentiators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="p-8 rounded-3xl bg-white border border-brand-border/90 shadow-card-subtle hover:shadow-glossy hover:border-brand-blue/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-blue-light text-brand-blue flex items-center justify-center mb-6 font-bold shadow-sm">
                  <DynamicIcon name={item.icon} className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold font-display text-brand-navy mb-3">
                  {item.title}
                </h3>

                <p className="text-sm text-brand-muted leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-brand-blue">
                <span>Growth Standard #{idx + 1}</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
