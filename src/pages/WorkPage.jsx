import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Play, Sparkles, FolderKanban, Search } from 'lucide-react';
import { SEOHead } from '../components/ui/SEOHead';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
import { useCMS } from '../hooks/useCMS';
import { projectCategories } from '../data/projectsData';

export const WorkPage = () => {
  const { projects, openVideoModal, openDiscoveryModal } = useCMS();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects.filter((p) => {
    const matchesCategory =
      activeCategory === "All" ||
      p.category === activeCategory ||
      p.categoryLabel.includes(activeCategory);
    const matchesSearch =
      searchQuery.trim() === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.industry.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <SEOHead
        title="Our Work & Case Studies | Measurable Impact | Adlogix"
        description="Explore our portfolio of creative advertising, viral short-form reels, performance marketing funnels, Shopify stores, and modern React web applications."
        canonical="https://adlogix.agency/work"
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
                <FolderKanban className="w-3.5 h-3.5" />
                <span>Featured Portfolio</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="editorial-heading text-4xl sm:text-5xl lg:text-6xl text-brand-navy font-black leading-[1.1]"
              >
                Big Ideas. Bold Execution.{' '}
                <span className="gradient-text-blue block mt-1">
                  Meaningful Results.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 text-base sm:text-lg text-brand-muted leading-relaxed"
              >
                We partner with ambitious brands to create digital campaigns, high-converting storefronts, and viral short-form assets that move real business metrics.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Filter and Search Bar */}
        <section className="py-8 border-b border-brand-border bg-white sticky top-20 z-30 shadow-xs backdrop-blur-md bg-white/95">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Category Pills */}
            <div className="inline-flex items-center gap-1.5 p-1.5 bg-brand-surface-soft rounded-full border border-brand-border flex-nowrap overflow-x-auto no-scrollbar max-w-full">
              {projectCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 select-none ${
                    activeCategory === cat
                      ? "bg-brand-navy text-white shadow-sm"
                      : "text-brand-muted hover:text-brand-navy"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search clients, industries..."
                className="w-full pl-9 pr-4 py-2 rounded-full border border-brand-border bg-brand-surface-soft/60 text-xs font-medium text-brand-navy outline-none focus:border-brand-blue focus:bg-white transition-all"
              />
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory + searchQuery}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-10"
              >
                {filteredProjects.map((project, idx) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="flex flex-col rounded-3xl bg-white border border-brand-border shadow-card-subtle hover:shadow-glossy-hover overflow-hidden transition-all duration-300 group"
                  >
                    {/* Hero Visual Media */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                      <img
                        src={project.heroImage}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md border border-white/20">
                          {project.categoryLabel}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/50 text-white backdrop-blur-md">
                          {project.industry}
                        </span>
                      </div>

                      {project.videoReelUrl && (
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
                          className="absolute bottom-4 right-4 z-10 p-3 rounded-full bg-brand-blue/90 hover:bg-brand-blue text-white backdrop-blur-md shadow-lg shadow-brand-blue/40 border border-white/20 flex items-center gap-1.5 text-xs font-bold transition-all"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Watch Reel</span>
                        </button>
                      )}
                    </div>

                    {/* Content */}
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

                        {/* Verified Metrics */}
                        {project.results && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 p-4 rounded-2xl bg-brand-surface-soft border border-brand-border/60">
                            {project.results.map((res, rIdx) => (
                              <div key={rIdx}>
                                <div className="text-lg font-extrabold font-display text-brand-navy">
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
                          <span>Case Study</span>
                          <ArrowUpRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredProjects.length === 0 && (
              <div className="py-20 text-center space-y-3">
                <p className="text-lg font-bold text-brand-navy">No projects found matching your search.</p>
                <button
                  onClick={() => {
                    setActiveCategory("All");
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 rounded-full bg-brand-blue text-white text-xs font-bold"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 bg-brand-surface-soft/60 border-t border-brand-border text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="text-3xl font-black font-display text-brand-navy">
              Want Similar Impact for Your Brand?
            </h2>
            <p className="text-sm text-brand-muted">
              We engineer custom campaigns and web experiences aligned with your specific commercial objectives.
            </p>
            <Button to="/contact" variant="primary" size="lg">
              Start Your Project Discussion
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};
