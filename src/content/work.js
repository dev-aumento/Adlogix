import { text, link } from './helpers';

/**
 * Work page content, plus the labels that frame every single case study (`/work/<slug>`).
 * `workDefaults` renders only while WordPress is loading or when the `work` page has no ACF
 * fields; `mapWorkFields` maps the ACF fields of that page (see wordpress/acf/page-work.json)
 * into the same shape, keeping blank values blank.
 *
 * Each case study's own content — including the heading above its Challenge, Strategy and
 * Execution paragraphs — lives on its Projects entry, not here.
 */
export const workDefaults = {
  hero: {
    badge: 'Featured Portfolio',
    headline: {
      line1: 'Big Ideas. Bold Execution.',
      highlight1: 'Meaningful Results.'
    },
    description:
      'We partner with ambitious brands to create digital campaigns, high-converting storefronts, and viral short-form assets that move real business metrics.'
  },

  portfolio: {
    allLabel: 'All',
    searchPlaceholder: 'Search clients, industries...',
    videoLabel: 'Watch Reel',
    linkLabel: 'Case Study',
    emptyTitle: 'No projects found matching your search.',
    emptyButton: 'Reset Filters'
  },

  cta: {
    title: 'Want Similar Impact for Your Brand?',
    text: 'We engineer custom campaigns and web experiences aligned with your specific commercial objectives.',
    buttonLabel: 'Start Your Project Discussion',
    buttonLink: '/contact'
  },

  detail: {
    breadcrumbLabel: 'Our Work',
    videoButtonLabel: 'Play Creative Reel & Commercial',
    resultsLabel: 'Verified Performance Impact',
    challengeEyebrow: 'The Challenge',
    strategyEyebrow: 'Our Strategy',
    executionEyebrow: 'Execution & Rollout',
    servicesLabel: 'Services Delivered',
    clientLabel: 'Client',
    sidebarCtaLabel: 'Discuss Similar Project',
    ctaTitle: 'Ready to Craft Your Next Growth Chapter?',
    ctaPrimaryLabel: 'Start Your Project',
    ctaPrimaryLink: '/contact',
    ctaSecondaryLabel: 'View All Case Studies',
    ctaSecondaryLink: '/work'
  }
};

export function mapWorkFields(f) {
  return {
    hero: {
      badge: text(f, 'hero_badge_text'),
      headline: {
        line1: text(f, 'hero_headline_line_1'),
        highlight1: text(f, 'hero_headline_highlight_1')
      },
      description: text(f, 'hero_description')
    },

    portfolio: {
      allLabel: text(f, 'portfolio_all_label'),
      searchPlaceholder: text(f, 'portfolio_search_placeholder'),
      videoLabel: text(f, 'portfolio_video_label'),
      linkLabel: text(f, 'portfolio_link_label'),
      emptyTitle: text(f, 'portfolio_empty_title'),
      emptyButton: text(f, 'portfolio_empty_button')
    },

    cta: {
      title: text(f, 'cta_title'),
      text: text(f, 'cta_text'),
      buttonLabel: text(f, 'cta_button_label'),
      buttonLink: link(f, 'cta_button')
    },

    detail: {
      breadcrumbLabel: text(f, 'detail_breadcrumb_label'),
      videoButtonLabel: text(f, 'detail_video_button_label'),
      resultsLabel: text(f, 'detail_results_label'),
      challengeEyebrow: text(f, 'detail_challenge_eyebrow'),
      strategyEyebrow: text(f, 'detail_strategy_eyebrow'),
      executionEyebrow: text(f, 'detail_execution_eyebrow'),
      servicesLabel: text(f, 'detail_services_label'),
      clientLabel: text(f, 'detail_client_label'),
      sidebarCtaLabel: text(f, 'detail_sidebar_cta_label'),
      ctaTitle: text(f, 'detail_cta_title'),
      ctaPrimaryLabel: text(f, 'detail_cta_primary_label'),
      ctaPrimaryLink: link(f, 'detail_cta_primary'),
      ctaSecondaryLabel: text(f, 'detail_cta_secondary_label'),
      ctaSecondaryLink: link(f, 'detail_cta_secondary')
    }
  };
}
