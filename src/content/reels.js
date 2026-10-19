import { plansDefaults, mapPlansFields } from './plans';

/**
 * Reels page content. Only the Growth Plans section is editable in WordPress so far — the
 * pricing on /reels is edited on the Reels page itself, not shared from Home. The rest of the
 * page is still static in React; add its fields here when the page is dynamized, following
 * `src/content/services.js`.
 */
export const reelsDefaults = {
  plans: plansDefaults
};

export function mapReelsFields(f) {
  return {
    plans: mapPlansFields(f)
  };
}
