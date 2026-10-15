import React from 'react';
import { motion } from 'framer-motion';
import { Play, Star, MessageSquare, Quote, ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { useCMS } from '../../hooks/useCMS';
import { Link } from 'react-router-dom';

export const VideoTestimonials = ({ content }) => {
  const { testimonials, openVideoModal } = useCMS();

  return (
    <section className="py-20 lg:py-28 bg-brand-surface-soft/60 relative overflow-hidden border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <SectionHeading
          badge={content.heading.badge}
          badgeIcon={MessageSquare}
          title={content.heading.title}
          highlightWord={content.heading.highlight}
          subtitle={content.heading.subtitle}
          align="center"
          className="mb-16"
        />

        {/* Video Testimonials 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((test, idx) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col sm:flex-row gap-6 p-6 sm:p-7 rounded-3xl bg-white border border-brand-border shadow-card-subtle hover:shadow-glossy hover:border-brand-blue/30 transition-all duration-300"
            >
              {/* Video Thumbnail Column */}
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
                className="relative w-full sm:w-44 aspect-[4/5] sm:aspect-auto rounded-2xl overflow-hidden bg-slate-900 shrink-0 group cursor-pointer shadow-sm"
              >
                <img
                  src={test.videoThumbnail}
                  alt={test.clientName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-brand-blue text-white flex items-center justify-center shadow-lg shadow-brand-blue/40 border border-white/30 group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                  </div>
                </div>

                <div className="absolute bottom-2 left-2 right-2 text-center text-[10px] font-bold text-white bg-black/60 backdrop-blur-md py-1 px-2 rounded-lg">
                  Watch Video Story
                </div>
              </div>

              {/* Quote & Details Column */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mb-3 text-amber-400">
                    {[...Array(test.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-sm text-brand-navy font-medium italic leading-relaxed mb-4">
                    "{test.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold font-display text-brand-navy leading-tight">
                        {test.clientName}
                      </h4>
                      <p className="text-xs text-brand-muted">
                        {test.role}, <strong className="text-slate-700">{test.company}</strong>
                      </p>
                    </div>

                    {test.result && (
                      <span className="px-2.5 py-1 text-xs font-extrabold bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200">
                        {test.result}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
