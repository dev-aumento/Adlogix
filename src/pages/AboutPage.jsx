import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Users, ArrowRight, ExternalLink } from 'lucide-react';
import { SEOHead } from '../components/ui/SEOHead';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
import { SmartLink, toRouterPath } from '../components/ui/SmartLink';
import { PageSections } from '../components/sections/PageSections';
import { useCMS } from '../hooks/useCMS';
import { usePageContent } from '../hooks/usePageContent';
import { aboutDefaults } from '../content/about';

/** Bold the words WordPress marked inside a paragraph. Without a match the text is unchanged. */
const withBold = (copy, highlight) => {
  if (!highlight || !copy.includes(highlight)) return copy;
  const [before, ...rest] = copy.split(highlight);
  return (
    <>
      {before}
      <strong className="text-brand-navy">{highlight}</strong>
      {rest.join(highlight)}
    </>
  );
};

const AboutHero = ({ content = aboutDefaults.hero }) => {
  const { badge, headline, description } = content;
  const hasHeadline = Boolean(headline?.line1 || headline?.highlight1);

  if (!badge && !hasHeadline && !description) return null;

  return (
    <section className="py-20 lg:py-28 bg-brand-surface-soft/60 relative overflow-hidden border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          {badge && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blue-light text-brand-blue text-xs font-bold border border-brand-blue/20 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{badge}</span>
            </motion.div>
          )}

          {hasHeadline && (
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="editorial-heading text-4xl sm:text-5xl lg:text-6xl text-brand-navy font-black leading-[1.1]"
            >
              {headline.line1}
              {headline.line1 && headline.highlight1 ? ' ' : ''}
              {headline.highlight1 && (
                <span className="gradient-text-blue block mt-1">
                  {headline.highlight1}
                </span>
              )}
            </motion.h1>
          )}

          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-brand-muted leading-relaxed"
            >
              {description}
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
};

const AboutStory = ({ content = aboutDefaults.story }) => {
  const { eyebrow, title, paragraphs = [], metrics = [], image, imageAlt } = content;

  if (!eyebrow && !title && paragraphs.length === 0 && metrics.length === 0 && !image) return null;

  return (
    <section className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <div className={`${image ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-6`}>
            {eyebrow && (
              <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-brand-navy leading-tight">
                {title}
              </h2>
            )}
            {paragraphs.map((paragraph, idx) => (
              <p key={idx} className="text-sm sm:text-base text-brand-muted leading-relaxed">
                {paragraph}
              </p>
            ))}

            {metrics.length > 0 && (
              <div className="pt-4 grid grid-cols-2 gap-4">
                {metrics.map((metric, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-brand-surface-soft border border-brand-border">
                    <div
                      className={`text-2xl font-black font-display ${idx === 0 ? 'text-brand-blue' : 'text-brand-navy'}`}
                    >
                      {metric.value}
                    </div>
                    {metric.label && (
                      <div className="text-xs text-brand-muted mt-1 font-medium">{metric.label}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Story Visual Card */}
          {image && (
            <div className="lg:col-span-6 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-brand-border aspect-[4/3] bg-slate-900">
                <img
                  src={image}
                  alt={imageAlt}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

const AboutPartner = ({ content = aboutDefaults.partner }) => {
  const { badge, title, text, highlight, ctaLabel, ctaLink } = content;
  const hasButton = Boolean(ctaLabel && ctaLink);

  if (!badge && !title && !text && !hasButton) return null;

  return (
    <section className="py-16 bg-brand-surface-soft/60 border-y border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-brand-border shadow-card-subtle flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            {badge && (
              <span className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-brand-blue-light text-brand-blue border border-brand-blue/20">
                {badge}
              </span>
            )}
            {title && (
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-brand-navy">
                {title}
              </h3>
            )}
            {text && (
              <p className="text-sm text-brand-muted leading-relaxed">
                {withBold(text, highlight)}
              </p>
            )}
          </div>

          {hasButton && (
            <SmartLink
              href={ctaLink}
              className="shrink-0 px-6 py-3.5 rounded-full bg-brand-navy hover:bg-brand-navy-dark text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 group"
            >
              <span>{ctaLabel}</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </SmartLink>
          )}
        </div>
      </div>
    </section>
  );
};

const AboutTeam = ({ content = aboutDefaults.team }) => {
  const { badge, title, highlight, subtitle, members = [] } = content;

  if (members.length === 0) return null;

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge={badge}
          badgeIcon={Users}
          title={title}
          highlightWord={highlight}
          subtitle={subtitle}
          align="center"
          className="mb-16"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member, idx) => (
            <div
              key={idx}
              className="rounded-3xl bg-white border border-brand-border overflow-hidden shadow-card-subtle hover:shadow-glossy transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-slate-900">
                <img
                  src={member.photo}
                  alt={member.alt || member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-lg font-bold font-display">{member.name}</div>
                  {member.role && (
                    <div className="text-xs text-cyan-300 font-semibold">{member.role}</div>
                  )}
                </div>
              </div>

              {(member.bio || member.linkedin) && (
                <div className="p-5 flex-1 flex flex-col justify-between">
                  {member.bio && (
                    <p className="text-xs text-brand-muted leading-relaxed">
                      {member.bio}
                    </p>
                  )}
                  {member.linkedin && (
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <SmartLink
                        href={member.linkedin}
                        className="text-xs font-bold text-brand-blue hover:underline inline-flex items-center gap-1"
                      >
                        <span>Connect on LinkedIn</span>
                        <ExternalLink className="w-3 h-3" />
                      </SmartLink>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutCta = ({ content = aboutDefaults.cta }) => {
  const { openDiscoveryModal } = useCMS();
  const { title, text, primaryLabel, primaryLink, secondaryLabel } = content;
  const hasPrimary = Boolean(primaryLabel && primaryLink);
  // Site paths go through the router; another website opens in a new tab.
  const primaryPath = toRouterPath(primaryLink);

  if (!title && !text && !hasPrimary && !secondaryLabel) return null;

  return (
    <section className="py-16 bg-brand-surface-soft/60 border-t border-brand-border text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {title && (
          <h2 className="text-3xl sm:text-4xl font-black font-display text-brand-navy">
            {title}
          </h2>
        )}
        {text && (
          <p className="text-sm sm:text-base text-brand-muted max-w-xl mx-auto">
            {text}
          </p>
        )}
        {(hasPrimary || secondaryLabel) && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {hasPrimary && (
              <Button
                {...(primaryPath ? { to: primaryPath } : { href: primaryLink })}
                variant="primary"
                size="lg"
                icon={ArrowRight}
              >
                {primaryLabel}
              </Button>
            )}
            {secondaryLabel && (
              <Button onClick={openDiscoveryModal} variant="secondary" size="lg">
                {secondaryLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

// Keys must match the "about" entry in the plugin's section registry.
const aboutSections = {
  hero: AboutHero,
  story: AboutStory,
  partner: AboutPartner,
  team: AboutTeam,
  cta: AboutCta
};

export const AboutPage = () => {
  const { content, order } = usePageContent('about');

  return (
    <>
      <SEOHead
        title="About Us | Built Around Ideas. Driven by Growth | Adlogix"
        description="Learn about Adlogix, a full-service creative digital marketing and IT solutions agency powered by Aumento Infoway. Discover our team, philosophy, and approach."
        canonical="https://adlogix.in/about"
      />

      <div className="bg-white">
        <PageSections sections={aboutSections} order={order} content={content} />
      </div>
    </>
  );
};
