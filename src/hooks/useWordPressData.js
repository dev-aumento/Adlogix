import { useEffect, useState } from 'react';
import { reportWordPressIssue } from '../services/client';

// Settled results per key, so remounting a section (e.g. navigating back to Home)
// renders the WordPress content immediately instead of flashing the loading state.
const settledResults = new Map();

const isEmptyResult = (data) =>
  data === null || data === undefined || (Array.isArray(data) && data.length === 0);

/**
 * Load one piece of WordPress content for one section.
 *
 * status: 'loading' | 'success' | 'empty' | 'error'
 * Failures are reported (warning in dev, error in prod) and never thrown, so a
 * section can always render its fallback.
 */
export function useWordPressData(key, fetcher) {
  const [state, setState] = useState(
    () => settledResults.get(key) || { status: 'loading', data: null, error: null }
  );

  useEffect(() => {
    let isActive = true;

    fetcher()
      .then((data) => {
        const next = isEmptyResult(data)
          ? { status: 'empty', data: null, error: null }
          : { status: 'success', data, error: null };
        settledResults.set(key, next);
        if (next.status === 'empty' && import.meta.env.DEV) {
          console.warn(`[WordPress] ${key}: no published content found. Showing static fallback content.`);
        }
        if (isActive) setState(next);
      })
      .catch((error) => {
        reportWordPressIssue(key, error);
        if (isActive) setState({ status: 'error', data: null, error });
      });

    return () => {
      isActive = false;
    };
    // `key` identifies the request; `fetcher` is only called again when the key changes.
  }, [key]);

  return { ...state, isLoading: state.status === 'loading' };
}
