import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Play, TrendingUp, Sparkles, FolderKanban } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { useCMS } from '../../hooks/useCMS';
import { projectCategories } from '../../data/projectsData';

export const FeaturedProjects = ({ content }) => {
  const { projects, openVideoModal } = useCMS();
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter(p => p.category === activeCategory || p.categoryLabel.includes(activeCategory));

  return (
    <section className="py-20 lg:py-28 bg-brand-surface-soft/40 relative overflow-hidden border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Category Filters */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <SectionHeading
            badge={content.heading.badge}
            badgeIcon={FolderKanban}
            title={content.heading.title}
            highlightWord={content.heading.highlight}
            subtitle={content.heading.subtitle}
            align="left"
            className="max-w-2xl"
          />

          {/* Filter Pills */}
          <div className="inline-flex items-center gap-1.5 p-1.5 bg-white rounded-full border border-brand-border shadow-card-subtle flex-nowrap overflow-x-auto no-scrollbar max-w-full shrink-0">
            {projectCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all select-none ${
                  activeCategory === cat
                    ? 'bg-brand-navy text-white shadow-sm'
                    : 'text-brand-muted hover:text-brand-navy hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Editorial Layout */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group flex flex-col rounded-3xl bg-white border border-brand-border shadow-card-subtle hover:shadow-glossy-hover overflow-hidden transition-all duration-300"
              >
                {/* Visual Media Header */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <img
                    src={project.heroImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md border border-white/20">
                      {project.categoryLabel}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/50 text-white backdrop-blur-md">
                      {project.industry}
                    </span>
                  </div>

                  {/* Video Play Button if video available */}
                  {project.videoReelUrl && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openVideoModal({
                          title: project.title,
                          client: project.client,
                          videoUrl: project.videoReelUrl,
                          thumbnail: project.heroImage,
                          description: project.overview,
                          category: project.categoryLabel,
                          aspectRatio: '9:16',
                          projectSlug: project.slug
                        });
                      }}
                      className="absolute bottom-4 right-4 z-10 p-3 rounded-full bg-brand-blue/90 hover:bg-brand-blue text-white backdrop-blur-md shadow-lg shadow-brand-blue/40 border border-white/20 flex items-center gap-1.5 text-xs font-bold transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch Creative Reel</span>
                    </button>
                  )}
                </div>

                {/* Content Body */}
                <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-1.5">
                      {project.client}
                    </div>

                    <Link to={`/work/${project.slug}`}>
                      <h3 className="text-xl sm:text-2xl font-bold font-display text-brand-navy group-hover:text-brand-blue transition-colors leading-snug">
                        {project.title}
                      </h3>
                    </Link>

                    <p className="mt-3 text-sm text-brand-muted leading-relaxed line-clamp-2">
                      {project.overview}
                    </p>

                    {/* Results / Key Metrics Grid */}
                    {project.results && project.results.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 p-4 rounded-2xl bg-brand-surface-soft border border-brand-border/60">
                        {project.results.map((res, rIdx) => (
                          <div key={rIdx}>
                            <div className="text-lg sm:text-xl font-extrabold font-display text-brand-navy">
                              {res.value}
                            </div>
                            <div className="text-[10px] text-brand-muted font-medium mt-0.5">
                              {res.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom: Services and Link */}
                  <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5 shrink min-w-0">
                      {project.servicesDelivered?.slice(0, 2).map((srv, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 text-slate-600 font-medium whitespace-nowrap"
                        >
                          {srv}
                        </span>
                      ))}
                    </div>

                    <Link
                      to={`/work/${project.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-blue hover:text-brand-blue-hover transition-colors whitespace-nowrap shrink-0 ml-auto group/link"
                    >
                      <span>Read Case Study</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View All Projects CTA */}
        {content.ctaLabel && (
          <div className="mt-12 text-center">
            <Link
              to="/work"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-brand-navy hover:bg-brand-navy-dark text-white font-bold text-sm transition-all shadow-lg shadow-brand-navy/20"
            >
              {content.ctaLabel}
            </Link>
          </div>
        )}

      </div>
    </section>
  );
};
