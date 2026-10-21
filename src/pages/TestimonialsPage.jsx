import React from 'react';
import { motion } from 'framer-motion';
import { Play, Star, MessageSquare, ArrowRight } from 'lucide-react';
import { SEOHead } from '../components/ui/SEOHead';
import { Button } from '../components/ui/Button';
import { PageSections } from '../components/sections/PageSections';
import { TestimonialRole, testimonialVideo } from '../components/ui/TestimonialRole';
import { useCMS, useCollection } from '../hooks/useCMS';
import { usePageContent } from '../hooks/usePageContent';
import { testimonialsDefaults } from '../content/testimonials';

const TestimonialsHero = ({ content = testimonialsDefaults.hero }) => {
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
              <MessageSquare className="w-3.5 h-3.5" />
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

const TestimonialsGrid = ({ content = testimonialsDefaults.grid }) => {
  const { openVideoModal } = useCMS();
  const testimonials = useCollection('testimonials', 'testimonials');

  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((test, idx) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col sm:flex-row gap-6 p-7 sm:p-8 rounded-3xl bg-white border border-brand-border shadow-card-subtle hover:shadow-glossy hover:border-brand-blue/30 transition-all"
            >
              {/* Video Thumbnail */}
              {(test.videoThumbnail || test.videoUrl) && (
                <div
                  onClick={test.videoUrl ? () => openVideoModal(testimonialVideo(test)) : undefined}
                  className={`relative w-full sm:w-48 aspect-[4/5] sm:aspect-auto rounded-2xl overflow-hidden bg-slate-900 shrink-0 group shadow-sm ${test.videoUrl ? 'cursor-pointer' : ''}`}
                >
                  {test.videoThumbnail && (
                    <img
                      src={test.videoThumbnail}
                      alt={test.clientName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  )}
                  {test.videoUrl && (
                    <>
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-brand-blue text-white flex items-center justify-center shadow-lg shadow-brand-blue/40 border border-white/30 group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current translate-x-0.5" />
                        </div>
                      </div>

                      {content.videoLabel && (
                        <div className="absolute bottom-2 left-2 right-2 text-center text-[10px] font-bold text-white bg-black/60 backdrop-blur-md py-1 px-2 rounded-lg">
                          {content.videoLabel}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  {test.rating > 0 && (
                    <div className="flex items-center gap-1 mb-3 text-amber-400">
                      {[...Array(test.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  )}

                  <p className="text-sm sm:text-base text-brand-navy font-medium italic leading-relaxed mb-4">
                    "{test.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2 items-center justify-between">
                  <div className="w-full">
                    <h4 className="text-base font-bold font-display text-brand-navy">
                      {test.clientName}
                    </h4>
                    <TestimonialRole role={test.role} company={test.company} className="text-xs text-brand-muted" />
                  </div>

                  {test.result && (
                    <span className="px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200">
                      {test.result}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialsCta = ({ content = testimonialsDefaults.cta }) => {
  const { openDiscoveryModal } = useCMS();
  const { title, text, buttonLabel } = content;

  if (!title && !text && !buttonLabel) return null;

  return (
    <section className="py-16 bg-brand-surface-soft/60 border-t border-brand-border text-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {title && (
          <h2 className="text-3xl font-black font-display text-brand-navy">
            {title}
          </h2>
        )}
        {text && <p className="text-sm text-brand-muted">{text}</p>}
        {buttonLabel && (
          <Button onClick={openDiscoveryModal} variant="primary" size="lg" icon={ArrowRight}>
            {buttonLabel}
          </Button>
        )}
      </div>
    </section>
  );
};

// Keys must match the "testimonials" entry in the plugin's section registry.
const testimonialsSections = {
  hero: TestimonialsHero,
  grid: TestimonialsGrid,
  cta: TestimonialsCta
};

export const TestimonialsPage = () => {
  const { content, order } = usePageContent('testimonials');

  return (
    <>
      <SEOHead
        title="Client Video Testimonials & Success Stories | Adlogix"
        description="Watch authentic video reviews and read verified feedback from founders and marketing executives who scaled with Adlogix."
        canonical="https://adlogix.in/testimonials"
      />

      <div className="bg-white">
        <PageSections sections={testimonialsSections} order={order} content={content} />
      </div>
    </>
  );
};
