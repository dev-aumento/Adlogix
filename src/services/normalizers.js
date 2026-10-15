const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const NAMED_ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0' };

const decodeEntitiesWithoutDom = (str) =>
  str.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity) => {
    if (entity[0] === '#') {
      const code = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    return NAMED_ENTITIES[entity.toLowerCase()] ?? match;
  });

/** Strip tags and decode HTML entities (e.g. `&#8217;`) into plain text. */
export function toPlainText(value) {
  if (value === undefined || value === null) return '';
  const html = isPlainObject(value) && 'rendered' in value ? value.rendered : value;
  if (typeof html !== 'string' && typeof html !== 'number') return '';
  const str = String(html);
  if (!/[<&]/.test(str)) return str.trim();
  if (typeof DOMParser === 'undefined') {
    return decodeEntitiesWithoutDom(str.replace(/<[^>]*>/g, '')).trim();
  }
  const doc = new DOMParser().parseFromString(str, 'text/html');
  return (doc.body.textContent || '').trim();
}

/** Rendered HTML from a WordPress `{ rendered }` field or a raw string. */
export function toHtml(value) {
  if (isPlainObject(value) && typeof value.rendered === 'string') return value.rendered;
  return typeof value === 'string' ? value : '';
}

/** Split a one-item-per-line textarea (ACF Free has no repeater) into a clean list. */
export function toLines(value) {
  return toPlainText(value)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Accept only internal paths (`/contact`) or http(s) URLs. */
export function toSafeLink(value) {
  const link = toPlainText(value);
  if (!link) return '';
  if (link.startsWith('/') && !link.startsWith('//')) return link;
  try {
    const url = new URL(link);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : '';
  } catch {
    return '';
  }
}

/**
 * Normalize an image from any WordPress shape into `{ url, alt, width, height }`:
 * a WP media object, an ACF image array, or a plain URL string.
 */
export function normalizeMedia(media) {
  if (!media) return null;
  if (typeof media === 'string') {
    const url = toSafeLink(media);
    return url ? { url, alt: '', width: null, height: null } : null;
  }
  if (!isPlainObject(media)) return null;
  const url = toSafeLink(media.source_url || media.url);
  if (!url) return null;
  return {
    url,
    alt: toPlainText(media.alt_text ?? media.alt ?? ''),
    width: media.media_details?.width ?? media.width ?? null,
    height: media.media_details?.height ?? media.height ?? null,
  };
}

/** ACF returns `acf: []` when a post has no field values; always hand back an object. */
const normalizeFields = (acf) => (isPlainObject(acf) ? acf : {});

export function normalizePage(raw) {
  if (!isPlainObject(raw)) return null;
  const embeddedMedia = raw._embedded?.['wp:featuredmedia']?.[0];
  return {
    id: raw.id ?? null,
    slug: typeof raw.slug === 'string' ? raw.slug : '',
    title: toPlainText(raw.title),
    excerpt: toPlainText(raw.excerpt),
    content: toHtml(raw.content),
    modified: raw.modified || null,
    image: normalizeMedia(embeddedMedia) || normalizeMedia(raw.featured_media_url),
    fields: normalizeFields(raw.acf),
  };
}

const HERO_METRIC_SLOTS = 4;

/**
 * Map the `home` page's ACF fields to the hero shape. Missing fields come back
 * empty; `mergeHomeHero` decides what to fall back to.
 */
export function normalizeHomeHero(page) {
  const f = page?.fields || {};
  const metrics = [];
  for (let i = 1; i <= HERO_METRIC_SLOTS; i += 1) {
    const metric = isPlainObject(f[`hero_metric_${i}`]) ? f[`hero_metric_${i}`] : {};
    metrics.push({ value: toPlainText(metric.value), label: toPlainText(metric.label) });
  }

  return {
    badge: {
      text: toPlainText(f.hero_badge_text),
      highlight: toPlainText(f.hero_badge_highlight),
    },
    headline: {
      line1: toPlainText(f.hero_headline_line_1),
      highlight1: toPlainText(f.hero_headline_highlight_1),
      line2: toPlainText(f.hero_headline_line_2),
      highlight2: toPlainText(f.hero_headline_highlight_2),
    },
    specializationsIntro: toPlainText(f.hero_specializations_intro),
    specializations: toLines(f.hero_specializations),
    lead: toPlainText(f.hero_lead),
    description: toPlainText(f.hero_description),
    partner: {
      label: toPlainText(f.hero_partner_label),
      name: toPlainText(f.hero_partner_name),
      url: toSafeLink(f.hero_partner_url),
    },
    primaryCta: {
      label: toPlainText(f.hero_primary_cta_label),
      href: toSafeLink(f.hero_primary_cta_link),
    },
    secondaryCta: {
      label: toPlainText(f.hero_secondary_cta_label),
    },
    metrics,
  };
}

/**
 * Fill every empty WordPress value from the static fallback so the hero layout
 * never renders with holes. Returns the merged content plus the list of fields
 * that fell back, so callers can warn about incomplete content.
 */
export function mergeHomeHero(wpHero, fallback) {
  if (!wpHero) return { content: fallback, missing: ['(entire hero)'] };

  const missing = [];
  const pick = (value, fallbackValue, name) => {
    const empty = Array.isArray(value) ? value.length === 0 : !value;
    if (empty) missing.push(name);
    return empty ? fallbackValue : value;
  };

  const metrics = fallback.metrics.map((fallbackMetric, i) => {
    const metric = wpHero.metrics?.[i] || {};
    if (metric.value && metric.label) return metric;
    missing.push(`hero_metric_${i + 1}`);
    return fallbackMetric;
  });

  return {
    missing,
    content: {
      badge: {
        text: pick(wpHero.badge.text, fallback.badge.text, 'hero_badge_text'),
        // An intentionally empty highlight hides the "• highlight" part of the badge.
        highlight: wpHero.badge.text ? wpHero.badge.highlight : fallback.badge.highlight,
      },
      headline: {
        line1: pick(wpHero.headline.line1, fallback.headline.line1, 'hero_headline_line_1'),
        highlight1: pick(wpHero.headline.highlight1, fallback.headline.highlight1, 'hero_headline_highlight_1'),
        line2: pick(wpHero.headline.line2, fallback.headline.line2, 'hero_headline_line_2'),
        highlight2: pick(wpHero.headline.highlight2, fallback.headline.highlight2, 'hero_headline_highlight_2'),
      },
      specializationsIntro: pick(wpHero.specializationsIntro, fallback.specializationsIntro, 'hero_specializations_intro'),
      specializations: pick(wpHero.specializations, fallback.specializations, 'hero_specializations'),
      lead: pick(wpHero.lead, fallback.lead, 'hero_lead'),
      description: pick(wpHero.description, fallback.description, 'hero_description'),
      partner: {
        label: pick(wpHero.partner.label, fallback.partner.label, 'hero_partner_label'),
        name: pick(wpHero.partner.name, fallback.partner.name, 'hero_partner_name'),
        url: pick(wpHero.partner.url, fallback.partner.url, 'hero_partner_url'),
      },
      primaryCta: {
        label: pick(wpHero.primaryCta.label, fallback.primaryCta.label, 'hero_primary_cta_label'),
        href: pick(wpHero.primaryCta.href, fallback.primaryCta.href, 'hero_primary_cta_link'),
      },
      secondaryCta: {
        label: pick(wpHero.secondaryCta.label, fallback.secondaryCta.label, 'hero_secondary_cta_label'),
      },
      metrics,
    },
  };
}
