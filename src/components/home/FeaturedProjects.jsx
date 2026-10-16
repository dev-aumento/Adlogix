import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderKanban } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { ProjectCard } from '../ui/ProjectCard';
import { SmartLink } from '../ui/SmartLink';
import { useCollection } from '../../hooks/useCMS';
import { projectCategories } from '../../data/projectsData';
import { presentCategories } from '../../services/collections';

export const FeaturedProjects = ({ content }) => {
  const projects = useCollection('projects', 'home');
  const hasCta = Boolean(content.ctaLabel && content.ctaLink);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = presentCategories(projects, projectCategories.slice(1));
  const activeCategory = categories.includes(selectedCategory) ? selectedCategory : "All";
  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter(p => p.category === activeCategory || p.categoryLabel.includes(activeCategory));

  if (projects.length === 0) return null;

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
          {categories.length > 1 && (
            <div className="inline-flex items-center gap-1.5 p-1.5 bg-white rounded-full border border-brand-border shadow-card-subtle flex-nowrap overflow-x-auto no-scrollbar max-w-full shrink-0">
              {["All", ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
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
          )}
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
                <ProjectCard
                  project={project}
                  videoLabel="Watch Creative Reel"
                  linkLabel="Read Case Study"
                  metricValueClassName="text-lg sm:text-xl"
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View All Projects CTA */}
        {hasCta && (
          <div className="mt-12 text-center">
            <SmartLink
              href={content.ctaLink}
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-brand-navy hover:bg-brand-navy-dark text-white font-bold text-sm transition-all shadow-lg shadow-brand-navy/20"
            >
              {content.ctaLabel}
            </SmartLink>
          </div>
        )}

      </div>
    </section>
  );
};
