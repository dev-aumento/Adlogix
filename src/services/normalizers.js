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
  if (typeof value !== 'string') return [];
  return value
    .split(/\r?\n/)
    .map((line) => toPlainText(line))
    .filter(Boolean);
}

/**
 * Parse one-row-per-line textareas whose columns are separated by `|`,
 * e.g. "500+ | Clients Served" with keys ['value', 'label'].
 */
export function toPipeRows(value, keys) {
  return toLines(value).map((line) => {
    const cells = line.split('|').map((cell) => cell.trim());
    return Object.fromEntries(keys.map((key, i) => [key, cells[i] || '']));
  });
}

export function toBoolean(value) {
  return value === true || value === 1 || value === '1';
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
 * Turn a WordPress menu URL into a same-site path for React Router when possible
 * (`https://adlogix.in/contact` → `/contact`). External http(s) URLs are kept as-is.
 */
export function toAppPath(value) {
  const link = toSafeLink(value);
  if (!link) return '';
  if (link.startsWith('/')) return link;
  try {
    const url = new URL(link);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    if (origin && url.origin === origin) {
      return `${url.pathname}${url.search}${url.hash}` || '/';
    }
    // During SSR / first paint without window, treat known relative site hosts as paths when path-only needed
    return link;
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

/** Section order from the plugin's `adlogix_sections` REST field. */
function normalizeSectionOrder(sections) {
  if (!Array.isArray(sections)) return null;
  return sections
    .filter((section) => isPlainObject(section) && typeof section.key === 'string')
    .map((section) => ({ key: section.key, enabled: section.enabled !== false }));
}

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
    // ACF returns `acf: []` when a page has no field values.
    fields: isPlainObject(raw.acf) ? raw.acf : {},
    sections: normalizeSectionOrder(raw.adlogix_sections),
  };
}