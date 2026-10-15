/**
 * Apply the WordPress "Page Sections" order to a page's section keys.
 * - Sections ordered in WordPress come first, in that order; unticked ones are hidden.
 * - Sections WordPress doesn't know about yet keep their default position at the end.
 * - Unknown keys from WordPress are ignored.
 * - Without WordPress data the default order is used.
 */
export function resolveSectionOrder(defaultKeys, order) {
  if (!Array.isArray(order) || order.length === 0) return defaultKeys;

  const known = new Set(defaultKeys);
  const listed = order.filter((section) => known.has(section.key));
  const listedKeys = new Set(listed.map((section) => section.key));

  return [
    ...listed.filter((section) => section.enabled).map((section) => section.key),
    ...defaultKeys.filter((key) => !listedKeys.has(key)),
  ];
}
