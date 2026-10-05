import React, { useEffect } from 'react';

export const SEOHead = ({
  title,
  description = "Adlogix is a full-service creative digital marketing, performance advertising, and web solutions agency powered by Aumento Infoway.",
  canonical,
  ogImage = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200",
  type = "website",
  schema
}) => {
  useEffect(() => {
    // Set title
    const fullTitle = title.includes("Adlogix") ? title : `${title} | Adlogix Agency`;
    document.title = fullTitle;

    // Set meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    // Set Open Graph tags
    const setMetaProperty = (prop, val) => {
      let el = document.querySelector(`meta[property="${prop}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', prop);
        document.head.appendChild(el);
      }
      el.content = val;
    };

    setMetaProperty('og:title', fullTitle);
    setMetaProperty('og:description', description);
    setMetaProperty('og:image', ogImage);
    setMetaProperty('og:type', type);

    // Set Canonical link
    if (canonical) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.rel = 'canonical';
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.href = canonical;
    }

    // Inject JSON-LD Schema if provided
    let scriptEl = document.getElementById('page-schema-jsonld');
    if (schema) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = 'page-schema-jsonld';
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(schema);
    } else if (scriptEl) {
      scriptEl.remove();
    }
  }, [title, description, canonical, ogImage, type, schema]);

  return null;
};
