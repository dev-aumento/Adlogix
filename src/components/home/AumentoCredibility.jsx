import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, ExternalLink, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { useCMS } from '../../hooks/useCMS';

export const AumentoCredibility = () => {
  const { settings } = useCMS();
  const partner = settings.poweredBy || {
    text: "Powered by Aumento Infoway",
    partnerName: "Aumento Infoway",
    url: "https://aumentoinfoway.com/",
    description: "Adlogix brings together digital marketing and creative execution, powered by technology capabilities through Aumento Infoway."
  };

  return (
    <section className="py-16 bg-white relative overflow-hidden border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-brand-navy via-slate-900 to-brand-navy-light text-white shadow-2xl overflow-hidden"
        >
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Heading & Description */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cyan-300 text-xs font-bold border border-white/15 backdrop-blur-md">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Enterprise Technology Backbone</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight text-white">
                Creative Growth. Backed by Technology.
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
                {partner.description} By combining high-velocity creative advertising with deep software engineering, headless architecture, and complex integrations, our clients enjoy unmatched digital performance.
              </p>
            </div>

            {/* Right Column: Credibility Partner Card */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-4">
              <div className="p-5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md w-full sm:max-w-xs text-left">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Technology Partner
                </div>
                <div className="text-lg font-black font-display text-white">
                  {partner.partnerName}
                </div>
                <p className="text-xs text-slate-300 mt-1 mb-4 leading-normal">
                  Enterprise Web Engineering, Headless CMS & Cloud Solutions
                </p>

                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300 hover:text-white transition-colors group"
                >
                  <span>Visit Aumento Infoway</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
