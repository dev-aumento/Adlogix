import { text } from './helpers';

/**
 * Testimonials page content. `testimonialsDefaults` renders only while WordPress is loading or
 * when the `testimonials` page has no ACF fields; `mapTestimonialsFields` maps the ACF fields
 * of that page (see wordpress/acf/page-testimonials.json) into the same shape.
 *
 * The testimonials themselves — quote, client, role, company, rating, result badge, video —
 * live on their Testimonials entries, not here.
 */
export const testimonialsDefaults = {
  hero: {
    badge: 'Verified Client Stories',
    headline: {
      line1: "Don't Just Take Our Word.",
      highlight1: 'Hear It From Our Partners.'
    },
    description:
      'Authentic, transparent reviews from growth leaders who rely on Adlogix for high-converting creatives, multi-channel performance advertising, and modern web applications.'
  },

  grid: {
    videoLabel: 'Watch Video'
  },

  cta: {
    title: 'Become Our Next Success Story',
    text: 'Book a strategy consultation to explore how Adlogix can scale your revenue.',
    buttonLabel: 'Schedule a Discovery Call'
  }
};

export function mapTestimonialsFields(f) {
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
      videoLabel: text(f, 'grid_video_label')
    },

    cta: {
      title: text(f, 'cta_title'),
      text: text(f, 'cta_text'),
      buttonLabel: text(f, 'cta_button_label')
    }
  };
}
