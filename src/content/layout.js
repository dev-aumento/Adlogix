import { toPlainText, toSafeLink, toAppPath } from '../services/normalizers';
import { text, link } from './helpers';

/** Static fallbacks used until WordPress Header / Footer / Menus are published. */
export const defaultHeader = {
  brandMark: 'A',
  brandName: 'Adlogix',
  tagline: 'Powered by Aumento',
  bookCallLabel: 'Book Call',
  bookCallAction: 'modal',
  bookCallLink: '',
  primaryCtaLabel: "Let's Talk",
  primaryCtaLink: '/contact',
  megaFooterText: 'Need a custom growth & technology solution?',
  megaFooterLabel: 'View All Capabilities',
  megaFooterLink: '/services',
};

export const defaultFooterMenus = {
  marketing: [
    { name: 'Performance Marketing', href: '/services/performance-marketing' },
    { name: 'Meta & Google Ads', href: '/services/meta-google-ads' },
    { name: 'Video Reels & Shoots', href: '/services/video-production-reels' },
    { name: 'SEO & Search Authority', href: '/services/seo-optimization' },
    { name: 'Social Media Strategy', href: '/services/social-media-management' },
    { name: 'Creative Ad Campaigns', href: '/services/creative-strategy' },
  ],
  web: [
    { name: 'React & Next.js Websites', href: '/services/react-web-development' },
    { name: 'Shopify & D2C Stores', href: '/services/shopify-ecommerce' },
    { name: 'Headless WordPress CMS', href: '/services/headless-wordpress' },
    { name: 'UI/UX & Brand Design', href: '/services/ui-ux-design' },
    { name: 'API Integrations & CRM', href: '/services/api-integrations-automation' },
    { name: 'Maintenance & Support', href: '/services/website-maintenance' },
  ],
  company: [
    { name: 'Our Work / Portfolio', href: '/work' },
    { name: 'Reels & Video Showcase', href: '/reels' },
    { name: 'Industries We Serve', href: '/industries' },
    { name: 'About Adlogix', href: '/about' },
    { name: 'Client Testimonials', href: '/testimonials' },
    { name: 'Insights & Resources', href: '/blog' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms & Conditions', href: '/terms' },
    { name: 'Get in Touch', href: '/contact' },
  ],
};

export const defaultFooter = {
  brandMark: 'A',
  brandName: 'Adlogix',
  description:
    'Adlogix is a full-service creative digital marketing, performance advertising, and technology agency. We combine scroll-stopping creative with high-converting web engineering.',
  partnerLabel: 'Technology Partner',
  partnerText: 'Digital execution & technology infrastructure powered by',
  partnerName: 'Aumento Infoway',
  partnerUrl: 'https://aumentoinfoway.com/',
  colMarketingTitle: 'Marketing & Creative',
  colWebTitle: 'Web & IT Solutions',
  colCompanyTitle: 'Company & Contact',
  email: 'hello@adlogix.agency',
  phone: '+1 (800) 592-3564',
  instagram: 'https://instagram.com/adlogix.agency',
  linkedin: 'https://linkedin.com/company/adlogix',
  twitter: 'https://twitter.com/adlogix_agency',
  copyright: 'Adlogix Agency. All rights reserved. Technology partner',
};

const asObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value) ? value : {};

const menuLeaf = (item) => ({
  name: toPlainText(item.title),
  href: toAppPath(item.url) || toSafeLink(item.url),
  desc: toPlainText(item.description),
  badge: toPlainText(item.badge),
  target: toPlainText(item.target),
});

/**
 * WordPress primary menu → Header navigation shape.
 * Nested grandchildren become mega-menu columns; CSS class badge-hot → badge "HOT".
 */
export function mapPrimaryNavigation(items, fallback) {
  if (!Array.isArray(items) || items.length === 0) return fallback;

  return items.map((item) => {
    const children = Array.isArray(item.children) ? item.children : [];
    const base = {
      name: toPlainText(item.title),
      href: toAppPath(item.url) || toSafeLink(item.url) || '/',
      badge: toPlainText(item.badge),
    };

    if (children.length === 0) return base;

    const hasColumns = children.some((c) => Array.isArray(c.children) && c.children.length > 0);
    if (hasColumns) {
      return {
        ...base,
        hasDropdown: true,
        subcategories: children.map((col) => ({
          title: toPlainText(col.title),
          items: (col.children || []).map(menuLeaf).filter((leaf) => leaf.name && leaf.href),
        })).filter((col) => col.title && col.items.length > 0),
      };
    }

    return {
      ...base,
      hasDropdown: true,
      subcategories: [
        {
          title: base.name,
          items: children.map(menuLeaf).filter((leaf) => leaf.name && leaf.href),
        },
      ],
    };
  }).filter((item) => item.name);
}

/** Flat link list for a footer column menu. */
export function mapFooterLinks(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => ({
      name: toPlainText(item.title),
      href: toAppPath(item.url) || toSafeLink(item.url),
    }))
    .filter((item) => item.name && item.href);
}

export function normalizeHeader(raw) {
  const f = asObject(raw?.acf);
  if (!raw || Object.keys(f).length === 0) return null;

  const bookCallAction = text(f, 'book_call_action') === 'link' ? 'link' : 'modal';
  return {
    brandMark: text(f, 'brand_mark') || defaultHeader.brandMark,
    brandName: text(f, 'brand_name'),
    tagline: text(f, 'tagline'),
    bookCallLabel: text(f, 'book_call_label'),
    bookCallAction,
    bookCallLink: bookCallAction === 'link' ? link(f, 'book_call') : '',
    primaryCtaLabel: text(f, 'primary_cta_label'),
    primaryCtaLink: link(f, 'primary_cta'),
    megaFooterText: text(f, 'mega_footer_text'),
    megaFooterLabel: text(f, 'mega_footer_label'),
    megaFooterLink: link(f, 'mega_footer'),
  };
}

export function normalizeFooter(raw) {
  const f = asObject(raw?.acf);
  if (!raw || Object.keys(f).length === 0) return null;

  return {
    brandMark: text(f, 'brand_mark') || defaultFooter.brandMark,
    brandName: text(f, 'brand_name'),
    description: text(f, 'description'),
    partnerLabel: text(f, 'partner_label'),
    partnerText: text(f, 'partner_text'),
    partnerName: text(f, 'partner_name'),
    partnerUrl: toSafeLink(f.partner_url),
    colMarketingTitle: text(f, 'col_marketing_title'),
    colWebTitle: text(f, 'col_web_title'),
    colCompanyTitle: text(f, 'col_company_title'),
    email: text(f, 'email'),
    phone: text(f, 'phone'),
    instagram: toSafeLink(f.instagram),
    linkedin: toSafeLink(f.linkedin),
    twitter: toSafeLink(f.twitter),
    copyright: text(f, 'copyright'),
  };
}
