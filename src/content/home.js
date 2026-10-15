import { toLines, toPipeRows, toSafeLink, toBoolean, normalizeMedia, toPlainText } from '../services/normalizers';
import { text, heading, groupList, link } from './helpers';

/**
 * Homepage content. `homeDefaults` renders only while WordPress is loading or when
 * the `home` page has no ACF fields; `mapHomeFields` maps the ACF fields of that page
 * (see wordpress/acf/page-home.json) into the same shape, keeping blank values blank.
 */
export const homeDefaults = {
  hero: {
    badge: {
      text: "GUJARAT & INDIA'S PREMIER DIGITAL AGENCY",
      highlight: "POWERED BY AUMENTO"
    },
    headline: {
      line1: "WE DON'T JUST GET",
      highlight1: "ATTENTION.",
      line2: "WE GROW YOUR",
      highlight2: "BUSINESS."
    },
    specializationsIntro: "We specialize in",
    specializations: [
      "Performance Marketing",
      "9:16 Viral Reels & Shoots",
      "Meta & Google Ads Scale",
      "Headless React & Next.js",
      "Shopify D2C Growth",
      "Search Engine Optimization (SEO)"
    ],
    lead: "We Scale Brands with Viral Content, Performance Marketing & Modern Web Solutions.",
    description: "Most agencies only post content. Adlogix combines 9:16 Viral Reels, Meta Ads, Google Ads & Headless Web Engineering to help brands generate real leads, sales, and sustainable revenue.",
    partner: {
      label: "Powered by Technology Partner",
      name: "Aumento Infoway",
      url: "https://aumentoinfoway.com/"
    },
    primaryCta: { label: "Grow My Business", href: "/contact" },
    secondaryCta: { label: "Book Strategy Call" },
    metrics: [
      { value: "500+", label: "Clients Served" },
      { value: "200+", label: "Verified Influencers" },
      { value: "6+", label: "Years Experience" },
      { value: "99%", label: "Satisfaction Rate" }
    ]
  },

  reels: {
    heading: {
      badge: "Client Creative Showcase",
      title: "Made to Stop the Scroll.",
      highlight: "Stop the Scroll",
      subtitle: "Real brands. Real campaigns. Creative built to capture attention, cultivate desire, and scale conversions across 9:16 vertical feeds."
    },
    helperText: "Infinite Creative Stream • Hover to pause • Click any reel to watch in HD modal",
    ctaLabel: "Explore All Client Creative Productions",
    ctaLink: "/reels"
  },

  studio: {
    badge: "Studio Adlogix",
    title: "Where Stories Are Shot",
    subtitle: "Fashion and product shoot studio Ahmedabad with professional lighting, 4K cinema rigs, and modular sets engineered for high-converting social creative.",
    shoots: [
      { title: "Festive Silk & Lehenga Couture", category: "Ethnic Fashion", location: "Studio Bay 1 - Crimson Drape Set", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop" },
      { title: "Pastel Kurti & Palazzo Co-ord", category: "Apparel Shoot", location: "Studio Bay 2 - Earthy Minimal Set", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop" },
      { title: "Royal Banarasi Silk Drape", category: "Bridal Wear", location: "Studio Bay 3 - Heritage Modular Set", image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop" },
      { title: "Festive Casuals & Lifestyle", category: "Lookbook Shoot", location: "Studio Bay 1 - Warm Ambient Light", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop" },
      { title: "Embroidered Anarkali Ensemble", category: "Designer Wear", location: "Studio Bay 4 - Dynamic Shadow Grid", image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800&auto=format&fit=crop" },
      { title: "Contemporary Indo-Western Duo", category: "Fashion Campaign", location: "Outdoor Courtyard & Sunlight Set", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop" },
      { title: "Heritage Temple Jewellery & Bridal", category: "Jewellery Shoot", location: "Macro Studio - High CRI Lighting", image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=800&auto=format&fit=crop" },
      { title: "Luxury Skincare & Cosmetics Macro", category: "Product Shoot", location: "Macro Splash & Texture Studio", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop" }
    ],
    tickerLabel: "Perfect For:",
    ticker: [
      "Fashion",
      "Real Estate",
      "Jewellery",
      "Product",
      "Campaign Shoots",
      "Brand Lookbooks",
      "E-commerce Catalogs",
      "Food & Beverage"
    ],
    ctaLabel: "Book Studio Shoot"
  },

  brands: {
    label: "Brands We've Had the Pleasure of Working With",
    items: [
      { name: "LUMINA LUXE", sector: "Beauty & D2C" },
      { name: "APEX REALTY", sector: "Real Estate" },
      { name: "NOVA NUTRITION", sector: "Nutrition & Health" },
      { name: "VELOCITY.AI", sector: "Technology & SaaS" },
      { name: "ZEST BEVERAGES", sector: "Food & Beverage" },
      { name: "VERVE ATHLETICS", sector: "Fashion & Lifestyle" },
      { name: "KIRO JEWELS", sector: "Luxury Jewelry" },
      { name: "ZENITH SYSTEMS", sector: "Smart Technology" },
      { name: "PULSE ROASTERS", sector: "Artisanal Coffee" },
      { name: "AURA BOTANICALS", sector: "Organic Skincare" }
    ]
  },

  services: {
    heading: {
      badge: "Integrated Capabilities",
      title: "Everything Your Brand Needs to Move Forward.",
      highlight: "Move Forward",
      subtitle: "From the first creative spark to scalable enterprise technology, we bring marketing, creative strategy, and engineering under one roof."
    },
    callout: {
      title: "Looking for a combined Marketing + Web Infrastructure retainer?",
      text: "We design tailored monthly growth partnerships that align creative production with headless development.",
      buttonLabel: "Custom Scope Proposal"
    }
  },

  projects: {
    heading: {
      badge: "Selected Case Studies",
      title: "Creative Work. Strategic Thinking. Measurable Impact.",
      highlight: "Measurable Impact",
      subtitle: "Explore how we combine direct-response creative, performance media, and cutting-edge web development to unlock sustainable growth."
    },
    ctaLabel: "View Complete Portfolio & Results →"
  },

  industries: {
    heading: {
      badge: "Specialized Sectors",
      title: "Engineered for Your Industry's Nuances.",
      highlight: "Industry's Nuances",
      subtitle: "We tailor our creative frameworks, acquisition funnels, and web architectures to match the distinct buyer journeys of specialized markets."
    },
    ctaLabel: "Explore All Industry Landing Pages & Solutions →"
  },

  why: {
    heading: {
      badge: "The Adlogix Advantage",
      title: "More Than an Agency. Your Digital Growth Partner.",
      highlight: "Growth Partner",
      subtitle: "We combine the artistic agility of a creative studio with the analytical rigor of a performance agency and the engineering depth of an IT partner."
    },
    items: [
      { icon: "Sparkles", title: "Creative Thinking Backed by Strategy", description: "We don't create vanity art. Every hook, visual angle, and script is anchored in consumer psychology and direct-response conversion principles." },
      { icon: "Target", title: "Performance-Focused Marketing", description: "Our media buying is disciplined, testing multi-channel variables systematically to scale customer acquisition while maintaining profitability." },
      { icon: "Zap", title: "Integrated Marketing & Tech Muscle", description: "With technical capabilities powered by Aumento Infoway, we eliminate silos between creative media buyers and software engineers." },
      { icon: "Video", title: "In-House Content & Studio Production", description: "From 9:16 viral reels to 4K studio macro shoots, our production team creates high-velocity assets without outsourcing bottlenecks." },
      { icon: "BarChart3", title: "Transparent Reporting & First-Party Data", description: "No vanity metrics or fuzzy numbers. You get live Looker Studio dashboards, clear blended ROAS attribution, and bi-weekly executive strategy syncs." },
      { icon: "Users", title: "Tailored to Your Business Goals", description: "We adapt our growth roadmap to your cash-flow cycle, inventory cadence, and enterprise milestones rather than forcing cookie-cutter packages." }
    ]
  },

  process: {
    heading: {
      badge: "Proven Methodology",
      title: "From First Conversation to Real-World Execution.",
      highlight: "Real-World Execution",
      subtitle: "Our five-phase framework guarantees transparency, high-speed delivery, and continuous quantitative refinement."
    },
    steps: [
      { icon: "Search", title: "Discover", description: "Deep-dive into your unit economics, audience psychology, competitor blind spots, and existing digital baseline." },
      { icon: "Compass", title: "Strategize", description: "Engineer a high-velocity marketing roadmap, creative angle testing matrix, and web architecture specification." },
      { icon: "Palette", title: "Create", description: "Script and shoot 9:16 reels, design conversion assets, and develop headless web applications in sprints." },
      { icon: "Rocket", title: "Launch", description: "Deploy multi-channel ad campaigns, activate server-side tracking, and launch high-speed web solutions." },
      { icon: "LineChart", title: "Optimize", description: "Analyze attribution metrics, double down on winning creative angles, and iterate continuously to scale ROI." }
    ]
  },

  plans: {
    badge: "Regular Package Options",
    title: "Choose Your Growth Plan",
    highlight: "Growth Plan",
    subtitle: "All packages include a minimum term of 3 months. Meta Ads budget (₹500/day) paid directly by client. 18% GST charged additionally on all packages.",
    plans: [
      {
        id: "basic-boost",
        name: "Basic Boost",
        tagline: "Ideal for emerging brands building consistent social reach & lead flow.",
        isPopular: false,
        popularBadge: "",
        pricing: {
          monthly: { price: "₹30,000", period: "/month", total: "" },
          quarterly: { price: "₹27,000", period: "/month", total: "₹81,000 billed quarterly (Save 10%)" },
          annual: { price: "₹24,000", period: "/month", total: "₹2,88,000 billed annually (Save 20%)" }
        },
        metrics: [
          { value: "10", label: "REELS/MO" },
          { value: "1", label: "SHOOT" },
          { value: "1", label: "MONTH" }
        ],
        features: [
          "10 Reels per Month",
          "1 Shoot Visit per Month",
          "Minimum Term: 3 Months",
          "Meta Ads Budget: ₹500/day by Client",
          "Instagram Page Management",
          "Content Planning & Strategy",
          "Monthly Performance Report"
        ],
        ctaText: "Get Started"
      },
      {
        id: "advanced-growth",
        name: "Advanced Growth",
        tagline: "Engineered for scaling businesses needing multi-hook viral content & ads.",
        isPopular: true,
        popularBadge: "MOST POPULAR",
        pricing: {
          monthly: { price: "₹40,000", period: "/month", total: "" },
          quarterly: { price: "₹36,000", period: "/month", total: "₹1,08,000 billed quarterly (Save 10%)" },
          annual: { price: "₹32,000", period: "/month", total: "₹3,84,000 billed annually (Save 20%)" }
        },
        metrics: [
          { value: "15", label: "REELS/MO" },
          { value: "2", label: "SHOOTS" },
          { value: "1", label: "MONTH" }
        ],
        features: [
          "15 Reels per Month",
          "2 Shoot Visits per Month",
          "Minimum Term: 3 Months",
          "Meta Ads Budget: ₹500/day by Client",
          "Instagram Page Management",
          "Content Planning & Strategy",
          "Influencer Marketing",
          "Monthly Performance Report"
        ],
        ctaText: "Get Started"
      },
      {
        id: "premium-impact",
        name: "Premium Impact",
        tagline: "Complete multi-channel creative dominance, rapid content scaling & VIP support.",
        isPopular: false,
        popularBadge: "",
        pricing: {
          monthly: { price: "₹70,000", period: "/month", total: "" },
          quarterly: { price: "₹63,000", period: "/month", total: "₹1,89,000 billed quarterly (Save 10%)" },
          annual: { price: "₹56,000", period: "/month", total: "₹6,72,000 billed annually (Save 20%)" }
        },
        metrics: [
          { value: "25", label: "REELS/MO" },
          { value: "3", label: "SHOOTS" },
          { value: "1", label: "MONTH" }
        ],
        features: [
          "25 Reels per Month",
          "3 Shoot Visits per Month",
          "Minimum Term: 3 Months",
          "Meta Ads Budget: ₹500/day by Client",
          "Instagram Page Management",
          "Content Planning & Strategy",
          "Influencer Marketing",
          "Priority Support & Performance Report"
        ],
        ctaText: "Get Started"
      }
    ],
    disclaimer: "* 18% GST charged additionally on all packages. Ad budgets paid directly by the client to Meta platforms. Pricing applies within Gujarat / Ahmedabad; travel costs extra for outside shoots.",
    helpText: "Need a custom enterprise scope, web application, or nationwide video crew?",
    helpButtonLabel: "Book a Strategy Call →"
  },

  testimonials: {
    heading: {
      badge: "Verified Client Voices",
      title: "Don't Just Take Our Word for It.",
      highlight: "Take Our Word",
      subtitle: "Hear directly from founders, CMOs, and growth leaders who have scaled their customer acquisition and web platforms with Adlogix."
    }
  },

  aumento: {
    badge: "Enterprise Technology Backbone",
    title: "Creative Growth. Backed by Technology.",
    text: "Adlogix brings together digital marketing and creative execution, powered by robust technology capabilities through Aumento Infoway. By combining high-velocity creative advertising with deep software engineering, headless architecture, and complex integrations, our clients enjoy unmatched digital performance.",
    cardLabel: "Technology Partner",
    partnerName: "Aumento Infoway",
    cardText: "Enterprise Web Engineering, Headless CMS & Cloud Solutions",
    linkLabel: "Visit Aumento Infoway",
    linkUrl: "https://aumentoinfoway.com/"
  },

  insights: {
    heading: {
      badge: "Growth Knowledge",
      title: "Ideas That Move Businesses Forward.",
      highlight: "Move Businesses Forward",
      subtitle: "Deep-dive frameworks, technical SEO teardowns, short-form video strategies, and modern headless engineering guides."
    },
    ctaLabel: "Explore All Insights"
  },

  cta: {
    badge: "Your Next Big Move Starts Here",
    title: "Have a Brand to Grow or an Idea to Build?",
    highlight: "Idea to Build?",
    text: "Let's turn your next business challenge into a meaningful digital opportunity. Schedule a strategy session or request a custom proposal today.",
    options: [
      { value: "Performance Marketing & Ads", label: "I need Performance Marketing & Paid Ads" },
      { value: "Video Reels & Content Production", label: "I need 9:16 Video Reels & Content Shoots" },
      { value: "React & Next.js Web Development", label: "I need React / Next.js Web Development" },
      { value: "Shopify D2C Storefront", label: "I need a High-Converting Shopify Store" },
      { value: "Headless WordPress CMS", label: "I need Headless WordPress Solutions" }
    ],
    buttonLabel: "Start Project",
    altText: "Prefer a direct conversation?",
    altLinkLabel: "Book a 30-Min Discovery Call",
    trustBadges: [
      "No Long-Term Lock-in Required",
      "NDA Protected Inquiries",
      "Direct Access to Senior Strategists"
    ]
  }
};

const slugify = (value) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const mapPlan = (group) => {
  const name = toPlainText(group.name);
  const monthlyPrice = toPlainText(group.monthly_price);
  if (!name || !monthlyPrice) return null;
  return {
    id: slugify(name),
    name,
    tagline: toPlainText(group.tagline),
    isPopular: toBoolean(group.is_popular),
    popularBadge: toPlainText(group.popular_badge),
    pricing: {
      monthly: { price: monthlyPrice, period: toPlainText(group.monthly_period), total: toPlainText(group.monthly_total) },
      quarterly: { price: toPlainText(group.quarterly_price), period: toPlainText(group.quarterly_period), total: toPlainText(group.quarterly_total) },
      annual: { price: toPlainText(group.annual_price), period: toPlainText(group.annual_period), total: toPlainText(group.annual_total) }
    },
    metrics: toPipeRows(group.metrics, ['value', 'label']).filter((m) => m.value),
    features: toLines(group.features),
    ctaText: toPlainText(group.cta_label)
  };
};

const mapIconItem = (group) => {
  const title = toPlainText(group.title);
  if (!title) return null;
  return { icon: toPlainText(group.icon), title, description: toPlainText(group.description) };
};

export function mapHomeFields(f) {
  return {
    hero: {
      badge: { text: text(f, 'hero_badge_text'), highlight: text(f, 'hero_badge_highlight') },
      headline: {
        line1: text(f, 'hero_headline_line_1'),
        highlight1: text(f, 'hero_headline_highlight_1'),
        line2: text(f, 'hero_headline_line_2'),
        highlight2: text(f, 'hero_headline_highlight_2')
      },
      specializationsIntro: text(f, 'hero_specializations_intro'),
      specializations: toLines(f.hero_specializations),
      lead: text(f, 'hero_lead'),
      description: text(f, 'hero_description'),
      partner: {
        label: text(f, 'hero_partner_label'),
        name: text(f, 'hero_partner_name'),
        url: toSafeLink(f.hero_partner_url)
      },
      primaryCta: { label: text(f, 'hero_primary_cta_label'), href: toSafeLink(f.hero_primary_cta_link) },
      secondaryCta: { label: text(f, 'hero_secondary_cta_label') },
      metrics: groupList(f, 'hero_metric', 4, (g) => {
        const value = toPlainText(g.value);
        return value ? { value, label: toPlainText(g.label) } : null;
      })
    },

    reels: {
      heading: heading(f, 'reels'),
      helperText: text(f, 'reels_helper_text'),
      ctaLabel: text(f, 'reels_cta_label'),
      ctaLink: link(f, 'reels_cta')
    },

    studio: {
      badge: text(f, 'studio_badge'),
      title: text(f, 'studio_title'),
      subtitle: text(f, 'studio_subtitle'),
      shoots: groupList(f, 'studio_shoot', 8, (g) => {
        const image = normalizeMedia(g.image);
        if (!image) return null;
        const title = toPlainText(g.title);
        return {
          title,
          category: toPlainText(g.category),
          location: toPlainText(g.location),
          image: image.url,
          alt: image.alt || title
        };
      }),
      tickerLabel: text(f, 'studio_ticker_label'),
      ticker: toLines(f.studio_ticker),
      ctaLabel: text(f, 'studio_cta_label')
    },

    brands: {
      label: text(f, 'brands_label'),
      items: toPipeRows(f.brands_list, ['name', 'sector']).filter((b) => b.name)
    },

    services: {
      heading: heading(f, 'services'),
      callout: {
        title: text(f, 'services_callout_title'),
        text: text(f, 'services_callout_text'),
        buttonLabel: text(f, 'services_callout_button')
      }
    },

    projects: { heading: heading(f, 'projects'), ctaLabel: text(f, 'projects_cta_label') },

    industries: { heading: heading(f, 'industries'), ctaLabel: text(f, 'industries_cta_label') },

    why: { heading: heading(f, 'why'), items: groupList(f, 'why_item', 6, mapIconItem) },

    process: { heading: heading(f, 'process'), steps: groupList(f, 'process_step', 5, mapIconItem) },

    plans: {
      badge: text(f, 'plans_badge'),
      title: text(f, 'plans_title'),
      highlight: text(f, 'plans_highlight'),
      subtitle: text(f, 'plans_subtitle'),
      plans: groupList(f, 'plans_plan', 3, mapPlan),
      disclaimer: text(f, 'plans_disclaimer'),
      helpText: text(f, 'plans_help_text'),
      helpButtonLabel: text(f, 'plans_help_button')
    },

    testimonials: { heading: heading(f, 'testimonials') },

    aumento: {
      badge: text(f, 'aumento_badge'),
      title: text(f, 'aumento_title'),
      text: text(f, 'aumento_text'),
      cardLabel: text(f, 'aumento_card_label'),
      partnerName: text(f, 'aumento_partner_name'),
      cardText: text(f, 'aumento_card_text'),
      linkLabel: text(f, 'aumento_link_label'),
      linkUrl: toSafeLink(f.aumento_link_url)
    },

    insights: { heading: heading(f, 'insights'), ctaLabel: text(f, 'insights_cta_label') },

    cta: {
      badge: text(f, 'cta_badge'),
      title: text(f, 'cta_title'),
      highlight: text(f, 'cta_highlight'),
      text: text(f, 'cta_text'),
      options: toPipeRows(f.cta_options, ['value', 'label'])
        .filter((o) => o.value)
        .map((o) => ({ value: o.value, label: o.label || o.value })),
      buttonLabel: text(f, 'cta_button_label'),
      altText: text(f, 'cta_alt_text'),
      altLinkLabel: text(f, 'cta_alt_link_label'),
      trustBadges: toLines(f.cta_trust_badges)
    }
  };
}
