import { toPlainText } from '../services/normalizers';
import { text, groupList, link } from './helpers';
import { plansDefaults, mapPlansFields } from './plans';

/**
 * Reels page content. `reelsDefaults` renders only while WordPress is loading or when the
 * `reels` page has no ACF fields; `mapReelsFields` maps the ACF fields of that page (see
 * wordpress/acf/page-reels.json) into the same shape, keeping blank values blank.
 *
 * There is deliberately no `studio` key: the Studio Showcase gallery is shared with the Home
 * page, so `StudioSection` reads the Home content when no `content` prop reaches it. Pricing,
 * by contrast, is page-wise — see `plans`.
 */
export const reelsDefaults = {
  hero: {
    badge: 'Adlogix Creative Studio',
    headline: {
      line1: 'Made to Stop the Scroll.',
      highlight1: 'Engineered to Convert.'
    },
    description:
      'In a feed-driven economy, 9:16 video is the single highest-leverage conversion asset. We script, direct, shoot, and edit commercial-grade vertical videos that hook attention within the first 3 seconds.'
  },

  production: {
    items: [
      { value: '4K Cinema', label: 'Sony FX6 & Cinema Prime Lenses' },
      { value: 'Macro Studio', label: 'Texture, Liquid & Product Rigs' },
      { value: '3-Sec Hooks', label: 'Psychology-Backed Angle Testing' },
      { value: '12M+ Views', label: 'Delivered for Client Brands' }
    ]
  },

  gallery: {
    allLabel: 'All',
    ctaLabel: 'Book a Video Shoot',
    viewsSuffix: 'Views',
    ctrSuffix: 'CTR'
  },

  plans: plansDefaults,

  cta: {
    title: 'Have Products That Need Studio Shoots?',
    text: 'Ship your physical products directly to our specialized studio in Ahmedabad for lighting, macro pours, and full 9:16 social reel batching.',
    buttonLabel: 'Request a Production Quote',
    buttonLink: '/contact?service=Video Reels Production'
  }
};

export function mapReelsFields(f) {
  return {
    hero: {
      badge: text(f, 'hero_badge_text'),
      headline: {
        line1: text(f, 'hero_headline_line_1'),
        highlight1: text(f, 'hero_headline_highlight_1')
      },
      description: text(f, 'hero_description')
    },

    production: {
      items: groupList(f, 'production_item', 4, (g) => {
        const value = toPlainText(g.value);
        return value ? { value, label: toPlainText(g.label) } : null;
      })
    },

    gallery: {
      allLabel: text(f, 'gallery_all_label'),
      ctaLabel: text(f, 'gallery_cta_label'),
      viewsSuffix: text(f, 'gallery_views_suffix'),
      ctrSuffix: text(f, 'gallery_ctr_suffix')
    },

    plans: mapPlansFields(f),

    cta: {
      title: text(f, 'cta_title'),
      text: text(f, 'cta_text'),
      buttonLabel: text(f, 'cta_button_label'),
      buttonLink: link(f, 'cta_button')
    }
  };
}
