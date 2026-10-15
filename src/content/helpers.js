import { toPlainText } from '../services/normalizers';

const asObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value) ? value : {};

export const text = (fields, name) => toPlainText(fields[name]);

/** `{prefix}_badge`, `_title`, `_highlight`, `_subtitle` → the props SectionHeading expects. */
export const heading = (fields, prefix) => ({
  badge: text(fields, `${prefix}_badge`),
  title: text(fields, `${prefix}_title`),
  highlight: text(fields, `${prefix}_highlight`),
  subtitle: text(fields, `${prefix}_subtitle`),
});

/**
 * Numbered ACF group fields (`{prefix}_1` … `{prefix}_{count}`) mapped into a list.
 * `mapGroup` returns null for incomplete groups, which are dropped.
 */
export const groupList = (fields, prefix, count, mapGroup) =>
  Array.from({ length: count }, (_, i) => mapGroup(asObject(fields[`${prefix}_${i + 1}`]))).filter(Boolean);
