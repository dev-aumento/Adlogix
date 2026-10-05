import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, Zap, Video, BarChart3, Users, ShieldCheck, ArrowRight } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';

export const WhyAdlogix = () => {
  const differentiators = [
    {
      icon: Sparkles,
      title: "Creative Thinking Backed by Strategy",
      desc: "We don't create vanity art. Every hook, visual angle, and script is anchored in consumer psychology and direct-response conversion principles."
    },
    {
      icon: Target,
      title: "Performance-Focused Marketing",
      desc: "Our media buying is disciplined, testing multi-channel variables systematically to scale customer acquisition while maintaining profitability."
    },
    {
      icon: Zap,
      title: "Integrated Marketing & Tech Muscle",
      desc: "With technical capabilities powered by Aumento Infoway, we eliminate silos between creative media buyers and software engineers."
    },
    {
      icon: Video,
      title: "In-House Content & Studio Production",
      desc: "From 9:16 viral reels to 4K studio macro shoots, our production team creates high-velocity assets without outsourcing bottlenecks."
    },
    {
      icon: BarChart3,
      title: "Transparent Reporting & First-Party Data",
      desc: "No vanity metrics or fuzzy numbers. You get live Looker Studio dashboards, clear blended ROAS attribution, and bi-weekly executive strategy syncs."
    },
    {
      icon: Users,
      title: "Tailored to Your Business Goals",
      desc: "We adapt our growth roadmap to your cash-flow cycle, inventory cadence, and enterprise milestones rather than forcing cookie-cutter packages."
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-brand-surface-soft/60 relative overflow-hidden border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <SectionHeading
          badge="The Adlogix Advantage"
          badgeIcon={ShieldCheck}
          title="More Than an Agency. Your Digital Growth Partner."
          highlightWord="Growth Partner"
          subtitle="We combine the artistic agility of a creative studio with the analytical rigor of a performance agency and the engineering depth of an IT partner."
          align="center"
          className="mb-16"
        />

        {/* 6 Differentiators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {differentiators.map((item, idx) => (
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
                  <item.icon className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold font-display text-brand-navy mb-3">
                  {item.title}
                </h3>

                <p className="text-sm text-brand-muted leading-relaxed">
                  {item.desc}
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
