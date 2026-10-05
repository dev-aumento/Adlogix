import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, Calendar, ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { useCMS } from '../../hooks/useCMS';

export const InsightsSection = () => {
  const { blogs } = useCMS();

  return (
    <section className="py-20 lg:py-28 bg-brand-surface-soft/40 relative overflow-hidden border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & View All Button */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <SectionHeading
            badge="Growth Knowledge"
            badgeIcon={BookOpen}
            title="Ideas That Move Businesses Forward."
            highlightWord="Move Businesses Forward"
            subtitle="Deep-dive frameworks, technical SEO teardowns, short-form video strategies, and modern headless engineering guides."
            align="left"
            className="max-w-2xl"
          />

          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-blue hover:text-brand-blue-hover transition-colors group"
          >
            <span>Explore All Insights</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.slice(0, 3).map((post, idx) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group flex flex-col rounded-3xl bg-white border border-brand-border shadow-card-subtle hover:shadow-glossy hover:border-brand-blue/30 overflow-hidden transition-all duration-300"
            >
              {/* Featured Image */}
              <Link to={`/blog/${post.slug}`} className="relative aspect-[16/10] overflow-hidden bg-slate-900 block">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-brand-navy backdrop-blur-md shadow-sm">
                    {post.category}
                  </span>
                </div>
              </Link>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-brand-muted mb-3 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-blue" />
                      {post.readTime}
                    </span>
                    <span>•</span>
                    <span>{post.publishedDate}</span>
                  </div>

                  <Link to={`/blog/${post.slug}`}>
                    <h3 className="text-lg font-bold font-display text-brand-navy group-hover:text-brand-blue transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="mt-2.5 text-xs sm:text-sm text-brand-muted leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>

                {/* Author & Read More */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={post.author?.avatar}
                      alt={post.author?.name}
                      className="w-7 h-7 rounded-full object-cover border border-brand-border"
                    />
                    <span className="text-xs font-semibold text-brand-navy">
                      {post.author?.name}
                    </span>
                  </div>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-xs font-bold text-brand-blue group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5"
                  >
                    <span>Read</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
};
