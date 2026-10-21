import { text, fillToken } from './helpers';

/**
 * Industries page content, plus the labels that frame every single industry page
 * (`/industries/<slug>`). `industriesDefaults` renders only while WordPress is loading or when
 * the `industries` page has no ACF fields; `mapIndustriesFields` maps the ACF fields of that
 * page (see wordpress/acf/page-industries.json) into the same shape.
 *
 * Each industry's own content — including the recommended services, their descriptions and
 * their links — lives on its Industries entry, not here.
 */
export const industriesDefaults = {
  hero: {
    badge: 'Specialized Domain Expertise',
    headline: {
      line1: 'Tailored Strategies for',
      highlight1: 'High-Growth Industries.'
    },
    description:
      'No two industries share the same customer psychology or compliance requirements. We build bespoke acquisition funnels and custom digital architectures tailored to your sector.'
  },

  grid: {
    solutionsLabel: 'Key Solutions Provided:',
    linkLabel: 'Explore Sector'
  },

  cta: {
    title: "Don't See Your Specific Industry Listed?",
    text: 'We work with emerging categories, D2C challengers, and enterprise B2B brands across all digital verticals.',
    buttonLabel: 'Schedule an Industry Consultation'
  },

  detail: {
    breadcrumbLabel: 'Industries',
    badgeLabel: 'Sector Focus',
    headlineSuffix: 'Growth & Technology Solutions',
    heroCtaLabel: 'Request {industry} Growth Plan',
    heroSecondaryLabel: 'Book Industry Discovery Call',
    benchmarkLabel: 'Sector Benchmark',
    challengesTitle: 'Common {industry} Challenges',
    solutionsTitle: 'How Adlogix Solves This',
    servicesEyebrow: 'Specialized Stack',
    servicesTitle: 'Recommended Services for {industry}',
    servicesLinkLabel: 'Explore Capability',
    ctaTitle: 'Scale Your {industry} Brand',
    ctaText: "Get an actionable growth audit and custom proposal tailored to your sector's economics.",
    ctaButtonLabel: 'Get Started'
  }
};

/** Put the industry name into a label that uses the `{industry}` placeholder. */
export const fillIndustry = (template, name) => fillToken(template, 'industry', name);

export function mapIndustriesFields(f) {
  return {
    hero: {
      badge: text(f, 'hero_badge_text'),
      headline: {
        line1: text(f, 'hero_headline_line_1'),
        highlight1: text(f, 'hero_headline_highlight_1')
      },
      description: text(f, 'hero_description')
    },

    grid: {
      solutionsLabel: text(f, 'grid_solutions_label'),
      linkLabel: text(f, 'grid_link_label')
    },

    cta: {
      title: text(f, 'cta_title'),
      text: text(f, 'cta_text'),
      buttonLabel: text(f, 'cta_button_label')
    },

    detail: {
      breadcrumbLabel: text(f, 'detail_breadcrumb_label'),
      badgeLabel: text(f, 'detail_badge_label'),
      headlineSuffix: text(f, 'detail_headline_suffix'),
      heroCtaLabel: text(f, 'detail_hero_cta_label'),
      heroSecondaryLabel: text(f, 'detail_hero_secondary_label'),
      benchmarkLabel: text(f, 'detail_benchmark_label'),
      challengesTitle: text(f, 'detail_challenges_title'),
      solutionsTitle: text(f, 'detail_solutions_title'),
      servicesEyebrow: text(f, 'detail_services_eyebrow'),
      servicesTitle: text(f, 'detail_services_title'),
      servicesLinkLabel: text(f, 'detail_services_link_label'),
      ctaTitle: text(f, 'detail_cta_title'),
      ctaText: text(f, 'detail_cta_text'),
      ctaButtonLabel: text(f, 'detail_cta_button_label')
    }
  };
}
