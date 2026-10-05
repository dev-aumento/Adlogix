import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Calendar, Share2, Check, ArrowLeft, ArrowRight, BookOpen, Twitter, Linkedin, Link as LinkIcon, Sparkles } from 'lucide-react';
import { SEOHead } from '../components/ui/SEOHead';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Button } from '../components/ui/Button';
import { useCMS } from '../hooks/useCMS';

export const BlogPostPage = () => {
  const { slug } = useParams();
  const { blogs, openDiscoveryModal } = useCMS();
  const [copied, setCopied] = useState(false);

  const post = blogs.find((b) => b.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const relatedPosts = blogs.filter((b) => b.slug !== slug).slice(0, 2);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <SEOHead
        title={`${post.title} | Adlogix Insights`}
        description={post.excerpt}
        canonical={`https://adlogix.agency/blog/${post.slug}`}
        ogImage={post.featuredImage}
        type="article"
        schema={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.excerpt,
          "image": post.featuredImage,
          "author": {
            "@type": "Person",
            "name": post.author?.name
          },
          "publisher": {
            "@type": "Organization",
            "name": "Adlogix",
            "logo": "https://adlogix.agency/favicon.svg"
          },
          "datePublished": post.publishedDate
        }}
      />

      <div className="bg-white">
        {/* Header Breadcrumb & Article Title */}
        <section className="py-12 sm:py-16 bg-brand-surface-soft/60 border-b border-brand-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb
              items={[
                { label: "Insights", href: "/blog" },
                { label: post.category }
              ]}
            />

            <div className="mt-6 space-y-4">
              <span className="px-3.5 py-1.5 rounded-full bg-brand-blue text-white text-xs font-bold">
                {post.category}
              </span>

              <h1 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-black text-brand-navy leading-tight">
                {post.title}
              </h1>

              {/* Author & Metadata */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-brand-border/60">
                <div className="flex items-center gap-3">
                  <img
                    src={post.author?.avatar}
                    alt={post.author?.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-brand-blue"
                  />
                  <div>
                    <div className="text-sm font-bold text-brand-navy font-display">
                      {post.author?.name}
                    </div>
                    <div className="text-xs text-brand-muted">
                      {post.author?.role}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-brand-muted">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-brand-blue" />
                    {post.readTime}
                  </span>
                  <span>•</span>
                  <span>{post.publishedDate}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-brand-border aspect-[16/9] bg-slate-900">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Main Content Area */}
        <article className="py-14 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Share Sidebar (Left) */}
            <div className="lg:col-span-2 hidden lg:flex flex-col items-center space-y-3 sticky top-32 h-fit">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Share
              </span>
              <button
                onClick={handleCopyLink}
                className="w-10 h-10 rounded-full bg-brand-surface-soft border border-brand-border flex items-center justify-center text-slate-600 hover:text-brand-blue hover:border-brand-blue transition-all"
                title="Copy Link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <LinkIcon className="w-4 h-4" />}
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-brand-surface-soft border border-brand-border flex items-center justify-center text-slate-600 hover:text-brand-blue hover:border-brand-blue transition-all"
                title="Share on Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-brand-surface-soft border border-brand-border flex items-center justify-center text-slate-600 hover:text-brand-blue hover:border-brand-blue transition-all"
                title="Share on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>

            {/* Article Prose Content */}
            <div className="lg:col-span-10 space-y-6 text-brand-dark">
              
              {/* Excerpt Lead */}
              <p className="text-lg sm:text-xl font-medium text-brand-navy leading-relaxed border-l-4 border-brand-blue pl-4 py-1 italic bg-brand-surface-soft/60 rounded-r-xl">
                {post.excerpt}
              </p>

              {/* Render rich HTML content */}
              <div
                className="prose prose-lg max-w-none text-slate-700 space-y-6 leading-relaxed
                  prose-headings:font-display prose-headings:font-bold prose-headings:text-brand-navy
                  prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                  prose-p:leading-relaxed prose-p:text-slate-700
                  prose-li:text-slate-700
                  prose-blockquote:border-l-4 prose-blockquote:border-brand-blue prose-blockquote:bg-brand-surface-soft prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:italic
                  prose-strong:text-brand-navy"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Article Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="pt-8 mt-8 border-t border-slate-200 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">
                    Topics:
                  </span>
                  {post.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs rounded-full bg-brand-surface-soft text-slate-700 font-semibold border border-brand-border"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

          </div>
        </article>

        {/* Related Insights */}
        <section className="py-16 bg-brand-surface-soft/60 border-t border-brand-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold font-display text-brand-navy">
                Related Reading
              </h3>
              <Link to="/blog" className="text-xs font-bold text-brand-blue hover:underline">
                View All Insights →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relPost) => (
                <Link
                  key={relPost.id}
                  to={`/blog/${relPost.slug}`}
                  className="p-6 rounded-3xl bg-white border border-brand-border shadow-card-subtle hover:shadow-glossy transition-all group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue">
                      {relPost.category}
                    </span>
                    <h4 className="text-lg font-bold font-display text-brand-navy group-hover:text-brand-blue transition-colors mt-1.5 mb-2 leading-snug">
                      {relPost.title}
                    </h4>
                    <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
                      {relPost.excerpt}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>{relPost.readTime}</span>
                    <span className="font-bold text-brand-blue flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read Article <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 bg-white border-t border-brand-border text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-brand-navy">
              Want Us to Implement These Strategies for Your Brand?
            </h2>
            <p className="text-sm text-brand-muted">
              Book a free discovery session with our performance and tech strategists.
            </p>
            <Button onClick={openDiscoveryModal} variant="primary" size="lg" icon={ArrowRight}>
              Schedule a Consultation
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};
