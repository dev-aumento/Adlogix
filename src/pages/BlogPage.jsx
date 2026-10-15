import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Search, ArrowUpRight } from 'lucide-react';
import { SEOHead } from '../components/ui/SEOHead';
import { PageSections } from '../components/sections/PageSections';
import { useCMS } from '../hooks/useCMS';
import { usePageContent } from '../hooks/usePageContent';
import { blogCategories } from '../data/blogsData';

const BlogHero = () => (
  <section className="py-20 lg:py-28 bg-brand-surface-soft/60 relative overflow-hidden border-b border-brand-border">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blue-light text-brand-blue text-xs font-bold border border-brand-blue/20 mb-6"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Adlogix Insights</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="editorial-heading text-4xl sm:text-5xl lg:text-6xl text-brand-navy font-black leading-[1.1]"
        >
          Ideas That Move{' '}
          <span className="gradient-text-blue block mt-1">
            Businesses Forward.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-brand-muted leading-relaxed"
        >
          Practical frameworks, direct-response ad psychology, headless web engineering tutorials, and search dominance blueprints.
        </motion.p>
      </div>
    </div>
  </section>
);

// Filter bar, featured post and grid share the active filters, so they move as one section.
const BlogArticles = () => {
  const { blogs } = useCMS();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBlogs = blogs.filter((b) => {
    const matchesCategory = activeCategory === "All" || b.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogs[0];

  return (
    <>
      {/* Filter and Search Bar */}
      <section className="py-8 border-b border-brand-border bg-white sticky top-20 z-30 shadow-xs backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">

          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-brand-surface-soft rounded-full border border-brand-border overflow-x-auto">
            {blogCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-brand-navy text-white shadow-sm"
                    : "text-brand-muted hover:text-brand-navy"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles & topics..."
              className="w-full pl-9 pr-4 py-2 rounded-full border border-brand-border bg-brand-surface-soft/60 text-xs font-medium text-brand-navy outline-none focus:border-brand-blue focus:bg-white transition-all"
            />
          </div>
        </div>
      </section>

      {/* Featured Post Banner */}
      {featuredPost && activeCategory === "All" && searchQuery === "" && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to={`/blog/${featuredPost.slug}`}
              className="group grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 rounded-3xl bg-brand-surface-soft border border-brand-border shadow-card-subtle hover:shadow-glossy transition-all"
            >
              <div className="lg:col-span-7 rounded-2xl overflow-hidden aspect-[16/10] bg-slate-900">
                <img
                  src={featuredPost.featuredImage}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div className="lg:col-span-5 flex flex-col justify-between py-2 space-y-4">
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-blue text-white shadow-xs">
                    Featured Guide
                  </span>

                  <h2 className="text-2xl sm:text-3xl font-bold font-display text-brand-navy group-hover:text-brand-blue transition-colors mt-4 leading-tight">
                    {featuredPost.title}
                  </h2>

                  <p className="mt-3 text-sm text-brand-muted leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={featuredPost.author?.avatar}
                      alt={featuredPost.author?.name}
                      className="w-8 h-8 rounded-full object-cover border"
                    />
                    <div className="text-xs font-semibold text-brand-navy">
                      {featuredPost.author?.name}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-brand-blue flex items-center gap-1">
                    <span>Read Article</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* All Blogs Grid */}
      <section className="py-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group flex flex-col rounded-3xl bg-white border border-brand-border shadow-card-subtle hover:shadow-glossy overflow-hidden transition-all duration-300"
              >
                <Link to={`/blog/${post.slug}`} className="relative aspect-[16/10] overflow-hidden bg-slate-900 block">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-brand-navy backdrop-blur-md shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </Link>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-brand-muted mb-2.5 font-medium">
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

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.author?.avatar}
                        alt={post.author?.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-xs font-semibold text-slate-700">
                        {post.author?.name}
                      </span>
                    </div>

                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-xs font-bold text-brand-blue flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform"
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
    </>
  );
};

// Keys must match the "blog" entry in the plugin's section registry.
const blogSections = {
  hero: BlogHero,
  articles: BlogArticles
};

export const BlogPage = () => {
  const { content, order } = usePageContent('blog');

  return (
    <>
      <SEOHead
        title="Insights & Guides | Digital Growth, SEO & Tech | Adlogix"
        description="Actionable digital marketing strategies, 9:16 creative video frameworks, headless React guides, and technical SEO tactics from the Adlogix team."
        canonical="https://adlogix.agency/blog"
      />

      <div className="bg-white">
        <PageSections sections={blogSections} order={order} content={content} />
      </div>
    </>
  );
};
