# Adlogix Headless WordPress CMS Guide

This guide explains how to install, configure, and maintain the Headless WordPress backend for the **Adlogix** website (Powered by Aumento Infoway).

---

## 1. Architecture Overview

- **Frontend**: React.js 18 + Vite + Tailwind CSS + Framer Motion (ultra-fast client/SSR-ready static single-page application).
- **Backend**: Headless WordPress installation serving content via the WordPress REST API (`/wp-json/wp/v2/` and custom endpoints `/wp-json/adlogix/v1/`).
- **Data Synchronization**: The React frontend dynamically fetches content from WordPress when configured, with a 100% resilient offline fallback layer for local development or API outages.

---

## 2. WordPress Installation & Setup

### Step 1: Install the Adlogix Headless Core Plugin
1. Compress or copy the `wordpress/adlogix-headless-core.php` file into your WordPress plugins directory:
   `wp-content/plugins/adlogix-headless-core/adlogix-headless-core.php`
2. Go to **WordPress Admin > Plugins > Installed Plugins** and click **Activate** on **Adlogix Headless Core**.

### Step 2: Install Recommended Companion Plugins
- **Advanced Custom Fields (ACF Free or Pro)** – structured fields for pages and post types.
- **Application Passwords / JWT Authentication** (Optional) – authenticated editorial previews.

### Step 3: Import ACF Field Groups
Page content uses one field group per page (`wordpress/acf/page-<slug>.json`); each post type has its own file (`wordpress/acf/post-type-<type>.json`):

| File | Used by | Docs |
|---|---|---|
| `acf/page-home.json` | Home (static front page, slug `home`) | `docs/wordpress-migration/02-home-page.md` |
| `acf/post-type-header.json` | Site Header (shared) | `docs/wordpress-migration/07-header-footer.md` |
| `acf/post-type-footer.json` | Site Footer (shared) | same |
| `acf/post-type-reels.json` | Client Reels | `docs/wordpress-migration/04-collections.md` |
| `acf/post-type-projects.json` | Projects | same |
| `acf/post-type-services.json` | Services | same |
| `acf/post-type-testimonials.json` | Testimonials | same |
| `acf/post-type-industries.json` | Industries | same |

1. Go to **Custom Fields > Tools > Import Field Groups**.
2. Upload each file and check that **Show in REST API** is on for its groups.

### Step 4: Page Sections (order and visibility)
Plugin version 1.1.0 adds a **Page Sections** box to the page editor sidebar. Drag rows to reorder sections and untick them to hide sections, for the Home, About, Services, Work, Reels, Industries, Testimonials, Blog and Contact pages. Each page needs a published WordPress page with the matching slug. See `docs/wordpress-migration/03-page-sections.md`.

### Step 5: Media uploads (SVG, JFIF, large videos)
Plugin version 1.3.0 accepts SVG (sanitized; Editors and Administrators only) and JFIF (saved as `.jpg`). The upload size limit is a PHP setting of the WordPress container: apply `wordpress/php/uploads.ini` on the VPS as described in `docs/wordpress-migration/05-media-uploads.md`.

### Step 6: Header, Footer & Menus
Plugin **1.4.0** registers **Site Header** / **Site Footer** post types and restores **Appearance → Menus** with five locations (Primary Header + four footer menus). Navigation is managed in Menus; brand/CTAs/socials live in the Header/Footer entries. See `docs/wordpress-migration/07-header-footer.md`.

---

## 3. How to Manage Content Without Touching React Code

### 🎬 Client Reels, Projects, Services, Testimonials, Industries
1. Go to the post type (e.g. **Client Reels > Add New Client Reel**) and enter the title.
2. Fill in the fields in the main column. A reel needs a poster image and a video (upload or URL); a testimonial needs a quote. Blank fields are hidden on the site.
3. In the sidebar, tick where the entry should appear under **Show on** (e.g. *Homepage – Client Reels* and *Reels page – Reels Gallery*). One entry can appear in several places.
4. Set **Attributes → Order** to sort entries (lowest first).
5. Click **Publish**. Full field list and rules: `docs/wordpress-migration/04-collections.md`.

### 📝 Publishing Blog Posts & Insights
1. Go to **Posts > Add New**.
2. Write using standard WordPress Gutenberg editor or Classic Editor.
3. Set **Featured Image** and assign a **Category** (*Performance Marketing*, *Web & Technology*, *Creative Strategy*, *Search Engine Optimization*).
4. Click **Publish**.

### ⚙️ Managing Global Settings & "Powered by Aumento Infoway"
- The "Powered by Aumento Infoway" attribution text, URL, contact email, and phone numbers are managed through the custom endpoint `/wp-json/adlogix/v1/settings` or via `Settings > General`.

---

## 4. Connecting the Frontend to WordPress

In your `.env` file on the React application:

```env
# Public, read-only WordPress REST API root (never a /wp-admin URL)
VITE_WORDPRESS_API_URL=https://adlogix.in/wp-json

# Legacy switch for blog posts, team, settings and the enquiry form
VITE_ENABLE_WP_SYNC=false
```

`VITE_WP_API_URL` is still read as a fallback name for `VITE_WORDPRESS_API_URL`.

Page content and section order (`api.getPage(slug)`, used by every main page) always read from WordPress. The static defaults in `src/content/` are used as a whole only when WordPress is unreachable or the page has no fields. Once the page has fields, a field cleared in the admin stays empty, and its text block is hidden on the site.

Services, Projects, Client Reels, Testimonials and Industries are also always read from WordPress. The built-in lists in `src/data/` are used only while a post type has no published entries or WordPress is unreachable.

`VITE_ENABLE_WP_SYNC` now only controls blog posts, team, settings and the enquiry form, and should stay `false` until each one is migrated.
