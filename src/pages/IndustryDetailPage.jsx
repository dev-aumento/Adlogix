import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, AlertCircle, ChevronRight, Layers } from 'lucide-react';
import { SEOHead } from '../components/ui/SEOHead';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Button } from '../components/ui/Button';
import { DynamicIcon } from '../components/ui/DynamicIcon';
import { SmartLink } from '../components/ui/SmartLink';
import { useCMS } from '../hooks/useCMS';
import { usePageContent } from '../hooks/usePageContent';
import { findBySlug } from '../services/normalizers';
import { industriesDefaults, fillIndustry } from '../content/industries';

export const IndustryDetailPage = () => {
  const { slug } = useParams();
  const { industries, openDiscoveryModal } = useCMS();
  // The single-industry labels are edited on the Industries page; the request is cached.
  const { content } = usePageContent('industries');
  const t = content.detail ?? industriesDefaults.detail;

  const industry = findBySlug(industries, slug);

  if (!industry) {
    return <Navigate to="/industries" replace />;
  }

  return (
    <>
      <SEOHead
        title={`${industry.name} Marketing & Web Solutions | Adlogix`}
        description={industry.shortDesc}
        canonical={`https://adlogix.in/industries/${industry.slug}`}
        ogImage={industry.heroImage}
      />

      <div className="bg-white">
        {/* Breadcrumb & Hero Header */}
        <section className="py-14 sm:py-20 bg-brand-surface-soft/60 border-b border-brand-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb
              items={[
                ...(t.breadcrumbLabel ? [{ label: t.breadcrumbLabel, href: "/industries" }] : []),
                { label: industry.name }
              ]}
            />

            <div className="mt-6 max-w-4xl space-y-6">
              {t.badgeLabel && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blue-light text-brand-blue text-xs font-bold border border-brand-blue/20">
                  <DynamicIcon name={industry.icon} className="w-4 h-4" />
                  <span>{t.badgeLabel}</span>
                </div>
              )}

              <h1 className="editorial-heading text-4xl sm:text-5xl lg:text-6xl font-black text-brand-navy leading-tight">
                {industry.name}
                {t.headlineSuffix && (
                  <>
                    {' '}
                    <span className="gradient-text-blue block mt-1">
                      {t.headlineSuffix}
                    </span>
                  </>
                )}
              </h1>

              {industry.shortDesc && (
                <p className="text-base sm:text-xl text-brand-muted leading-relaxed max-w-3xl">
                  {industry.shortDesc}
                </p>
              )}

              {(t.heroCtaLabel || t.heroSecondaryLabel) && (
                <div className="pt-4 flex flex-wrap items-center gap-4">
                  {t.heroCtaLabel && (
                    <Button to={`/contact?industry=${encodeURIComponent(industry.name)}`} variant="primary" size="lg" icon={ArrowRight}>
                      {fillIndustry(t.heroCtaLabel, industry.name)}
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

        {/* Featured Visual Banner */}
        {(industry.heroImage || industry.keyMetrics) && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-brand-border aspect-[21/9] bg-slate-900">
              {industry.heroImage && (
                <img
                  src={industry.heroImage}
                  alt={industry.name}
                  className="w-full h-full object-cover"
                />
              )}
              {industry.keyMetrics && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-8">
                  <div className="text-white">
                    {t.benchmarkLabel && (
                      <div className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                        {t.benchmarkLabel}
                      </div>
                    )}
                    <div className="text-xl sm:text-2xl font-bold font-display">
                      {industry.keyMetrics}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Challenges vs Solutions Breakdown */}
        {(industry.challenges?.length > 0 || industry.solutions?.length > 0) && (
          <section className="py-20 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* Challenges Column */}
                {industry.challenges?.length > 0 && (
                  <div className="p-8 rounded-3xl bg-rose-50/50 border border-rose-100 space-y-6">
                    <div className="flex items-center gap-2.5 text-rose-600">
                      <AlertCircle className="w-5 h-5" />
                      <h3 className="text-lg font-bold font-display text-rose-900">
                        {fillIndustry(t.challengesTitle, industry.name)}
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {industry.challenges?.map((ch, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-white border border-rose-100 flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                            {ch}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Solutions Column */}
                {industry.solutions?.length > 0 && (
                  <div className="p-8 rounded-3xl bg-emerald-50/50 border border-emerald-100 space-y-6">
                    <div className="flex items-center gap-2.5 text-emerald-600">
                      <CheckCircle2 className="w-5 h-5" />
                      <h3 className="text-lg font-bold font-display text-emerald-900">
                        {t.solutionsTitle}
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {industry.solutions?.map((sol, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-white border border-emerald-100 flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle2 className="w-4 h-4" />
                          </span>
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                            {sol}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </section>
        )}

        {/* Recommended Services for this Industry */}
        {industry.relevantServices?.length > 0 && (
          <section className="py-16 bg-brand-surface-soft/60 border-t border-brand-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {(t.servicesEyebrow || t.servicesTitle) && (
                <div className="text-center mb-12">
                  {t.servicesEyebrow && (
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
                      {t.servicesEyebrow}
                    </span>
                  )}
                  {t.servicesTitle && (
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-brand-navy mt-1">
                      {fillIndustry(t.servicesTitle, industry.name)}
                    </h2>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {industry.relevantServices?.map((srv, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl bg-white border border-brand-border shadow-card-subtle flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-brand-blue-light text-brand-blue flex items-center justify-center mb-4">
                        <Layers className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold font-display text-brand-navy mb-2">
                        {srv.title}
                      </h4>
                      {srv.description && (
                        <p className="text-xs text-brand-muted leading-relaxed">
                          {srv.description}
                        </p>
                      )}
                    </div>

                    {srv.link && t.servicesLinkLabel && (
                      <div className="pt-4 mt-4 border-t border-slate-100">
                        <SmartLink
                          href={srv.link}
                          className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1"
                        >
                          <span>{t.servicesLinkLabel}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </SmartLink>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        {(t.ctaTitle || t.ctaText || t.ctaButtonLabel) && (
          <section className="py-16 bg-white border-t border-brand-border text-center">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              {t.ctaTitle && (
                <h2 className="text-3xl font-black font-display text-brand-navy">
                  {fillIndustry(t.ctaTitle, industry.name)}
                </h2>
              )}
              {t.ctaText && <p className="text-sm text-brand-muted">{t.ctaText}</p>}
              {t.ctaButtonLabel && (
                <Button
                  to={`/contact?industry=${encodeURIComponent(industry.name)}`}
                  variant="primary"
                  size="lg"
                  icon={ArrowRight}
                >
                  {t.ctaButtonLabel}
                </Button>
              )}
            </div>
          </section>
        )}
      </div>
    </>
  );
};
