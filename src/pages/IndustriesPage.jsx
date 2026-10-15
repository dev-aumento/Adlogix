import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Building, ArrowRight } from 'lucide-react';
import { SEOHead } from '../components/ui/SEOHead';
import { Button } from '../components/ui/Button';
import { DynamicIcon } from '../components/ui/DynamicIcon';
import { PageSections } from '../components/sections/PageSections';
import { useCMS } from '../hooks/useCMS';
import { usePageContent } from '../hooks/usePageContent';

const IndustriesHero = () => (
  <section className="py-20 lg:py-28 bg-brand-surface-soft/60 relative overflow-hidden border-b border-brand-border">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blue-light text-brand-blue text-xs font-bold border border-brand-blue/20 mb-6"
        >
          <Building className="w-3.5 h-3.5" />
          <span>Specialized Domain Expertise</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="editorial-heading text-4xl sm:text-5xl lg:text-6xl text-brand-navy font-black leading-[1.1]"
        >
          Tailored Strategies for{' '}
          <span className="gradient-text-blue block mt-1">
            High-Growth Industries.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-brand-muted leading-relaxed"
        >
          No two industries share the same customer psychology or compliance requirements. We build bespoke acquisition funnels and custom digital architectures tailored to your sector.
        </motion.p>
      </div>
    </div>
  </section>
);

const IndustriesGrid = () => {
  const { industries } = useCMS();

  return (
    <section className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {industries.map((ind, idx) => (
            <motion.div
              key={ind.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="rounded-3xl bg-white border border-brand-border shadow-card-subtle hover:shadow-glossy overflow-hidden transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Visual Banner */}
                <div className="relative h-48 sm:h-56 overflow-hidden bg-slate-900">
                  <img
                    src={ind.heroImage}
                    alt={ind.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  <div className="absolute top-4 left-4 p-2.5 rounded-2xl bg-white/20 text-white backdrop-blur-md">
                    <DynamicIcon name={ind.icon} className="w-5 h-5" />
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-2xl font-bold font-display leading-tight">
                      {ind.name}
                    </h3>
                    <p className="text-xs text-cyan-300 font-semibold mt-1">
                      {ind.keyMetrics}
                    </p>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 sm:p-8 space-y-5">
                  <p className="text-sm text-brand-muted leading-relaxed">
                    {ind.shortDesc}
                  </p>

                  {/* Solutions Snapshot */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-brand-navy uppercase tracking-wider">
                      Key Solutions Provided:
                    </div>
                    {ind.solutions?.map((sol, sIdx) => (
                      <div key={sIdx} className="text-xs text-slate-600 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-1.5 shrink-0" />
                        <span>{sol}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="p-6 sm:px-8 sm:pb-8 pt-0 flex items-center justify-between border-t border-slate-100 mt-4">
                <div className="flex flex-wrap gap-1">
                  {ind.relevantServices?.slice(0, 2).map((srv, rIdx) => (
                    <span key={rIdx} className="px-2.5 py-1 rounded text-[10px] font-semibold bg-brand-surface-soft text-slate-600">
                      {srv}
                    </span>
                  ))}
                </div>

                <Link
                  to={`/industries/${ind.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-blue hover:text-brand-blue-hover"
                >
                  <span>Explore Sector</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const IndustriesCta = () => {
  const { openDiscoveryModal } = useCMS();

  return (
    <section className="py-16 bg-brand-surface-soft/60 border-t border-brand-border text-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h2 className="text-3xl font-black font-display text-brand-navy">
          Don't See Your Specific Industry Listed?
        </h2>
        <p className="text-sm text-brand-muted">
          We work with emerging categories, D2C challengers, and enterprise B2B brands across all digital verticals.
        </p>
        <Button onClick={openDiscoveryModal} variant="primary" size="lg" icon={ArrowRight}>
          Schedule an Industry Consultation
        </Button>
      </div>
    </section>
  );
};

// Keys must match the "industries" entry in the plugin's section registry.
const industriesSections = {
  hero: IndustriesHero,
  grid: IndustriesGrid,
  cta: IndustriesCta
};

export const IndustriesPage = () => {
  const { content, order } = usePageContent('industries');

  return (
    <>
      <SEOHead
        title="Industries We Serve | Specialized Digital Solutions | Adlogix"
        description="Discover how Adlogix builds tailored digital marketing, creative video, and technology architectures for Beauty, Real Estate, E-commerce, Healthcare, Tech Startups, and more."
        canonical="https://adlogix.agency/industries"
      />

      <div className="bg-white">
        <PageSections sections={industriesSections} order={order} content={content} />
      </div>
    </>
  );
};
