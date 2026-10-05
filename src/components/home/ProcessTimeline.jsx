import React from 'react';
import { motion } from 'framer-motion';
import { Search, Compass, Palette, Rocket, LineChart, Sparkles } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';

export const ProcessTimeline = () => {
  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Discover",
      desc: "Deep-dive into your unit economics, audience psychology, competitor blind spots, and existing digital baseline."
    },
    {
      number: "02",
      icon: Compass,
      title: "Strategize",
      desc: "Engineer a high-velocity marketing roadmap, creative angle testing matrix, and web architecture specification."
    },
    {
      number: "03",
      icon: Palette,
      title: "Create",
      desc: "Script and shoot 9:16 reels, design conversion assets, and develop headless web applications in sprints."
    },
    {
      number: "04",
      icon: Rocket,
      title: "Launch",
      desc: "Deploy multi-channel ad campaigns, activate server-side tracking, and launch high-speed web solutions."
    },
    {
      number: "05",
      icon: LineChart,
      title: "Optimize",
      desc: "Analyze attribution metrics, double down on winning creative angles, and iterate continuously to scale ROI."
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <SectionHeading
          badge="Proven Methodology"
          badgeIcon={Sparkles}
          title="From First Conversation to Real-World Execution."
          highlightWord="Real-World Execution"
          subtitle="Our five-phase framework guarantees transparency, high-speed delivery, and continuous quantitative refinement."
          align="center"
          className="mb-16"
        />

        {/* Timeline Grid (Horizontal on Desktop, Vertical on Mobile) */}
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 -translate-y-6 left-12 right-12 h-0.5 bg-gradient-to-r from-brand-blue/20 via-brand-blue to-brand-blue/20 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col items-center text-center p-6 rounded-3xl bg-white border border-brand-border shadow-card-subtle hover:shadow-glossy hover:border-brand-blue/30 transition-all group"
              >
                {/* Step Number & Icon Circle */}
                <div className="w-14 h-14 rounded-2xl bg-brand-surface-soft border border-brand-border group-hover:border-brand-blue group-hover:bg-brand-blue text-brand-navy group-hover:text-white flex items-center justify-center mb-5 font-bold transition-all duration-300 shadow-sm relative">
                  <step.icon className="w-6 h-6" />
                  <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-black rounded-full bg-brand-blue text-white group-hover:bg-brand-navy">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-lg font-bold font-display text-brand-navy mb-2 group-hover:text-brand-blue transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs text-brand-muted leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
