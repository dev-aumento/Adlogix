export const defaultSiteSettings = {
  brandName: "Adlogix",
  tagline: "Creative Digital Marketing & Technology Solutions",
  poweredBy: {
    text: "Powered by Aumento Infoway",
    partnerName: "Aumento Infoway",
    url: "https://aumentoinfoway.com/",
    description: "Adlogix brings together digital marketing and creative execution, powered by robust technology capabilities through Aumento Infoway.",
    badgeText: "Technology Partner",
    showBadge: true
  },
  contact: {
    email: "support@adlogix.in",
    supportEmail: "growth@adlogix.in",
    phone: "+1 (800) 592-3564",
    intlPhone: "+91 98765 43210",
    address: "742 Innovation Blvd, Suite 400",
    city: "San Francisco, CA 94107",
    workingHours: "Mon – Fri: 9:00 AM – 6:30 PM (PST)",
    calendlyUrl: "https://calendly.com"
  },
  socials: {
    instagram: "https://instagram.com/adlogix.in",
    linkedin: "https://linkedin.com/company/adlogix",
    twitter: "https://twitter.com/adlogix_in",
    facebook: "https://facebook.com/adlogixin",
    youtube: "https://youtube.com/@adlogix"
  },
  navigation: [
    { name: "Home", href: "/" },
    { 
      name: "Services", 
      href: "/services",
      hasDropdown: true,
      subcategories: [
        {
          title: "Digital Marketing & Creative",
          items: [
            { name: "Performance Marketing", href: "/services/performance-marketing", desc: "ROI-focused paid acquisition" },
            { name: "Meta & Google Ads", href: "/services/meta-google-ads", desc: "Multi-channel PPC scaling" },
            { name: "Search Engine Optimization (SEO)", href: "/services/seo-optimization", desc: "Organic search dominance" },
            { name: "Social Media Marketing", href: "/services/social-media-management", desc: "Community & viral growth" },
            { name: "Video Production & Reels", href: "/services/video-production-reels", desc: "High-impact 9:16 creatives" },
            { name: "Creative Strategy & Ad Campaigns", href: "/services/creative-strategy", desc: "Full-funnel campaign concepts" },
          ]
        },
        {
          title: "Web, E-commerce & IT",
          items: [
            { name: "UI/UX & Brand Design", href: "/services/ui-ux-design", desc: "High-converting user journeys" },
            { name: "React & Next.js Development", href: "/services/react-web-development", desc: "Ultra-fast headless web apps" },
            { name: "WordPress CMS Solutions", href: "/services/headless-wordpress", desc: "Scalable content management" },
            { name: "Shopify & D2C E-commerce", href: "/services/shopify-ecommerce", desc: "Custom stores & conversion optimization" },
            { name: "API Integrations & Automation", href: "/services/api-integrations-automation", desc: "Seamless workflow integration" },
            { name: "Website Maintenance & Support", href: "/services/website-maintenance", desc: "24/7 security & speed optimization" },
          ]
        }
      ]
    },
    { name: "Work", href: "/work" },
    { name: "Reels", href: "/reels", badge: "HOT" },
    { name: "Industries", href: "/industries" },
    { name: "About", href: "/about" },
    { name: "Insights", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ],
  cta: {
    primaryText: "Start a Project",
    primaryHref: "/contact",
    secondaryText: "Explore Our Work",
    secondaryHref: "/work",
    discoveryCallText: "Book a Discovery Call"
  }
};
