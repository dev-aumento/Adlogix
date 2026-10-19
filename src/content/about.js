import { toPlainText, toSafeLink, normalizeMedia } from '../services/normalizers';
import { text, heading, groupList, link } from './helpers';

/**
 * About page content. `aboutDefaults` renders only while WordPress is loading or when
 * the `about` page has no ACF fields; `mapAboutFields` maps the ACF fields of that page
 * (see wordpress/acf/page-about.json) into the same shape, keeping blank values blank.
 */
export const aboutDefaults = {
  hero: {
    badge: 'About Adlogix',
    headline: {
      line1: 'Built Around Ideas.',
      highlight1: 'Driven by Measurable Growth.'
    },
    description:
      'Adlogix was founded on a simple realization: traditional advertising agencies lack technological depth, while traditional IT firms lack creative commercial storytelling. We bring both together under one roof.'
  },

  story: {
    eyebrow: 'Our Mission & Philosophy',
    title: 'Your Creative Growth Partner From Inception to Scale',
    paragraphs: [
      'We position Adlogix as an agile extension of your executive leadership team. Rather than treating marketing and software engineering as isolated silos, we orchestrate them into a unified growth engine.',
      'From testing high-velocity 9:16 vertical video reels to deploying headless React platforms and server-side first-party attribution tracking, we ensure every marketing rupee yields verifiable commercial ROI.'
    ],
    metrics: [
      { value: '100%', label: 'In-House Creative & Tech Execution' },
      { value: '3.9x', label: 'Average Blended Client ROAS' }
    ],
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Adlogix Team Collaboration'
  },

  partner: {
    badge: 'Technology Partnership',
    title: 'Powered by Aumento Infoway',
    text: 'Adlogix leverages the technology capabilities and engineering infrastructure of Aumento Infoway. This partnership enables us to deliver enterprise-grade headless architectures, complex API middleware, high-concurrency cloud setups, and bulletproof web applications.',
    highlight: 'Aumento Infoway',
    ctaLabel: 'Explore Aumento Infoway',
    ctaLink: 'https://aumentoinfoway.com/'
  },

  team: {
    badge: 'Leadership',
    title: 'Creative Minds. Growth Strategists. Engineers.',
    highlight: 'Growth Strategists',
    subtitle:
      'Meet the core leaders driving campaign strategy, creative production, and engineering excellence at Adlogix.',
    members: [
      {
        name: 'Aarav Sharma',
        role: 'Co-Founder & Managing Director',
        bio: '12+ years steering high-growth digital marketing strategies and full-funnel brand scaling.',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
        alt: 'Aarav Sharma',
        linkedin: 'https://linkedin.com'
      },
      {
        name: 'Jessica Ray',
        role: 'Executive Creative Director',
        bio: 'Award-winning commercial filmmaker and viral short-form director specializing in D2C hooks.',
        photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
        alt: 'Jessica Ray',
        linkedin: 'https://linkedin.com'
      },
      {
        name: 'Vikram Mehta',
        role: 'VP of Technology (Aumento Infoway Partner Lead)',
        bio: 'Architecting enterprise headless web applications, high-concurrency systems, and API pipelines.',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
        alt: 'Vikram Mehta',
        linkedin: 'https://aumentoinfoway.com'
      },
      {
        name: 'Elena Ramos',
        role: 'Head of Performance Marketing',
        bio: 'Managed ₹300 Cr+ in paid social & search spend across Meta, Google, TikTok, and programmatic networks.',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
        alt: 'Elena Ramos',
        linkedin: 'https://linkedin.com'
      }
    ]
  },

  cta: {
    title: 'Ready to Partner with Adlogix?',
    text: "Let's discuss how our integrated creative and technology team can help you dominate your category.",
    primaryLabel: 'Start Your Project',
    primaryLink: '/contact',
    secondaryLabel: 'Book a Discovery Call'
  }
};

export function mapAboutFields(f) {
  const storyImage = normalizeMedia(f.story_image);
  const storyTitle = text(f, 'story_title');

  return {
    hero: {
      badge: text(f, 'hero_badge_text'),
      headline: {
        line1: text(f, 'hero_headline_line_1'),
        highlight1: text(f, 'hero_headline_highlight_1')
      },
      description: text(f, 'hero_description')
    },

    story: {
      eyebrow: text(f, 'story_eyebrow'),
      title: storyTitle,
      paragraphs: [text(f, 'story_paragraph_1'), text(f, 'story_paragraph_2')].filter(Boolean),
      metrics: groupList(f, 'story_metric', 2, (g) => {
        const value = toPlainText(g.value);
        return value ? { value, label: toPlainText(g.label) } : null;
      }),
      image: storyImage?.url ?? '',
      imageAlt: storyImage?.alt || storyTitle
    },

    partner: {
      badge: text(f, 'partner_badge'),
      title: text(f, 'partner_title'),
      text: text(f, 'partner_text'),
      // Words inside `text` to bold, not a title highlight.
      highlight: text(f, 'partner_highlight'),
      ctaLabel: text(f, 'partner_cta_label'),
      ctaLink: link(f, 'partner_cta')
    },

    team: {
      ...heading(f, 'team'),
      members: groupList(f, 'team_member', 8, (g) => {
        const name = toPlainText(g.name);
        const photo = normalizeMedia(g.photo);
        if (!name || !photo) return null;
        return {
          name,
          role: toPlainText(g.role),
          bio: toPlainText(g.bio),
          photo: photo.url,
          alt: photo.alt || name,
          linkedin: toSafeLink(g.linkedin)
        };
      })
    },

    cta: {
      title: text(f, 'cta_title'),
      text: text(f, 'cta_text'),
      primaryLabel: text(f, 'cta_primary_label'),
      primaryLink: link(f, 'cta_primary'),
      secondaryLabel: text(f, 'cta_secondary_label')
    }
  };
}
