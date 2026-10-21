import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle2, TrendingUp, Sparkles, Building, Layers, Quote } from 'lucide-react';
import { SEOHead } from '../components/ui/SEOHead';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Button } from '../components/ui/Button';
import { toRouterPath } from '../components/ui/SmartLink';
import { useCMS } from '../hooks/useCMS';
import { usePageContent } from '../hooks/usePageContent';
import { workDefaults } from '../content/work';
import { findBySlug } from '../services/normalizers';

/** Button props for a CTA link: router for site paths, new tab for other websites. */
const linkProps = (href) => {
  const path = toRouterPath(href);
  return path ? { to: path } : { href };
};

export const ProjectDetailPage = () => {
  const { slug } = useParams();
  const { projects, openVideoModal, openDiscoveryModal } = useCMS();
  // The case-study labels are edited on the Work page; the request is cached and shared.
  const { content } = usePageContent('work');
  const t = content.detail ?? workDefaults.detail;

  const project = findBySlug(projects, slug);

  if (!project) {
    return <Navigate to="/work" replace />;
  }

  const hasClosingPrimary = Boolean(t.ctaPrimaryLabel && t.ctaPrimaryLink);
  const hasClosingSecondary = Boolean(t.ctaSecondaryLabel && t.ctaSecondaryLink);

  return (
    <>
      <SEOHead
        title={project.seoTitle || `${project.title} | Case Study | Adlogix`}
        description={project.seoDescription || project.overview}
        canonical={`https://adlogix.in/work/${project.slug}`}
        ogImage={project.heroImage}
        schema={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": project.title,
          "description": project.seoDescription || project.overview,
          "image": project.heroImage,
          "publisher": {
            "@type": "Organization",
            "name": "Adlogix",
            "logo": "https://adlogix.in/favicon.svg"
          }
        }}
      />

      <div className="bg-white">
        {/* Breadcrumb & Hero Header */}
        <section className="py-12 sm:py-16 bg-brand-surface-soft/60 border-b border-brand-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb
              items={[
                ...(t.breadcrumbLabel ? [{ label: t.breadcrumbLabel, href: "/work" }] : []),
                { label: project.client || project.title }
              ]}
            />

            <div className="mt-6 max-w-4xl space-y-6">
              {(project.categoryLabel || project.industry || project.year) && (
                <div className="flex flex-wrap items-center gap-2">
                  {project.categoryLabel && (
                    <span className="px-3 py-1 rounded-full bg-brand-blue-light text-brand-blue text-xs font-bold border border-brand-blue/20">
                      {project.categoryLabel}
                    </span>
                  )}
                  {project.industry && (
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                      {project.industry}
                    </span>
                  )}
                  {project.year && (
                    <span className="px-3 py-1 rounded-full bg-white text-brand-muted text-xs font-semibold border border-brand-border">
                      Completed {project.year}
                    </span>
                  )}
                </div>
              )}

              <h1 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-black text-brand-navy leading-tight">
                {project.title}
              </h1>

              {project.overview && (
                <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
                  {project.overview}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Hero Featured Visual Media */}
        {(project.heroImage || project.videoReelUrl) && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-brand-border aspect-[16/9] bg-slate-900 group">
              {project.heroImage && (
                <img
                  src={project.heroImage}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              )}
              
              {project.videoReelUrl && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <button
                    onClick={() =>
                      openVideoModal({
                        title: project.title,
                        client: project.client,
                        videoUrl: project.videoReelUrl,
                        thumbnail: project.heroImage,
                        description: project.overview,
                        category: project.categoryLabel,
                        aspectRatio: '9:16',
                        projectSlug: project.slug
                      })
                    }
                    className="px-6 py-3.5 rounded-full bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-sm shadow-2xl flex items-center gap-2 border border-white/30 transition-transform hover:scale-105"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span>{t.videoButtonLabel}</span>
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Verified Results Metrics Scorecard */}
        {project.results?.length > 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="p-8 sm:p-10 rounded-3xl bg-brand-surface-soft border border-brand-border shadow-card-subtle">
                {t.resultsLabel && (
                  <div className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-6">
                    {t.resultsLabel}
                  </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
                  {project.results.map((res, idx) => (
                    <div key={idx} className={idx > 0 ? "pt-4 sm:pt-0 sm:pl-6" : ""}>
                      {res.value && (
                        <div className="text-3xl sm:text-4xl font-black font-display text-brand-navy">
                          {res.value}
                        </div>
                      )}
                      {res.label && (
                        <div className="text-sm font-bold text-brand-navy mt-1">
                          {res.label}
                        </div>
                      )}
                      {res.sub && (
                        <div className="text-xs text-brand-muted mt-0.5">
                          {res.sub}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Narrative: Challenge, Strategy, Execution */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Main Narrative Column */}
              <div className="lg:col-span-8 space-y-12">
                
                {/* Challenge */}
                {project.challenge && (
                  <div className="space-y-4">
                    {t.challengeEyebrow && (
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                        {t.challengeEyebrow}
                      </span>
                    )}
                    {project.challengeTitle && (
                      <h2 className="text-2xl sm:text-3xl font-bold font-display text-brand-navy">
                        {project.challengeTitle}
                      </h2>
                    )}
                    <p className="text-base text-brand-muted leading-relaxed">
                      {project.challenge}
                    </p>
                  </div>
                )}

                {/* Strategy */}
                {project.strategy && (
                  <div className="space-y-4">
                    {t.strategyEyebrow && (
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
                        {t.strategyEyebrow}
                      </span>
                    )}
                    {project.strategyTitle && (
                      <h2 className="text-2xl sm:text-3xl font-bold font-display text-brand-navy">
                        {project.strategyTitle}
                      </h2>
                    )}
                    <p className="text-base text-brand-muted leading-relaxed">
                      {project.strategy}
                    </p>
                  </div>
                )}

                {/* Execution */}
                {project.execution && (
                  <div className="space-y-4">
                    {t.executionEyebrow && (
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                        {t.executionEyebrow}
                      </span>
                    )}
                    {project.executionTitle && (
                      <h2 className="text-2xl sm:text-3xl font-bold font-display text-brand-navy">
                        {project.executionTitle}
                      </h2>
                    )}
                    <p className="text-base text-brand-muted leading-relaxed">
                      {project.execution}
                    </p>
                  </div>
                )}

                {/* Client Testimonial Quote */}
                {project.testimonial?.quote && (
                  <div className="p-8 rounded-3xl bg-brand-surface-soft border-l-4 border-brand-blue shadow-sm space-y-4">
                    <Quote className="w-8 h-8 text-brand-blue opacity-50" />
                    <p className="text-base sm:text-lg text-brand-navy font-medium italic leading-relaxed">
                      "{project.testimonial.quote}"
                    </p>
                    {(project.testimonial.author || project.testimonial.role) && (
                      <div className="pt-2">
                        {project.testimonial.author && (
                          <div className="font-bold text-sm text-brand-navy font-display">
                            {project.testimonial.author}
                          </div>
                        )}
                        {project.testimonial.role && (
                          <div className="text-xs text-brand-muted">
                            {project.testimonial.role}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sidebar: Services Delivered & Scope Box */}
              <div className="lg:col-span-4 space-y-6">
                <div className="p-6 rounded-3xl bg-white border border-brand-border shadow-card-subtle space-y-6">
                  {project.servicesDelivered?.length > 0 && (
                    <div>
                      {t.servicesLabel && (
                        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-3">
                          {t.servicesLabel}
                        </h3>
                      )}
                      <div className="space-y-2">
                        {project.servicesDelivered.map((srv, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs font-bold text-brand-navy">
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                            <span>{srv}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(project.client || project.industry) && (
                    <div className={project.servicesDelivered?.length > 0 ? "pt-6 border-t border-slate-100" : ""}>
                      {t.clientLabel && (
                        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-2">
                          {t.clientLabel}
                        </h3>
                      )}
                      {project.client && <div className="text-base font-bold text-brand-navy">{project.client}</div>}
                      {project.industry && <div className="text-xs text-brand-muted">{project.industry}</div>}
                    </div>
                  )}

                  {t.sidebarCtaLabel && (
                    <div className="pt-4">
                      <Button
                        to={`/contact?project=${encodeURIComponent(project.title)}`}
                        variant="primary"
                        size="md"
                        className="w-full justify-center"
                        icon={ArrowRight}
                      >
                        {t.sidebarCtaLabel}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Next Project / Work Navigation */}
        {(t.ctaTitle || hasClosingPrimary || hasClosingSecondary) && (
          <section className="py-16 bg-brand-surface-soft/60 border-t border-brand-border text-center">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              {t.ctaTitle && (
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-brand-navy">
                  {t.ctaTitle}
                </h2>
              )}
              {(hasClosingPrimary || hasClosingSecondary) && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
