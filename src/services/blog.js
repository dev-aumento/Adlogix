import { toPlainText, toHtml, toSafeLink, normalizeMedia } from './normalizers';

/**
 * A WordPress post (`/wp/v2/posts?_embed`) in the shape the blog components use, matching
 * the built-in list in `src/data/blogsData.js`.
 *
 * Posts are ordinary WordPress posts, not one of the custom post types, so there is no
 * "Show on" box: every published post appears in the listing. A post needs a title and a
 * slug; everything else falls back to a sensible default so a post written in plain
 * WordPress, with no extra fields filled in, still renders.
 */

const DEFAULT_AUTHOR = 'Adlogix Team';
const DEFAULT_AUTHOR_ROLE = 'Growth Strategist';
const DEFAULT_CATEGORY = 'Insights';
const DEFAULT_READ_TIME = '5 min read';

const embedded = (raw, key) => raw?._embedded?.[key];

/** The post's first real category. WordPress's catch-all "Uncategorized" is not a topic. */
const firstCategory = (raw) => {
  const groups = embedded(raw, 'wp:term');
  if (!Array.isArray(groups)) return '';
  for (const group of groups) {
    if (!Array.isArray(group)) continue;
    for (const term of group) {
      const name = toPlainText(term?.name);
      if (name && term?.taxonomy === 'category' && name.toLowerCase() !== 'uncategorized') {
        return name;
      }
    }
  }
  return '';
};

const tagNames = (raw) => {
  const groups = embedded(raw, 'wp:term');
  if (!Array.isArray(groups)) return [];
  return groups
    .filter(Array.isArray)
    .flat()
    .filter((term) => term?.taxonomy === 'post_tag')
    .map((term) => toPlainText(term?.name))
    .filter(Boolean);
};

/** "Oct 1, 2026" from the post date, blank when WordPress sends something unusable. */
const publishedDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

/** Roughly 200 words a minute, so a post always shows an honest reading time. */
const readTime = (html) => {
  const words = toPlainText(String(html ?? '').replace(/<[^>]*>/g, ' '))
    .split(/\s+/)
    .filter(Boolean).length;
  return words > 0 ? `${Math.max(1, Math.round(words / 200))} min read` : DEFAULT_READ_TIME;
};

export function normalizeBlogPost(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const slug = toPlainText(raw.slug);
  const title = toPlainText(raw.title?.rendered ?? raw.title);
  if (!slug || !title) return null;

  const author = embedded(raw, 'author')?.[0];
  const content = toHtml(raw.content);
  const acf = raw.acf && typeof raw.acf === 'object' && !Array.isArray(raw.acf) ? raw.acf : {};
  const image = normalizeMedia(embedded(raw, 'wp:featuredmedia')?.[0]);

  return {
    id: slug || String(raw.id ?? ''),
    slug,
    title,
    excerpt: toPlainText(String(raw.excerpt?.rendered ?? '').replace(/<[^>]*>/g, ' ')),
    category: firstCategory(raw) || DEFAULT_CATEGORY,
    readTime: toPlainText(acf.read_time) || readTime(content),
    publishedDate: publishedDate(raw.date),
    author: {
      name: toPlainText(author?.name) || DEFAULT_AUTHOR,
      role: toPlainText(acf.author_role) || DEFAULT_AUTHOR_ROLE,
      avatar: toSafeLink(author?.avatar_urls?.['96']) || '',
    },
    featuredImage: image?.url || '',
    tags: tagNames(raw),
    content,
  };
}
