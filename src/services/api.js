import { defaultSiteSettings } from '../data/siteSettings';
import { servicesData } from '../data/servicesData';
import { projectsData } from '../data/projectsData';
import { clientReelsData } from '../data/reelsData';
import { testimonialsData } from '../data/testimonialsData';
import { industriesData } from '../data/industriesData';
import { blogsData } from '../data/blogsData';
import { teamData } from '../data/teamData';
import { wpGet, wpPost, WordPressApiError, reportWordPressIssue } from './client';
import { normalizePage } from './normalizers';
import { normalizeBlogPost } from './blog';
import {
  normalizeReel,
  normalizeProject,
  normalizeService,
  normalizeTestimonial,
  normalizeIndustry
} from './collections';
import {
  defaultHeader,
  defaultFooter,
  defaultFooterMenus,
  defaultPopup,
  normalizeHeader,
  normalizeFooter,
  normalizePopup,
  mapPrimaryNavigation,
  mapFooterLinks
} from '../content/layout';

// Legacy switch for blog posts, team, settings and the enquiry form. Pages and the
// migrated collections (services, projects, reels, testimonials, industries) ignore it.
const ENABLE_WP_SYNC = import.meta.env.VITE_ENABLE_WP_SYNC === 'true';

/**
 * Published entries of a custom post type, sorted by their Order (menu_order).
 * The static list is used only when WordPress has no entries or can't be reached;
 * otherwise WordPress is the only source, and incomplete entries are dropped.
 */
async function getCollection(postType, normalize, fallback) {
  try {
    const raw = await wpGet(`/wp/v2/${postType}`, {
      params: { per_page: 100, _fields: 'id,slug,title,menu_order,acf', acf_format: 'standard' }
    });
    if (!Array.isArray(raw)) {
      throw new WordPressApiError(`Unexpected response for ${postType}`, { code: 'invalid_response' });
    }
    if (raw.length === 0) return fallback;
    return [...raw]
      .sort((a, b) => (a.menu_order || 0) - (b.menu_order || 0))
      .map(normalize)
      .filter(Boolean);
  } catch (error) {
    reportWordPressIssue(`Loading ${postType}`, error);
    return fallback;
  }
}

// Helper to fetch from WP REST API with timeout & fallback
async function fetchWP(endpoint, fallbackData) {
  if (!ENABLE_WP_SYNC) {
    return fallbackData;
  }

  try {
    const data = await wpGet(endpoint, { timeout: 4000 });
    return Array.isArray(data) && data.length > 0 ? data : fallbackData;
  } catch (error) {
    console.warn(`[WordPress CMS] Failed to fetch ${endpoint}: ${error.message}. Using fallback.`);
    return fallbackData;
  }
}

/**
 * Send one lead to WordPress. Returns `{ success, message }` on success; throws on failure so
 * the form can tell the visitor to try again rather than losing what they typed.
 */
async function postLead(endpoint, formData) {
  const response = await wpPost(endpoint, formData);
  return {
    success: true,
    message: response?.message
      || 'Thank you for reaching out. Our team will be in touch within 24 hours.'
  };
}

export const api = {
  // A WordPress page with its ACF fields and section order. Resolves to null when the page doesn't exist.
  async getPage(slug) {
    const pages = await wpGet('/wp/v2/pages', {
      params: {
        slug,
        // `content` and `excerpt` feed the plain document pages (legal pages, new pages).
        _fields: 'id,slug,title,excerpt,content,modified,acf,adlogix_sections',
        acf_format: 'standard'
      }
    });
    if (!Array.isArray(pages)) {
      throw new WordPressApiError(`Unexpected response for page "${slug}"`, { code: 'invalid_response' });
    }
    return pages.length > 0 ? normalizePage(pages[0]) : null;
  },

  // Global Settings
  async getSettings() {
    return fetchWP('/adlogix/v1/settings', defaultSiteSettings);
  },

  /**
   * Shared header, footer and nav menus from `/adlogix/v1/layout`.
   * Always tries WordPress (not gated by VITE_ENABLE_WP_SYNC).
   */
  async getLayout() {
    try {
      const data = await wpGet('/adlogix/v1/layout');
      const menuMap = data?.menus && typeof data.menus === 'object' ? data.menus : {};

      const footerMenus = {
        marketing: mapFooterLinks(menuMap.footer_marketing),
        web: mapFooterLinks(menuMap.footer_web),
        company: mapFooterLinks(menuMap.footer_company),
        legal: mapFooterLinks(menuMap.footer_legal),
      };

      return {
        header: normalizeHeader(data?.header) || defaultHeader,
        footer: normalizeFooter(data?.footer) || defaultFooter,
        popup: normalizePopup(data?.popup) || defaultPopup,
        navigation: mapPrimaryNavigation(menuMap.primary, defaultSiteSettings.navigation),
        footerMenus: {
          marketing: footerMenus.marketing.length ? footerMenus.marketing : defaultFooterMenus.marketing,
          web: footerMenus.web.length ? footerMenus.web : defaultFooterMenus.web,
          company: footerMenus.company.length ? footerMenus.company : defaultFooterMenus.company,
          legal: footerMenus.legal.length ? footerMenus.legal : defaultFooterMenus.legal,
        },
      };
    } catch (error) {
      reportWordPressIssue('Loading layout', error);
      return {
        header: defaultHeader,
        footer: defaultFooter,
        popup: defaultPopup,
        navigation: defaultSiteSettings.navigation,
        footerMenus: defaultFooterMenus,
      };
    }
  },

  // Collections managed as WordPress custom post types
  getServices: () => getCollection('services', normalizeService, servicesData),
  getProjects: () => getCollection('projects', normalizeProject, projectsData),
  getReels: () => getCollection('reels', normalizeReel, clientReelsData),
  getTestimonials: () => getCollection('testimonials', normalizeTestimonial, testimonialsData),
  getIndustries: () => getCollection('industries', normalizeIndustry, industriesData),

  /**
   * Blog posts from WordPress. Like the collections, WordPress is the only source once a post
   * is published; the built-in list is the fallback while loading, on error, or when the site
   * has no posts yet. Not gated by VITE_ENABLE_WP_SYNC.
   */
  async getBlogs() {
    try {
      const raw = await wpGet('/wp/v2/posts', {
        params: { per_page: 50, _embed: 'wp:term,wp:featuredmedia,author' }
      });
      if (!Array.isArray(raw) || raw.length === 0) return blogsData;
      const posts = raw.map(normalizeBlogPost).filter(Boolean);
      return posts.length > 0 ? posts : blogsData;
    } catch (error) {
      const message = `[WordPress CMS] Failed to fetch posts: ${error.message}. Using built-in list.`;
      if (import.meta.env.PROD) console.error(message);
      else console.warn(message);
      return blogsData;
    }
  },

  // Team
  async getTeam() {
    return fetchWP('/adlogix/v1/team', teamData);
  },

  // Submit Enquiry Form to Headless WP Endpoint or Mock Handling
  /**
   * Contact page enquiry. Stored by the plugin as an **Enquiries** record and emailed to the
   * admin. Not gated by VITE_ENABLE_WP_SYNC: a lead must never be silently dropped, so a
   * failure here surfaces to the form instead of pretending to succeed.
   */
  async submitEnquiry(formData) {
    return postLead('/adlogix/v1/enquiry', formData);
  },

  /** Book a Call popup. Stored separately as a **Call Bookings** record. */
  async submitBooking(formData) {
    return postLead('/adlogix/v1/booking', formData);
  }
};
