import React from 'react';
import { Link } from 'react-router-dom';

// Same-origin paths that WordPress serves (admin, uploads, REST) must load from the server, not the router.
const WORDPRESS_PATH = /^\/(wp-|xmlrpc\.php)/;

const currentOrigin = () => (typeof window !== 'undefined' ? window.location.origin : 'http://localhost');

/**
 * Router path for links the app can open without a reload: site paths ("/reels") and
 * absolute URLs on this site ("https://adlogix.in/reels"). Null for other sites and WordPress files.
 */
export function toRouterPath(href) {
  if (!href) return null;
  const origin = currentOrigin();
  let url;
  try {
    url = new URL(href, origin);
  } catch {
    return null;
  }
  if (url.origin !== origin || WORDPRESS_PATH.test(url.pathname)) return null;
  return `${url.pathname}${url.search}${url.hash}`;
}

/** Router `Link` for site pages, new-tab `<a>` for everything else. Renders nothing without an href. */
export const SmartLink = ({ href, children, ...props }) => {
  if (!href) return null;

  const path = toRouterPath(href);
  if (path) {
    return (
      <Link to={path} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
};
