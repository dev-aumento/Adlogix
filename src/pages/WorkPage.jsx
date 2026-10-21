import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FolderKanban, Search } from 'lucide-react';
import { SEOHead } from '../components/ui/SEOHead';
import { Button } from '../components/ui/Button';
import { toRouterPath } from '../components/ui/SmartLink';
import { ProjectCard } from '../components/ui/ProjectCard';
import { PageSections } from '../components/sections/PageSections';
import { useCollection } from '../hooks/useCMS';
import { usePageContent } from '../hooks/usePageContent';
import { projectCategories } from '../data/projectsData';
import { presentCategories } from '../services/collections';
import { workDefaults } from '../content/work';

const WorkHero = ({ content = workDefaults.hero }) => {
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
              <FolderKanban className="w-3.5 h-3.5" />
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

// Filter bar and grid share the active filters, so they move as one section.
const WorkPortfolio = ({ content = workDefaults.portfolio }) => {
  const projects = useCollection('projects', 'work');
  const [selectedCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = presentCategories(projects, projectCategories.slice(1));
  const activeCategory = categories.includes(selectedCategory) ? selectedCategory : "All";
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

  if (projects.length === 0) return null;

  return (
    <>
      {/* Filter and Search Bar */}
      <section className="py-8 border-b border-brand-border bg-white sticky top-20 z-30 shadow-xs backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">

          {/* Category Pills */}
          {categories.length > 1 && content.allLabel && (
            <div className="inline-flex items-center gap-1.5 p-1.5 bg-brand-surface-soft rounded-full border border-brand-border flex-nowrap overflow-x-auto no-scrollbar max-w-full">
              {[content.allLabel, ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat === content.allLabel ? "All" : cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 select-none ${
                    (cat === content.allLabel ? "All" : cat) === activeCategory
                      ? "bg-brand-navy text-white shadow-sm"
                      : "text-brand-muted hover:text-brand-navy"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Search Input */}
          {content.searchPlaceholder && (
            <div className="relative max-w-xs w-full md:ml-auto">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={content.searchPlaceholder}
                className="w-full pl-9 pr-4 py-2 rounded-full border border-brand-border bg-brand-surface-soft/60 text-xs font-medium text-brand-navy outline-none focus:border-brand-blue focus:bg-white transition-all"
              />
            </div>
          )}
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
                  <ProjectCard
                    project={project}
                    videoLabel={content.videoLabel}
                    linkLabel={content.linkLabel}
                    metricValueClassName="text-lg"
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredProjects.length === 0 && (content.emptyTitle || content.emptyButton) && (
            <div className="py-20 text-center space-y-3">
              {content.emptyTitle && (
                <p className="text-lg font-bold text-brand-navy">{content.emptyTitle}</p>
              )}
              {content.emptyButton && (
                <button
                  onClick={() => {
                    setActiveCategory("All");
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 rounded-full bg-brand-blue text-white text-xs font-bold"
                >
                  {content.emptyButton}
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

const WorkCta = ({ content = workDefaults.cta }) => {
  const { title, text, buttonLabel, buttonLink } = content;
  const hasButton = Boolean(buttonLabel && buttonLink);
  // Site paths go through the router; another website opens in a new tab.
  const buttonPath = toRouterPath(buttonLink);

  if (!title && !text && !hasButton) return null;

  return (
    <section className="py-16 bg-brand-surface-soft/60 border-t border-brand-border text-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {title && (
          <h2 className="text-3xl font-black font-display text-brand-navy">
            {title}
          </h2>
        )}
        {text && <p className="text-sm text-brand-muted">{text}</p>}
        {hasButton && (
          <Button
            {...(buttonPath ? { to: buttonPath } : { href: buttonLink })}
            variant="primary"
            size="lg"
          >
            {buttonLabel}
          </Button>
        )}
      </div>
    </section>
  );
};

// Keys must match the "work" entry in the plugin's section registry.
const workSections = {
  hero: WorkHero,
  portfolio: WorkPortfolio,
  cta: WorkCta
};

export const WorkPage = () => {
  const { content, order } = usePageContent('work');

  return (
    <>
      <SEOHead
        title="Our Work & Case Studies | Measurable Impact | Adlogix"
        description="Explore our portfolio of creative advertising, viral short-form reels, performance marketing funnels, Shopify stores, and modern React web applications."
        canonical="https://adlogix.in/work"
      />

      <div className="bg-white">
        <PageSections sections={workSections} order={order} content={content} />
      </div>
    </>
  );
};
