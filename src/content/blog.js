import { text } from './helpers';

/**
 * Insights page content, plus the labels that frame every article (`/blog/<slug>`).
 * `blogDefaults` renders only while WordPress is loading or when the `blog` page has no ACF
 * fields; `mapBlogFields` maps the ACF fields of that page (see wordpress/acf/page-blog.json)
 * into the same shape, keeping blank values blank.
 *
 * The articles themselves are ordinary WordPress posts — see `src/services/blog.js`.
 */
export const blogDefaults = {
  hero: {
    badge: 'Adlogix Insights',
    headline: {
      line1: 'Ideas That Move',
      highlight1: 'Businesses Forward.'
    },
    description:
      'Practical frameworks, direct-response ad psychology, headless web engineering tutorials, and search dominance blueprints.'
  },

  articles: {
    allLabel: 'All',
    searchPlaceholder: 'Search articles & topics...',
    featuredBadge: 'Featured Guide',
    readLabel: 'Read Article',
    cardReadLabel: 'Read',
    emptyTitle: 'No articles found matching your search.'
  },

  detail: {
    breadcrumbLabel: 'Insights',
    topicsLabel: 'Topics:',
    relatedTitle: 'Related Reading',
    relatedLinkLabel: 'View All Insights →',
    relatedReadLabel: 'Read Article',
    ctaTitle: 'Want Us to Implement These Strategies for Your Brand?',
    ctaText: 'Book a free discovery session with our performance and tech strategists.',
    ctaButtonLabel: 'Schedule a Consultation'
  }
};

export function mapBlogFields(f) {
  return {
    hero: {
      badge: text(f, 'hero_badge_text'),
      headline: {
        line1: text(f, 'hero_headline_line_1'),
        highlight1: text(f, 'hero_headline_highlight_1')
      },
      description: text(f, 'hero_description')
    },

    articles: {
      allLabel: text(f, 'articles_all_label'),
      searchPlaceholder: text(f, 'articles_search_placeholder'),
      featuredBadge: text(f, 'articles_featured_badge'),
      readLabel: text(f, 'articles_read_label'),
      cardReadLabel: text(f, 'articles_card_read_label'),
      emptyTitle: text(f, 'articles_empty_title')
    },

    detail: {
      breadcrumbLabel: text(f, 'detail_breadcrumb_label'),
      topicsLabel: text(f, 'detail_topics_label'),
      relatedTitle: text(f, 'detail_related_title'),
      relatedLinkLabel: text(f, 'detail_related_link_label'),
      relatedReadLabel: text(f, 'detail_related_read_label'),
      ctaTitle: text(f, 'detail_cta_title'),
      ctaText: text(f, 'detail_cta_text'),
      ctaButtonLabel: text(f, 'detail_cta_button_label')
    }
  };
}
