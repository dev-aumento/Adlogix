import { useMemo } from 'react';
import { api } from '../services/api';
import { withDefaults } from '../services/normalizers';
import { pageModels } from '../content';
import { useWordPressData } from './useWordPressData';

/**
 * Content and section order for one WordPress page.
 *
 * `content` always has the full default shape (WordPress values replace defaults
 * field by field), so sections render immediately and never break on missing data.
 * `order` is the "Page Sections" list from WordPress, or null to keep the default order.
 */
export function usePageContent(slug) {
  const { data: page, status } = useWordPressData(`page:${slug}`, () => api.getPage(slug));
  const model = pageModels[slug];

  const content = useMemo(() => {
    if (!model) return {};
    return withDefaults(page ? model.mapFields(page.fields) : null, model.defaults);
  }, [model, page]);

  return { content, order: page?.sections ?? null, status };
}
