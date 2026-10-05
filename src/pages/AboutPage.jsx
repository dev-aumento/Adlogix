import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, Zap, Users, ShieldCheck, ArrowRight, ExternalLink, Award, CheckCircle2 } from 'lucide-react';
import { SEOHead } from '../components/ui/SEOHead';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
import { useCMS } from '../hooks/useCMS';
import { Link } from 'react-router-dom';

export const AboutPage = () => {
  const { team, settings, openDiscoveryModal } = useCMS();

  return (
    <>
      <SEOHead
        title="About Us | Built Around Ideas. Driven by Growth | Adlogix"
        description="Learn about Adlogix, a full-service creative digital marketing and IT solutions agency powered by Aumento Infoway. Discover our team, philosophy, and approach."
        canonical="https://adlogix.agency/about"
      />

      <div className="bg-white">
        {/* Hero Section */}
        <section className="py-20 lg:py-28 bg-brand-surface-soft/60 relative overflow-hidden border-b border-brand-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blue-light text-brand-blue text-xs font-bold border border-brand-blue/20 mb-6"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>About Adlogix</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="editorial-heading text-4xl sm:text-5xl lg:text-6xl text-brand-navy font-black leading-[1.1]"
              >
                Built Around Ideas.{' '}
                <span className="gradient-text-blue block mt-1">
                  Driven by Measurable Growth.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 text-base sm:text-lg text-brand-muted leading-relaxed"
              >
                Adlogix was founded on a simple realization: traditional advertising agencies lack technological depth, while traditional IT firms lack creative commercial storytelling. We bring both together under one roof.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Story & Positioning */}
        <section className="py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-6 space-y-6">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
                  Our Mission & Philosophy
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-brand-navy leading-tight">
                  Your Creative Growth Partner From Inception to Scale
                </h2>
                <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                  We position Adlogix as an agile extension of your executive leadership team. Rather than treating marketing and software engineering as isolated silos, we orchestrate them into a unified growth engine.
                </p>
                <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                  From testing high-velocity 9:16 vertical video reels to deploying headless React platforms and server-side first-party attribution tracking, we ensure every marketing rupee yields verifiable commercial ROI.
                </p>

                <div className="pt-4 grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-brand-surface-soft border border-brand-border">
                    <div className="text-2xl font-black font-display text-brand-blue">100%</div>
                    <div className="text-xs text-brand-muted mt-1 font-medium">In-House Creative & Tech Execution</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-brand-surface-soft border border-brand-border">
                    <div className="text-2xl font-black font-display text-brand-navy">3.9x</div>
                    <div className="text-xs text-brand-muted mt-1 font-medium">Average Blended Client ROAS</div>
                  </div>
                </div>
              </div>

              {/* Story Visual Card */}
              <div className="lg:col-span-6 relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-brand-border aspect-[4/3] bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop"
                    alt="Adlogix Team Collaboration"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Technology Backbone: Powered by Aumento Infoway */}
        <section className="py-16 bg-brand-surface-soft/60 border-y border-brand-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 rounded-3xl bg-white border border-brand-border shadow-card-subtle flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl">
                <span className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-brand-blue-light text-brand-blue border border-brand-blue/20">
                  Technology Partnership
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-display text-brand-navy">
                  Powered by Aumento Infoway
                </h3>
                <p className="text-sm text-brand-muted leading-relaxed">
                  Adlogix leverages the technology capabilities and engineering infrastructure of <strong className="text-brand-navy">Aumento Infoway</strong>. This partnership enables us to deliver enterprise-grade headless architectures, complex API middleware, high-concurrency cloud setups, and bulletproof web applications.
                </p>
              </div>

              <a
                href={settings.poweredBy?.url || 'https://aumentoinfoway.com/'}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-6 py-3.5 rounded-full bg-brand-navy hover:bg-brand-navy-dark text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 group"
              >
                <span>Explore Aumento Infoway</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              badge="Leadership"
              badgeIcon={Users}
              title="Creative Minds. Growth Strategists. Engineers."
              highlightWord="Growth Strategists"
              subtitle="Meet the core leaders driving campaign strategy, creative production, and engineering excellence at Adlogix."
              align="center"
              className="mb-16"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl bg-white border border-brand-border overflow-hidden shadow-card-subtle hover:shadow-glossy transition-all duration-300 group flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-slate-900">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="text-lg font-bold font-display">{member.name}</div>
                      <div className="text-xs text-cyan-300 font-semibold">{member.role}</div>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-brand-muted leading-relaxed">
                      {member.bio}
                    </p>
                    {member.linkedin && (
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-brand-blue hover:underline inline-flex items-center gap-1"
                        >
                          <span>Connect on LinkedIn</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-16 bg-brand-surface-soft/60 border-t border-brand-border text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black font-display text-brand-navy">
              Ready to Partner with Adlogix?
            </h2>
            <p className="text-sm sm:text-base text-brand-muted max-w-xl mx-auto">
              Let's discuss how our integrated creative and technology team can help you dominate your category.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Button to="/contact" variant="primary" size="lg" icon={ArrowRight}>
                Start Your Project
              </Button>
              <Button onClick={openDiscoveryModal} variant="secondary" size="lg">
                Book a Discovery Call
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
