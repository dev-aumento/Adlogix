import { toPlainText, toSafeLink } from '../services/normalizers';

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
 * `{prefix}_link_type` ("page" | "custom") with `{prefix}_page` (site path from a select)
 * or `{prefix}_url` (path or http(s) URL) → a safe href, '' when unset.
 */
export const link = (fields, prefix) =>
  toSafeLink(fields[`${prefix}_link_type`] === 'custom' ? fields[`${prefix}_url`] : fields[`${prefix}_page`]);

/**
 * Numbered ACF group fields (`{prefix}_1` … `{prefix}_{count}`) mapped into a list.
 * `mapGroup` returns null for incomplete groups, which are dropped.
 */
export const groupList = (fields, prefix, count, mapGroup) =>
  Array.from({ length: count }, (_, i) => mapGroup(asObject(fields[`${prefix}_${i + 1}`]))).filter(Boolean);

/**
 * Put a value into a label written once and reused, e.g. `Request {service} Scope` or
 * `Recommended Services for {industry}`. A blank template stays blank.
 */
export const fillToken = (template, token, value) =>
  template ? template.split(`{${token}}`).join(value ?? '') : '';
