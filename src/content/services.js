import { text, link } from './helpers';

/**
 * Services page content, plus the labels that frame every single service page
 * (`/services/<slug>`). `servicesDefaults` renders only while WordPress is loading or when
 * the `services` page has no ACF fields; `mapServicesFields` maps the ACF fields of that page
 * (see wordpress/acf/page-services.json) into the same shape, keeping blank values blank.
 *
 * There is deliberately no `plans` key: the Growth Plans section is shared with the Home page,
 * so `GrowthPlansSection` reads the Home content when no `content` prop reaches it.
 */
export const servicesDefaults = {
  hero: {
    badge: 'Full-Stack Capabilities',
    headline: {
      line1: 'Creative Meets Performance.',
      highlight1: 'Engineered for Scale.'
    },
    description:
      'Whether you need high-converting 9:16 vertical reels, multi-channel paid acquisition, bespoke Shopify storefronts, or enterprise headless React applications, we build solutions that deliver measurable ROI.'
  },

  catalog: {
    allLabel: 'All Capabilities',
    ctaLabel: 'Request Custom Scope',
    marketingLabel: 'Marketing & Creative',
    webLabel: 'Web, E-commerce & IT',
    marketingBadge: 'Marketing',
    webBadge: 'Technology',
    marketingTitle: 'Digital Marketing & Creative',
    webTitle: 'Web, E-commerce & IT Solutions',
    learnMoreLabel: 'Learn More'
  },

  cta: {
    title: 'Not Sure Which Growth Track Fits Your Stage?',
    text: 'Schedule a 30-minute discovery session with our senior growth architects to assess your acquisition channels and tech stack.',
    buttonLabel: 'Book a Free Strategy Session'
  },

  detail: {
    breadcrumbLabel: 'Services',
    heroCtaLabel: 'Request {service} Scope',
    heroSecondaryLabel: 'Book Strategy Call',
    deliverablesEyebrow: 'What We Deliver',
    deliverablesTitle: 'Structured Execution & Outcomes',
    deliverableNote:
      'Executed with rigorous QA testing, real-time reporting metrics, and alignment with your target customer acquisition cost.',
    techTitle: 'Tech Stack & Platforms',
    techNote:
      'Powered by modern architectures, first-party data security, and enterprise infrastructure support through Aumento Infoway.',
    techNoteHighlight: 'Aumento Infoway',
    consultTitle: 'Need a Custom Strategy for {service}?',
    consultText:
      'Speak directly with our senior creative and growth team to structure a high-performance rollout plan.',
    consultButtonLabel: 'Request Proposal',
    faqEyebrow: 'Clear Answers',
    faqTitle: 'Frequently Asked Questions',
    ctaTitle: 'Ready to Accelerate with {service}?',
    ctaPrimaryLabel: 'Get Started',
    ctaPrimaryLink: '/contact',
    ctaSecondaryLabel: 'View All Services',
    ctaSecondaryLink: '/services'
  }
};

/** Put the service name into a label that uses the `{service}` placeholder. */
export const fillService = (template, name) =>
  template ? template.replace(/\{service\}/g, name ?? '') : '';

export function mapServicesFields(f) {
  return {
    hero: {
      badge: text(f, 'hero_badge_text'),
      headline: {
        line1: text(f, 'hero_headline_line_1'),
        highlight1: text(f, 'hero_headline_highlight_1')
      },
      description: text(f, 'hero_description')
    },

    catalog: {
      allLabel: text(f, 'catalog_all_label'),
      ctaLabel: text(f, 'catalog_cta_label'),
      marketingLabel: text(f, 'catalog_marketing_label'),
      webLabel: text(f, 'catalog_web_label'),
      marketingBadge: text(f, 'catalog_marketing_badge'),
      webBadge: text(f, 'catalog_web_badge'),
      marketingTitle: text(f, 'catalog_marketing_title'),
      webTitle: text(f, 'catalog_web_title'),
      learnMoreLabel: text(f, 'catalog_learn_more_label')
    },

    cta: {
      title: text(f, 'cta_title'),
      text: text(f, 'cta_text'),
      buttonLabel: text(f, 'cta_button_label')
    },

    detail: {
      breadcrumbLabel: text(f, 'detail_breadcrumb_label'),
      heroCtaLabel: text(f, 'detail_hero_cta_label'),
      heroSecondaryLabel: text(f, 'detail_hero_secondary_label'),
      deliverablesEyebrow: text(f, 'detail_deliverables_eyebrow'),
      deliverablesTitle: text(f, 'detail_deliverables_title'),
      deliverableNote: text(f, 'detail_deliverable_note'),
      techTitle: text(f, 'detail_tech_title'),
      techNote: text(f, 'detail_tech_note'),
      techNoteHighlight: text(f, 'detail_tech_note_highlight'),
      consultTitle: text(f, 'detail_consult_title'),
      consultText: text(f, 'detail_consult_text'),
      consultButtonLabel: text(f, 'detail_consult_button_label'),
      faqEyebrow: text(f, 'detail_faq_eyebrow'),
      faqTitle: text(f, 'detail_faq_title'),
      ctaTitle: text(f, 'detail_cta_title'),
      ctaPrimaryLabel: text(f, 'detail_cta_primary_label'),
      ctaPrimaryLink: link(f, 'detail_cta_primary'),
      ctaSecondaryLabel: text(f, 'detail_cta_secondary_label'),
      ctaSecondaryLink: link(f, 'detail_cta_secondary')
    }
  };
}
