import { defaultSiteSettings } from '../data/siteSettings';
import { servicesData } from '../data/servicesData';
import { projectsData } from '../data/projectsData';
import { clientReelsData } from '../data/reelsData';
import { testimonialsData } from '../data/testimonialsData';
import { industriesData } from '../data/industriesData';
import { blogsData } from '../data/blogsData';
import { clientsData } from '../data/clientsData';
import { teamData } from '../data/teamData';

const WP_API_URL = import.meta.env.VITE_WP_API_URL || 'https://cms.adlogix.agency/wp-json';
const ENABLE_WP_SYNC = import.meta.env.VITE_ENABLE_WP_SYNC === 'true';

// Helper to fetch from WP REST API with timeout & fallback
async function fetchWP(endpoint, fallbackData) {
  if (!ENABLE_WP_SYNC) {
    return fallbackData;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`${WP_API_URL}${endpoint}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[WordPress CMS] Failed to fetch ${endpoint}. HTTP status: ${response.status}. Using fallback.`);
      return fallbackData;
    }

    const data = await response.json();
    return Array.isArray(data) && data.length > 0 ? data : fallbackData;
  } catch (error) {
    console.warn(`[WordPress CMS] Network error or timeout for ${endpoint}:`, error.message);
    return fallbackData;
  }
}

export const api = {
  // Global Settings
  async getSettings() {
    return fetchWP('/adlogix/v1/settings', defaultSiteSettings);
  },

  // Services
  async getServices() {
    const raw = await fetchWP('/wp/v2/services?_embed&per_page=50', null);
    if (!raw) return servicesData;
    
    // Normalization logic if WP REST response is received
    return raw.map(item => ({
      id: item.slug || item.id,
      slug: item.slug,
      category: item.acf?.category || 'marketing-creative',
      categoryTitle: item.acf?.category_title || (item.acf?.category === 'web-it' ? 'Web, E-commerce & IT Solutions' : 'Digital Marketing & Creative'),
      title: item.title?.rendered || item.title,
      shortDesc: item.acf?.short_description || item.excerpt?.rendered?.replace(/<[^>]*>?/gm, ''),
      fullDesc: item.content?.rendered || item.acf?.full_description,
      icon: item.acf?.icon || 'TrendingUp',
      highlights: item.acf?.highlights || [],
      deliverables: item.acf?.deliverables || [],
      technologies: item.acf?.technologies || [],
      faqs: item.acf?.faqs || []
    }));
  },

  // Portfolio / Projects
  async getProjects() {
    const raw = await fetchWP('/wp/v2/projects?_embed&per_page=50', null);
    if (!raw) return projectsData;

    return raw.map(item => ({
      id: item.slug || item.id,
      slug: item.slug,
      title: item.title?.rendered || item.title,
      client: item.acf?.client_name || 'Adlogix Client',
      industry: item.acf?.industry || 'Digital Commerce',
      category: item.acf?.category || 'Marketing',
      categoryLabel: item.acf?.category_label || 'Performance Marketing',
      year: item.acf?.year || '2025',
      heroImage: item.acf?.hero_image || item._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200',
      thumbnail: item.acf?.thumbnail || item._embedded?.['wp:featuredmedia']?.[0]?.source_url,
      videoReelUrl: item.acf?.video_url,
      overview: item.acf?.overview,
      challenge: item.acf?.challenge,
      strategy: item.acf?.strategy,
      execution: item.acf?.execution,
      results: item.acf?.results || [],
      servicesDelivered: item.acf?.services_delivered || [],
      gallery: item.acf?.gallery || [],
      testimonial: item.acf?.testimonial || null
    }));
  },

  // Client Reels (9:16 Video Showcase)
  async getReels() {
    const raw = await fetchWP('/wp/v2/reels?_embed&per_page=50', null);
    if (!raw) return clientReelsData;

    return raw.map(item => ({
      id: item.id?.toString() || item.slug,
      title: item.title?.rendered || item.title,
      client: item.acf?.client || 'Adlogix Partner',
      category: item.acf?.category || 'Reels',
      aspectRatio: item.acf?.aspect_ratio || '9:16',
      duration: item.acf?.duration || '0:30',
      views: item.acf?.views || '1M+',
      ctr: item.acf?.ctr || '4.5%',
      thumbnail: item.acf?.thumbnail || item._embedded?.['wp:featuredmedia']?.[0]?.source_url,
      videoUrl: item.acf?.video_url,
      description: item.acf?.description || item.excerpt?.rendered?.replace(/<[^>]*>?/gm, ''),
      tags: item.acf?.tags || []
    }));
  },

  // Testimonials
  async getTestimonials() {
    const raw = await fetchWP('/wp/v2/testimonials?_embed&per_page=50', null);
    if (!raw) return testimonialsData;

    return raw.map(item => ({
      id: item.id?.toString() || item.slug,
      clientName: item.acf?.client_name || item.title?.rendered,
      role: item.acf?.role || 'Founder',
      company: item.acf?.company || '',
      industry: item.acf?.industry || '',
      rating: item.acf?.rating || 5,
      videoThumbnail: item.acf?.video_thumbnail,
      videoUrl: item.acf?.video_url,
      quote: item.acf?.quote || item.content?.rendered?.replace(/<[^>]*>?/gm, ''),
      result: item.acf?.result || '',
      projectSlug: item.acf?.project_slug || ''
    }));
  },

  // Industries
  async getIndustries() {
    const raw = await fetchWP('/wp/v2/industries?_embed&per_page=50', null);
    if (!raw) return industriesData;

    return raw.map(item => ({
      id: item.slug || item.id,
      slug: item.slug,
      name: item.title?.rendered || item.name,
      icon: item.acf?.icon || 'Sparkles',
      heroImage: item.acf?.hero_image,
      shortDesc: item.acf?.short_desc || item.excerpt?.rendered?.replace(/<[^>]*>?/gm, ''),
      challenges: item.acf?.challenges || [],
      solutions: item.acf?.solutions || [],
      relevantServices: item.acf?.relevant_services || [],
      keyMetrics: item.acf?.key_metrics || ''
    }));
  },

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

  // Brand Marquee Clients
  async getClients() {
    return fetchWP('/adlogix/v1/clients', clientsData);
  },

  // Team
  async getTeam() {
    return fetchWP('/adlogix/v1/team', teamData);
  },

  // Submit Enquiry Form to Headless WP Endpoint or Mock Handling
  async submitEnquiry(formData) {
    if (ENABLE_WP_SYNC) {
      try {
        const response = await fetch(`${WP_API_URL}/adlogix/v1/enquiry`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
        if (response.ok) {
          return { success: true, message: "Enquiry submitted successfully to WordPress backend." };
        }
      } catch (err) {
        console.warn("[Form Submission] WordPress endpoint unreachable. Fallback processing locally:", err);
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
