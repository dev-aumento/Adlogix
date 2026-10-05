import React from 'react';
import { motion } from 'framer-motion';
import { Play, Star, MessageSquare, Quote, ArrowRight, ShieldCheck } from 'lucide-react';
import { SEOHead } from '../components/ui/SEOHead';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
import { useCMS } from '../hooks/useCMS';
import { Link } from 'react-router-dom';

export const TestimonialsPage = () => {
  const { testimonials, openVideoModal, openDiscoveryModal } = useCMS();

  return (
    <>
      <SEOHead
        title="Client Video Testimonials & Success Stories | Adlogix"
        description="Watch authentic video reviews and read verified feedback from founders and marketing executives who scaled with Adlogix."
        canonical="https://adlogix.agency/testimonials"
      />

      <div className="bg-white">
        {/* Page Hero */}
        <section className="py-20 lg:py-28 bg-brand-surface-soft/60 relative overflow-hidden border-b border-brand-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blue-light text-brand-blue text-xs font-bold border border-brand-blue/20 mb-6"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Verified Client Stories</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="editorial-heading text-4xl sm:text-5xl lg:text-6xl text-brand-navy font-black leading-[1.1]"
              >
                Don't Just Take Our Word.{' '}
                <span className="gradient-text-blue block mt-1">
                  Hear It From Our Partners.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 text-base sm:text-lg text-brand-muted leading-relaxed"
              >
                Authentic, transparent reviews from growth leaders who rely on Adlogix for high-converting creatives, multi-channel performance advertising, and modern web applications.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Video Testimonials Showcase */}
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
                  <div
                    onClick={() => openVideoModal({
                      title: `${test.clientName} - ${test.company}`,
                      client: test.company,
                      videoUrl: test.videoUrl,
                      videoThumbnail: test.videoThumbnail,
                      quote: test.quote,
                      role: test.role,
                      company: test.company,
                      result: test.result,
                      projectSlug: test.projectSlug
                    })}
                    className="relative w-full sm:w-48 aspect-[4/5] sm:aspect-auto rounded-2xl overflow-hidden bg-slate-900 shrink-0 group cursor-pointer shadow-sm"
                  >
                    <img
                      src={test.videoThumbnail}
                      alt={test.clientName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-brand-blue text-white flex items-center justify-center shadow-lg shadow-brand-blue/40 border border-white/30 group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current translate-x-0.5" />
                      </div>
                    </div>

                    <div className="absolute bottom-2 left-2 right-2 text-center text-[10px] font-bold text-white bg-black/60 backdrop-blur-md py-1 px-2 rounded-lg">
                      Watch Video
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 mb-3 text-amber-400">
                        {[...Array(test.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>

                      <p className="text-sm sm:text-base text-brand-navy font-medium italic leading-relaxed mb-4">
                        "{test.quote}"
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-bold font-display text-brand-navy">
                          {test.clientName}
                        </h4>
                        <p className="text-xs text-brand-muted">
                          {test.role}, <strong className="text-slate-700">{test.company}</strong>
                        </p>
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

        {/* CTA */}
        <section className="py-16 bg-brand-surface-soft/60 border-t border-brand-border text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="text-3xl font-black font-display text-brand-navy">
              Become Our Next Success Story
            </h2>
            <p className="text-sm text-brand-muted">
              Book a strategy consultation to explore how Adlogix can scale your revenue.
            </p>
            <Button onClick={openDiscoveryModal} variant="primary" size="lg" icon={ArrowRight}>
              Schedule a Discovery Call
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};
