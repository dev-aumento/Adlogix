import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, TrendingUp, Code2, Layers } from 'lucide-react';
import { SEOHead } from '../components/ui/SEOHead';
import { Button } from '../components/ui/Button';
import { DynamicIcon } from '../components/ui/DynamicIcon';
import { PageSections } from '../components/sections/PageSections';
import { GrowthPlansSection } from '../components/home/GrowthPlansSection';
import { useCMS, useCollection } from '../hooks/useCMS';
import { usePageContent } from '../hooks/usePageContent';

const ServicesHero = () => (
  <section className="py-20 lg:py-28 bg-brand-surface-soft/60 relative overflow-hidden border-b border-brand-border">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blue-light text-brand-blue text-xs font-bold border border-brand-blue/20 mb-6"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Full-Stack Capabilities</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="editorial-heading text-4xl sm:text-5xl lg:text-6xl text-brand-navy font-black leading-[1.1]"
        >
          Creative Meets Performance.{' '}
          <span className="gradient-text-blue block mt-1">
            Engineered for Scale.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-brand-muted leading-relaxed"
        >
          Whether you need high-converting 9:16 vertical reels, multi-channel paid acquisition, bespoke Shopify storefronts, or enterprise headless React applications, we build solutions that deliver measurable ROI.
        </motion.p>
      </div>
    </div>
  </section>
);

// Filter bar and grid share the selected category, so they move as one section.
const ServicesCatalog = () => {
  const { openDiscoveryModal } = useCMS();
  const services = useCollection('services', 'services');
  const [chosenCategory, setSelectedCategory] = useState("all");

  const hasCategory = (id) => services.some((s) => s.category === id);
  const showCategoryFilters = hasCategory('marketing-creative') && hasCategory('web-it');
  const selectedCategory = showCategoryFilters ? chosenCategory : "all";
  const filteredServices = selectedCategory === "all"
    ? services
    : services.filter(s => s.category === selectedCategory);

  if (services.length === 0) return null;

  return (
    <>
      {/* Filter Navigation */}
      <section className="py-8 border-b border-brand-border bg-white sticky top-20 z-30 shadow-xs backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-1.5 p-1.5 bg-brand-surface-soft rounded-full border border-brand-border flex-nowrap overflow-x-auto no-scrollbar max-w-full">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all select-none ${
                selectedCategory === "all" ? "bg-brand-navy text-white shadow-sm" : "text-brand-muted hover:text-brand-navy"
              }`}
            >
              All Capabilities ({services.length})
            </button>
            {showCategoryFilters && (
              <>
                <button
                  onClick={() => setSelectedCategory("marketing-creative")}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 select-none ${
                    selectedCategory === "marketing-creative" ? "bg-brand-blue text-white shadow-md shadow-brand-blue/30" : "text-brand-muted hover:text-brand-navy"
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Marketing & Creative</span>
                </button>
                <button
                  onClick={() => setSelectedCategory("web-it")}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 select-none ${
                    selectedCategory === "web-it" ? "bg-brand-blue text-white shadow-md shadow-brand-blue/30" : "text-brand-muted hover:text-brand-navy"
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Web, E-commerce & IT</span>
                </button>
              </>
            )}
          </div>

          <Button onClick={openDiscoveryModal} variant="outline" size="sm" className="whitespace-nowrap shrink-0">
            Request Custom Scope
          </Button>
        </div>
      </section>

      {/* Services List / Grid */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="flex flex-col justify-between p-8 rounded-3xl bg-white border border-brand-border/90 hover:border-brand-blue/40 shadow-card-subtle hover:shadow-glossy transition-all duration-300 group"
              >
                <div>
                  {/* Icon & Category */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-brand-surface-soft group-hover:bg-brand-blue text-brand-blue group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm">
                      <DynamicIcon name={service.icon} className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-surface-soft text-slate-500">
                      {service.category === 'web-it' ? 'Technology' : 'Marketing'}
                    </span>
                  </div>

                  <Link to={`/services/${service.slug}`}>
                    <h3 className="text-2xl font-bold font-display text-brand-navy group-hover:text-brand-blue transition-colors mb-3">
                      {service.title}
                    </h3>
                  </Link>

                  {service.shortDesc && (
                    <p className="text-sm text-brand-muted leading-relaxed mb-6">
                      {service.shortDesc}
                    </p>
                  )}

                  {/* Highlights */}
                  {service.highlights?.length > 0 && (
                    <div className="space-y-2 mb-6">
                      {service.highlights.map((h, hIdx) => (
                        <div key={hIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Action Link */}
                <div className="pt-6 border-t border-slate-100 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1 shrink min-w-0">
                    {service.technologies?.slice(0, 3).map((t, tIdx) => (
                      <span key={tIdx} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-surface-soft text-slate-500 whitespace-nowrap">
                        {t}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/services/${service.slug}`}
                    className="text-xs font-bold text-brand-blue group-hover:text-brand-blue-hover flex items-center gap-1 group-hover:translate-x-1 transition-all whitespace-nowrap shrink-0 ml-auto"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

const ServicesCta = () => {
  const { openDiscoveryModal } = useCMS();

  return (
    <section className="py-16 bg-brand-surface-soft/60 border-t border-brand-border text-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-brand-navy">
          Not Sure Which Growth Track Fits Your Stage?
        </h2>
        <p className="text-sm sm:text-base text-brand-muted">
          Schedule a 30-minute discovery session with our senior growth architects to assess your acquisition channels and tech stack.
        </p>
        <div className="pt-2">
          <Button onClick={openDiscoveryModal} variant="primary" size="lg" icon={ArrowRight}>
            Book a Free Strategy Session
          </Button>
        </div>
      </div>
    </section>
  );
};

// Keys must match the "services" entry in the plugin's section registry.
const servicesSections = {
  hero: ServicesHero,
  catalog: ServicesCatalog,
  plans: GrowthPlansSection,
  cta: ServicesCta
};

export const ServicesPage = () => {
  const { content, order } = usePageContent('services');

  return (
    <>
      <SEOHead
        title="Services & Capabilities | Digital Marketing & IT Solutions | Adlogix"
        description="Explore our full spectrum of digital marketing, creative advertising, performance marketing, Shopify e-commerce, and headless React web development services."
        canonical="https://adlogix.agency/services"
      />

      <div className="bg-white">
        <PageSections sections={servicesSections} order={order} content={content} />
      </div>
    </>
  );
};
