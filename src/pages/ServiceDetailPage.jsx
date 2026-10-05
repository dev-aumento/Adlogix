import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ChevronDown, Sparkles, HelpCircle, ShieldCheck, Zap } from 'lucide-react';
import { SEOHead } from '../components/ui/SEOHead';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Button } from '../components/ui/Button';
import { DynamicIcon } from '../components/ui/DynamicIcon';
import { GrowthPlansSection } from '../components/home/GrowthPlansSection';
import { useCMS } from '../hooks/useCMS';

export const ServiceDetailPage = () => {
  const { slug } = useParams();
  const { services, projects, openDiscoveryModal } = useCMS();
  const [openFaq, setOpenFaq] = useState(null);

  const service = services.find((s) => s.slug === slug);

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  // Related projects that delivered this service
  const relatedProjects = projects.filter((p) =>
    p.servicesDelivered?.some(
      (sd) =>
        sd.toLowerCase().includes(service.title.toLowerCase()) ||
        service.title.toLowerCase().includes(sd.toLowerCase())
    )
  );

  return (
    <>
      <SEOHead
        title={`${service.title} | Adlogix Agency`}
        description={service.shortDesc}
        canonical={`https://adlogix.agency/services/${service.slug}`}
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": service.title,
          "provider": {
            "@type": "MarketingAgency",
            "name": "Adlogix",
            "url": "https://adlogix.agency"
          },
          "description": service.shortDesc
        }}
      />

      <div className="bg-white">
        {/* Header Breadcrumb & Service Hero */}
        <section className="py-14 sm:py-20 bg-brand-surface-soft/60 border-b border-brand-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb
              items={[
                { label: "Services", href: "/services" },
                { label: service.title }
              ]}
            />

            <div className="mt-6 max-w-4xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blue-light text-brand-blue text-xs font-bold border border-brand-blue/20">
                <DynamicIcon name={service.icon} className="w-4 h-4" />
                <span>{service.categoryTitle}</span>
              </div>

              <h1 className="editorial-heading text-4xl sm:text-5xl lg:text-6xl font-black text-brand-navy leading-tight">
                {service.title}
              </h1>

              <p className="text-base sm:text-xl text-brand-muted leading-relaxed max-w-3xl">
                {service.fullDesc || service.shortDesc}
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Button to={`/contact?service=${encodeURIComponent(service.title)}`} variant="primary" size="lg" icon={ArrowRight}>
                  Request {service.title} Scope
                </Button>
                <Button onClick={openDiscoveryModal} variant="secondary" size="lg">
                  Book Strategy Call
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Deliverables & Technology Stack */}
        <section className="py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Left Column: Key Deliverables */}
              <div className="lg:col-span-7 space-y-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
                    What We Deliver
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-brand-navy mt-1">
                    Structured Execution & Outcomes
                  </h2>
                </div>

                <div className="space-y-4">
                  {service.deliverables?.map((del, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-brand-surface-soft/60 border border-brand-border flex items-start gap-4 hover:bg-white hover:shadow-card-subtle transition-all"
                    >
                      <div className="w-8 h-8 rounded-xl bg-brand-blue text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-brand-navy font-display">
                          {del}
                        </h4>
                        <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                          Executed with rigorous QA testing, real-time reporting metrics, and alignment with your target customer acquisition cost.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Tech Stack & Why Us Sidebar */}
              <div className="lg:col-span-5 space-y-8">
                {/* Tech Stack Card */}
                <div className="p-8 rounded-3xl bg-brand-surface-soft border border-brand-border shadow-sm">
                  <h3 className="text-lg font-bold font-display text-brand-navy mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-brand-blue" />
                    <span>Tech Stack & Platforms</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {service.technologies?.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3.5 py-1.5 rounded-xl bg-white border border-brand-border text-xs font-bold text-brand-navy shadow-2xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-brand-border/60">
                    <div className="text-xs text-brand-muted leading-relaxed">
                      Powered by modern architectures, first-party data security, and enterprise infrastructure support through <strong className="text-brand-navy">Aumento Infoway</strong>.
                    </div>
                  </div>
                </div>

                {/* Direct Scope Consultation Box */}
                <div className="p-8 rounded-3xl bg-brand-navy text-white shadow-xl relative overflow-hidden">
                  <div className="relative z-10 space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center font-bold">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold font-display">
                      Need a Custom Strategy for {service.title}?
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Speak directly with our senior creative and growth team to structure a high-performance rollout plan.
                    </p>
                    <Button
                      to={`/contact?service=${encodeURIComponent(service.title)}`}
                      variant="primary"
                      size="md"
                      className="w-full justify-center"
                      icon={ArrowRight}
                    >
                      Request Proposal
                    </Button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* FAQs Section */}
        {service.faqs && service.faqs.length > 0 && (
          <section className="py-16 bg-brand-surface-soft/60 border-t border-brand-border">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
                  Clear Answers
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-brand-navy mt-1">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-3">
                {service.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white border border-brand-border shadow-xs overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between text-left font-bold text-base text-brand-navy"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-brand-blue transition-transform duration-200 shrink-0 ml-4 ${
                          openFaq === idx ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openFaq === idx && (
                      <p className="mt-3 text-sm text-brand-muted leading-relaxed pt-3 border-t border-slate-100">
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Growth Plans & Package Options */}
        <GrowthPlansSection />

        {/* Bottom Related CTA */}
        <section className="py-16 bg-white border-t border-brand-border text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-brand-navy">
              Ready to Accelerate with {service.title}?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Button to="/contact" variant="primary" size="lg" icon={ArrowRight}>
                Get Started
              </Button>
              <Button to="/services" variant="secondary" size="lg">
                View All Services
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
