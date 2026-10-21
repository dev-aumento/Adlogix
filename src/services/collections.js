import { toPlainText, toLines, toPipeRows, toSafeLink, normalizeMedia } from './normalizers';
import { mapPlansFields, isPlansEmpty } from '../content/plans';

/**
 * WordPress collection entries (custom post types with the ACF groups from
 * wordpress/acf/post-type-*.json) normalized into the shapes the components use.
 * Every normalizer returns null for entries missing what their card needs, and
 * blank fields stay blank so the components can hide them.
 */

const asObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value) ? value : {};

const toList = (value) => {
  if (Array.isArray(value)) return value.filter((item) => typeof item === 'string' && item);
  return typeof value === 'string' && value ? [value] : [];
};

const videoUrl = (acf) => toSafeLink(asObject(acf.video_file).url) || toSafeLink(acf.video_url);

const entryBase = (raw) => {
  const acf = asObject(raw.acf);
  return {
    id: String(raw.id),
    wpId: raw.id,
    slug: typeof raw.slug === 'string' ? raw.slug : '',
    title: toPlainText(raw.title),
    // null (no "Show on" field at all) means everywhere; an empty list means nowhere.
    displayOn: 'display_on' in acf ? toList(acf.display_on) : null,
  };
};

export const SERVICE_CATEGORY_TITLES = {
  'marketing-creative': 'Digital Marketing & Creative',
  'web-it': 'Web, E-commerce & IT Solutions',
};

export function normalizeReel(raw) {
  const acf = asObject(raw.acf);
  const poster = normalizeMedia(acf.poster);
  const video = videoUrl(acf);
  if (!poster || !video) return null;
  return {
    ...entryBase(raw),
    client: toPlainText(acf.client),
    category: toPlainText(acf.category),
    aspectRatio: acf.aspect_ratio === '16:9' ? '16:9' : '9:16',
    duration: toPlainText(acf.duration),
    views: toPlainText(acf.views),
    ctr: toPlainText(acf.ctr),
    thumbnail: poster.url,
    thumbnailAlt: poster.alt,
    videoUrl: video,
    description: toPlainText(acf.description),
    tags: toLines(acf.tags),
  };
}

export function normalizeProject(raw) {
  const acf = asObject(raw.acf);
  const entry = entryBase(raw);
  if (!entry.title || !entry.slug) return null;
  const image = normalizeMedia(acf.hero_image);
  const quote = toPlainText(acf.testimonial_quote);
  return {
    ...entry,
    client: toPlainText(acf.client_name),
    industry: toPlainText(acf.industry),
    category: toPlainText(acf.category),
    categoryLabel: toPlainText(acf.category_label),
    year: toPlainText(acf.year),
    heroImage: image?.url || '',
    thumbnail: image?.url || '',
    videoReelUrl: videoUrl(acf),
    overview: toPlainText(acf.overview),
    challenge: toPlainText(acf.challenge),
    strategy: toPlainText(acf.strategy),
    execution: toPlainText(acf.execution),
    results: toPipeRows(acf.results, ['value', 'label', 'sub']).filter((row) => row.value || row.label),
    servicesDelivered: toLines(acf.services_delivered),
    testimonial: quote
      ? { quote, author: toPlainText(acf.testimonial_author), role: toPlainText(acf.testimonial_role) }
      : null,
  };
}

/**
 * Deliverables in either shape: the `deliverable_1..8` groups of a Services entry, or the
 * plain strings the built-in list in `src/data/servicesData.js` uses. Always
 * `[{ title, description }]`, and safe to call twice. A deliverable needs a title; its
 * description is optional and simply isn't rendered when empty.
 */
export function toDeliverables(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) =>
      typeof item === 'string'
        ? { title: toPlainText(item), description: '' }
        : { title: toPlainText(item?.title), description: toPlainText(item?.description) })
    .filter((row) => row.title);
}

/** The `deliverable_1..8` groups of a Services entry, each with its own description. */
function deliverablesFromFields(acf) {
  return toDeliverables(
    Array.from({ length: 8 }, (_, i) => asObject(acf[`deliverable_${i + 1}`]))
  );
}

export function normalizeService(raw) {
  const acf = asObject(raw.acf);
  const entry = entryBase(raw);
  if (!entry.title || !entry.slug) return null;
  const category = acf.category === 'web-it' ? 'web-it' : 'marketing-creative';
  const faqs = Array.from({ length: 6 }, (_, i) => asObject(acf[`faq_${i + 1}`]))
    .map((faq) => ({ q: toPlainText(faq.question), a: toPlainText(faq.answer) }))
    .filter((faq) => faq.q && faq.a);
  // Own pricing for this service's page; null means "use the Services page pricing".
  const plans = mapPlansFields(acf);
  return {
    ...entry,
    plans: isPlansEmpty(plans) ? null : plans,
    category,
    categoryTitle: SERVICE_CATEGORY_TITLES[category],
    icon: toPlainText(acf.icon),
    shortDesc: toPlainText(acf.short_description),
    fullDesc: toPlainText(acf.full_description),
    highlights: toLines(acf.highlights),
    deliverables: deliverablesFromFields(acf),
    technologies: toLines(acf.technologies),
    seoTitle: toPlainText(acf.seo_title),
    seoDescription: toPlainText(acf.seo_description),
    faqs,
  };
}

export function normalizeTestimonial(raw) {
  const acf = asObject(raw.acf);
  const entry = entryBase(raw);
  const quote = toPlainText(acf.quote);
  if (!entry.title || !quote) return null;
  const rating = Math.round(Number(acf.rating));
  const thumbnail = normalizeMedia(acf.video_thumbnail);
  return {
    ...entry,
    clientName: entry.title,
    role: toPlainText(acf.role),
    company: toPlainText(acf.company),
    industry: toPlainText(acf.industry),
    rating: rating >= 1 && rating <= 5 ? rating : 0,
    videoThumbnail: thumbnail?.url || '',
    videoUrl: videoUrl(acf),
    quote,
    result: toPlainText(acf.result),
    projectId: Number(acf.related_project) || null,
    projectSlug: '',
  };
}

export function normalizeIndustry(raw) {
  const acf = asObject(raw.acf);
  const entry = entryBase(raw);
  if (!entry.title || !entry.slug) return null;
  const image = normalizeMedia(acf.hero_image);
  return {
    ...entry,
    name: entry.title,
    icon: toPlainText(acf.icon),
    heroImage: image?.url || '',
    shortDesc: toPlainText(acf.short_description),
    keyMetrics: toPlainText(acf.key_metric),
    challenges: toLines(acf.challenges),
    solutions: toLines(acf.solutions),
    relevantServices: toLines(acf.relevant_services),
  };
}

/** Entries without placements (static fallback content, or no "Show on" group) are shown everywhere. */
export const isShownOn = (item, placement) =>
  !Array.isArray(item.displayOn) || item.displayOn.includes(placement);

/** Categories present in `items`, known ones first in their usual order. */
export function presentCategories(items, known) {
  const present = new Set(items.map((item) => item.category).filter(Boolean));
  return [...known.filter((cat) => present.has(cat)), ...[...present].filter((cat) => !known.includes(cat))];
}
