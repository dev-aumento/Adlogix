import React from 'react';
import { useParams } from 'react-router-dom';
import { SEOHead } from '../components/ui/SEOHead';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { PageLoader } from '../components/ui/PageLoader';
import { NotFoundPage } from './NotFoundPage';
import { api } from '../services/api';
import { useWordPressData } from '../hooks/useWordPressData';

/**
 * A plain WordPress page: the title and the body typed into the editor.
 *
 * Used for the legal pages, and as the catch-all for any page created in WordPress that has
 * no field group and no React route of its own. Publish a page in WordPress and it appears at
 * its slug with no code change.
 *
 * Pages that *do* have a field group (Home, About, Services, …) have their own routes, which
 * React Router matches ahead of the catch-all, so this never takes them over.
 *
 * `children` is the built-in copy for the legal pages: it renders while the request is in
 * flight, if WordPress is unreachable, or if the editor body is empty — so those pages are
 * never blank. Without children, a missing page shows the themed 404.
 */
export const DocumentPage = ({ slug: fixedSlug, seo, children }) => {
  const { slug: routeSlug } = useParams();
  const slug = fixedSlug || routeSlug;

  const { data: page, status } = useWordPressData(`page:${slug}`, () => api.getPage(slug));

  const hasFallback = Boolean(children);
  const body = page?.content?.trim() || '';
  const title = page?.title || seo?.heading || '';

  if (status === 'loading' && !hasFallback) {
    return <PageLoader />;
  }

  // A page that isn't in WordPress and has no built-in copy simply doesn't exist.
  if (!page && !hasFallback) {
    return <NotFoundPage />;
  }

  return (
    <>
      <SEOHead
        title={seo?.title || `${title} | Adlogix Agency`}
        description={seo?.description || page?.excerpt || ''}
        canonical={seo?.canonical || `https://adlogix.in/${slug}`}
      />

      <div className="bg-white py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: seo?.heading || title }]} />

          {(seo?.heading || title) && (
            <h1 className="editorial-heading text-3xl sm:text-4xl font-black text-brand-navy mt-6 mb-8">
              {seo?.heading || title}
            </h1>
          )}

          {body ? (
            // WordPress page bodies are written by signed-in editors and sanitized by
            // WordPress on save, the same trust boundary as the rest of the CMS content.
            <div dangerouslySetInnerHTML={{ __html: body }} className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6 text-slate-700" />
          ) : (
            children
          )}
        </div>
      </div>
    </>
  );
};
