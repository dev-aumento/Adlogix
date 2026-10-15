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
import {
  normalizeReel,
  normalizeProject,
  normalizeService,
  normalizeTestimonial,
  normalizeIndustry
} from './collections';

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

export const api = {
  // A WordPress page with its ACF fields and section order. Resolves to null when the page doesn't exist.
  async getPage(slug) {
    const pages = await wpGet('/wp/v2/pages', {
      params: {
        slug,
        _fields: 'id,slug,title,modified,acf,adlogix_sections',
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

  // Collections managed as WordPress custom post types
  getServices: () => getCollection('services', normalizeService, servicesData),
  getProjects: () => getCollection('projects', normalizeProject, projectsData),
  getReels: () => getCollection('reels', normalizeReel, clientReelsData),
  getTestimonials: () => getCollection('testimonials', normalizeTestimonial, testimonialsData),
  getIndustries: () => getCollection('industries', normalizeIndustry, industriesData),

  // Blogs / Insights
  async getBlogs() {
    const raw = await fetchWP('/wp/v2/posts?_embed&per_page=50', null);
    if (!raw) return blogsData;

    return raw.map(item => ({
      id: item.slug || item.id?.toString(),
      slug: item.slug,
      title: item.title?.rendered,
      excerpt: item.excerpt?.rendered?.replace(/<[^>]*>?/gm, ''),
      category: item._embedded?.['wp:term']?.[0]?.[0]?.name || 'Insights',
      readTime: item.acf?.read_time || '5 min read',
      publishedDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      author: {
        name: item._embedded?.['author']?.[0]?.name || 'Adlogix Team',
        role: item.acf?.author_role || 'Growth Strategist',
        avatar: item._embedded?.['author']?.[0]?.avatar_urls?.['96'] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'
      },
      featuredImage: item._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200',
      tags: item.acf?.tags || [],
      content: item.content?.rendered
    }));
  },

  // Team
  async getTeam() {
    return fetchWP('/adlogix/v1/team', teamData);
  },

  // Submit Enquiry Form to Headless WP Endpoint or Mock Handling
  async submitEnquiry(formData) {
    if (ENABLE_WP_SYNC) {
      try {
        await wpPost('/adlogix/v1/enquiry', formData);
        return { success: true, message: "Enquiry submitted successfully to WordPress backend." };
      } catch (err) {
        console.warn("[Form Submission] WordPress endpoint unreachable. Fallback processing locally:", err.message);
      }
    }

    // Local simulation with safe delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      success: true,
      message: "Thank you for contacting Adlogix! Our strategy team will reach out within 24 hours."
    };
  }
};
