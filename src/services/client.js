const DEFAULT_TIMEOUT_MS = 8000;
const CACHE_TTL_MS = 5 * 60 * 1000;

const rawApiUrl = (
  import.meta.env.VITE_WORDPRESS_API_URL ||
  import.meta.env.VITE_WP_API_URL ||
  ''
).trim();

export class WordPressApiError extends Error {
  constructor(message, { code = 'wp_api_error', status = null, url = null, cause } = {}) {
    super(message);
    this.name = 'WordPressApiError';
    this.code = code;
    this.status = status;
    this.url = url;
    if (cause) this.cause = cause;
  }
}

const resolveApiBase = (value) => {
  if (!value) return { base: null, problem: 'VITE_WORDPRESS_API_URL is not set' };
  if (/\/wp-admin(\/|$)/i.test(value) || /wp-login\.php/i.test(value)) {
    return { base: null, problem: 'VITE_WORDPRESS_API_URL must point to /wp-json, not to the WordPress admin' };
  }
  return { base: value.replace(/\/+$/, ''), problem: null };
};

const { base: API_BASE, problem: CONFIG_PROBLEM } = resolveApiBase(rawApiUrl);

export const WORDPRESS_API_URL = API_BASE;
export const isWordPressConfigured = () => Boolean(API_BASE);

export function buildWordPressUrl(path, params = {}) {
  if (!API_BASE) {
    throw new WordPressApiError(CONFIG_PROBLEM, { code: 'not_configured' });
  }
  const origin = typeof window !== 'undefined' ? window.location.origin : undefined;
  const url = new URL(`${API_BASE}/${String(path).replace(/^\/+/, '')}`, origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    url.searchParams.set(key, Array.isArray(value) ? value.join(',') : String(value));
  });
  return url.toString();
}

const responseCache = new Map();
const inFlight = new Map();

export function clearWordPressCache() {
  responseCache.clear();
}

async function request(url, { method = 'GET', body, timeout = DEFAULT_TIMEOUT_MS } = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  let response;
  try {
    response = await fetch(url, {
      method,
      signal: controller.signal,
      credentials: 'omit',
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    const timedOut = error?.name === 'AbortError';
    throw new WordPressApiError(
      timedOut ? `Request timed out after ${timeout}ms` : `Network error: ${error?.message || 'request failed'}`,
      { code: timedOut ? 'timeout' : 'network_error', url, cause: error }
    );
  } finally {
    clearTimeout(timeoutId);
  }

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  let payload = null;
  if (isJson) {
    try {
      payload = await response.json();
    } catch (error) {
      throw new WordPressApiError('Response was not valid JSON', {
        code: 'invalid_json',
        status: response.status,
        url,
        cause: error,
      });
    }
  }

  if (!response.ok) {
    const message = payload?.message || `HTTP ${response.status}`;
    throw new WordPressApiError(message, {
      code: payload?.code || 'http_error',
      status: response.status,
      url,
    });
  }

  if (!isJson) {
    throw new WordPressApiError(`Expected JSON but received "${contentType || 'unknown content type'}"`, {
      code: 'invalid_response',
      status: response.status,
      url,
    });
  }

  return payload;
}

/**
 * GET a WordPress REST resource. Successful responses are cached in memory and
 * concurrent requests for the same URL share one network call.
 */
export async function wpGet(path, { params, timeout, cache = true } = {}) {
  const url = buildWordPressUrl(path, params);

  if (cache) {
    const cached = responseCache.get(url);
    if (cached && cached.expiresAt > Date.now()) return cached.data;
    if (inFlight.has(url)) return inFlight.get(url);
  }

  const promise = request(url, { timeout })
    .then((data) => {
      if (cache) responseCache.set(url, { data, expiresAt: Date.now() + CACHE_TTL_MS });
      return data;
    })
    .finally(() => inFlight.delete(url));

  if (cache) inFlight.set(url, promise);
  return promise;
}

export async function wpPost(path, body, { timeout } = {}) {
  return request(buildWordPressUrl(path), { method: 'POST', body, timeout });
}

/**
 * Report a WordPress problem without hiding it: a detailed warning in development,
 * a console error in production (the UI still shows fallback content).
 */
export function reportWordPressIssue(context, error) {
  const detail = error instanceof Error ? error.message : String(error);
  const where = error?.url ? ` (${error.url})` : '';
  if (import.meta.env.DEV) {
    console.warn(`[WordPress] ${context}: ${detail}${where}. Showing static fallback content.`);
  } else {
    console.error(`[WordPress] ${context}: ${detail}${where}`);
  }
}
