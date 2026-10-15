import { useMemo } from 'react';
import { api } from '../services/api';
import { pageModels } from '../content';
import { useWordPressData } from './useWordPressData';

/**
 * Content and section order for one WordPress page.
 *
 * Once the page has its ACF fields, WordPress is the only source: a blank field
 * stays blank and the section hides that element. The static defaults are used
 * only while loading, or when WordPress is unreachable or has no fields for the
 * page, so the site never renders empty.
 * `order` is the "Page Sections" list from WordPress, or null to keep the default order.
 */
export function usePageContent(slug) {
  const { data: page, status } = useWordPressData(`page:${slug}`, () => api.getPage(slug));
  const model = pageModels[slug];

  const content = useMemo(() => {
    if (!model) return {};
    const hasFields = Boolean(page) && Object.keys(page.fields).length > 0;
    return hasFields ? model.mapFields(page.fields) : model.defaults;
  }, [model, page]);

  return { content, order: page?.sections ?? null, status };
}
