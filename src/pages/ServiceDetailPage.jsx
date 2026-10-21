import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ChevronDown, Sparkles, HelpCircle, ShieldCheck, Zap } from 'lucide-react';
import { SEOHead } from '../components/ui/SEOHead';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Button } from '../components/ui/Button';
import { DynamicIcon } from '../components/ui/DynamicIcon';
import { BoldWords } from '../components/ui/BoldWords';
import { toRouterPath } from '../components/ui/SmartLink';
import { GrowthPlansSection } from '../components/home/GrowthPlansSection';
import { useCMS } from '../hooks/useCMS';
import { usePageContent } from '../hooks/usePageContent';
import { servicesDefaults, fillService } from '../content/services';
import { toDeliverables } from '../services/collections';
import { findBySlug } from '../services/normalizers';

/** Button props for a CTA link: router for site paths, new tab for other websites. */
const linkProps = (href) => {
  const path = toRouterPath(href);
  return path ? { to: path } : { href };
};

export const ServiceDetailPage = () => {
  const { slug } = useParams();
  const { services, openDiscoveryModal } = useCMS();
  const [openFaq, setOpenFaq] = useState(null);
  // The single-service labels are edited on the Services page; the request is cached and shared.
  const { content } = usePageContent('services');
  const t = content.detail ?? servicesDefaults.detail;

  const service = findBySlug(services, slug);

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const categoryTitle =
    (service.category === 'web-it' ? content.catalog?.webTitle : content.catalog?.marketingTitle)
    ?? service.categoryTitle;

  const hasClosingPrimary = Boolean(t.ctaPrimaryLabel && t.ctaPrimaryLink);
  const hasClosingSecondary = Boolean(t.ctaSecondaryLabel && t.ctaSecondaryLink);
  // Accepts the WordPress "Title | Note" rows and the built-in list's plain strings.
  const deliverables = toDeliverables(service.deliverables);

  return (
    <>
      <SEOHead
        title={service.seoTitle || `${service.title} | Adlogix Agency`}
        description={service.seoDescription || service.shortDesc}
        canonical={`https://adlogix.in/services/${service.slug}`}
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": service.title,
          "provider": {
            "@type": "MarketingAgency",
            "name": "Adlogix",
            "url": "https://adlogix.in"
          },
          "description": service.seoDescription || service.shortDesc
        }}
      />

      <div className="bg-white">
        {/* Header Breadcrumb & Service Hero */}
        <section className="py-14 sm:py-20 bg-brand-surface-soft/60 border-b border-brand-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb
              items={[
                ...(t.breadcrumbLabel ? [{ label: t.breadcrumbLabel, href: "/services" }] : []),
                { label: service.title }
              ]}
            />

            <div className="mt-6 max-w-4xl space-y-6">
              {categoryTitle && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blue-light text-brand-blue text-xs font-bold border border-brand-blue/20">
                  <DynamicIcon name={service.icon} className="w-4 h-4" />
                  <span>{categoryTitle}</span>
                </div>
              )}

              <h1 className="editorial-heading text-4xl sm:text-5xl lg:text-6xl font-black text-brand-navy leading-tight">
                {service.title}
              </h1>

              {(service.fullDesc || service.shortDesc) && (
                <p className="text-base sm:text-xl text-brand-muted leading-relaxed max-w-3xl">
                  {service.fullDesc || service.shortDesc}
                </p>
              )}

              {(t.heroCtaLabel || t.heroSecondaryLabel) && (
                <div className="pt-4 flex flex-wrap items-center gap-4">
                  {t.heroCtaLabel && (
                    <Button to={`/contact?service=${encodeURIComponent(service.title)}`} variant="primary" size="lg" icon={ArrowRight}>
                      {fillService(t.heroCtaLabel, service.title)}
                    </Button>
                  )}
                  {t.heroSecondaryLabel && (
                    <Button onClick={openDiscoveryModal} variant="secondary" size="lg">
                      {t.heroSecondaryLabel}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Deliverables & Technology Stack */}
        <section className="py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Left Column: Key Deliverables */}
              {deliverables.length > 0 && (
                <div className="lg:col-span-7 space-y-8">
                  {(t.deliverablesEyebrow || t.deliverablesTitle) && (
                    <div>
                      {t.deliverablesEyebrow && (
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
                          {t.deliverablesEyebrow}
                        </span>
                      )}
                      {t.deliverablesTitle && (
                        <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-brand-navy mt-1">
                          {t.deliverablesTitle}
                        </h2>
                      )}
                    </div>
                  )}

                  <div className="space-y-4">
                    {deliverables.map((del, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-brand-surface-soft/60 border border-brand-border flex items-start gap-4 hover:bg-white hover:shadow-card-subtle transition-all"
                      >
                        <div className="w-8 h-8 rounded-xl bg-brand-blue text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-brand-navy font-display">
                            {del.title}
                          </h4>
                          {del.description && (
                            <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                              {del.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Right Column: Tech Stack & Why Us Sidebar */}
              <div className="lg:col-span-5 space-y-8">
                {/* Tech Stack Card */}
                {service.technologies?.length > 0 && (
                  <div className="p-8 rounded-3xl bg-brand-surface-soft border border-brand-border shadow-sm">
                    {t.techTitle && (
                      <h3 className="text-lg font-bold font-display text-brand-navy mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-brand-blue" />
                        <span>{t.techTitle}</span>
                      </h3>
                    )}
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

                    {t.techNote && (
                      <div className="mt-6 pt-6 border-t border-brand-border/60">
                        <div className="text-xs text-brand-muted leading-relaxed">
                          <BoldWords text={t.techNote} highlight={t.techNoteHighlight} />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Direct Scope Consultation Box */}
                {(t.consultTitle || t.consultText || t.consultButtonLabel) && (
                  <div className="p-8 rounded-3xl bg-brand-navy text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10 space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center font-bold">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      {t.consultTitle && (
                        <h3 className="text-xl font-bold font-display">
                          {fillService(t.consultTitle, service.title)}
                        </h3>
                      )}
                      {t.consultText && (
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {t.consultText}
                        </p>
                      )}
                      {t.consultButtonLabel && (
                        <Button
                          to={`/contact?service=${encodeURIComponent(service.title)}`}
                          variant="primary"
                          size="md"
                          className="w-full justify-center"
                          icon={ArrowRight}
                        >
                          {t.consultButtonLabel}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* FAQs Section */}
        {service.faqs && service.faqs.length > 0 && (
          <section className="py-16 bg-brand-surface-soft/60 border-t border-brand-border">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              {(t.faqEyebrow || t.faqTitle) && (
                <div className="text-center mb-12">
                  {t.faqEyebrow && (
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
                      {t.faqEyebrow}
                    </span>
                  )}
                  {t.faqTitle && (
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-brand-navy mt-1">
                      {t.faqTitle}
                    </h2>
                  )}
                </div>
              )}

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

        {/* Growth Plans: this service's own pricing, else the Services page pricing */}
        <GrowthPlansSection content={service.plans ?? content.plans} />

        {/* Bottom Related CTA */}
        {(t.ctaTitle || hasClosingPrimary || hasClosingSecondary) && (
          <section className="py-16 bg-white border-t border-brand-border text-center">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
              {t.ctaTitle && (
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-brand-navy">
                  {fillService(t.ctaTitle, service.title)}
                </h2>
              )}
              {(hasClosingPrimary || hasClosingSecondary) && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                  {hasClosingPrimary && (
                    <Button {...linkProps(t.ctaPrimaryLink)} variant="primary" size="lg" icon={ArrowRight}>
                      {t.ctaPrimaryLabel}
                    </Button>
                  )}
                  {hasClosingSecondary && (
                    <Button {...linkProps(t.ctaSecondaryLink)} variant="secondary" size="lg">
                      {t.ctaSecondaryLabel}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </>
  );
};
