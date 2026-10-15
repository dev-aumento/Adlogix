import { useContext, useMemo } from 'react';
import { CMSContext } from '../context/CMSContext';
import { isShownOn } from '../services/collections';

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};

/**
 * Entries of a collection ("reels", "projects", …) ticked for `placement` in their
 * "Show on" box: "home" for homepage sections, the listing page key otherwise.
 */
export const useCollection = (name, placement) => {
  const items = useCMS()[name];
  return useMemo(() => items.filter((item) => isShownOn(item, placement)), [items, placement]);
};
