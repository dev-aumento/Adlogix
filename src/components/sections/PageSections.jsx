import React from 'react';
import { resolveSectionOrder } from '../../content/sections';

/**
 * Render a page's sections in the order (and visibility) set in WordPress.
 *
 * `sections` maps section keys to components, in the default order. Keys must match
 * the page's entry in the plugin's section registry (adlogix-headless-core.php).
 * Each section receives `content[key]` as its `content` prop.
 */
export const PageSections = ({ sections, order, content = {} }) => {
  const keys = resolveSectionOrder(Object.keys(sections), order);

  return keys.map((key) => {
    const Section = sections[key];
    return <Section key={key} content={content[key]} />;
  });
};
