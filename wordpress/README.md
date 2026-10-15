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
- **Advanced Custom Fields (ACF Pro)** (or ACF Free) - For structured metadata.
- **WP REST API Menus** (Optional) - For dynamic multi-level navigation menus.
- **Application Passwords / JWT Authentication** (Optional) - For authenticated editorial previews.

### Step 3: Import ACF Field Groups
Page content uses one field group per page, in `wordpress/acf/page-<slug>.json`:

| File | Page | Docs |
|---|---|---|
| `acf/page-home.json` | Home (static front page, slug `home`) | `docs/wordpress-migration/02-home-page.md` |

1. Go to **Custom Fields > Tools > Import Field Groups**.
2. Upload the page file and check that **Show in REST API** is on for the group.

`wordpress/acf-export.json` (Client Reels, Projects, Global Settings) is not imported yet; it will be rewritten when those collections are migrated.

### Step 4: Page Sections (order and visibility)
Plugin version 1.1.0 adds a **Page Sections** box to the page editor sidebar. Drag rows to reorder sections and untick them to hide sections, for the Home, About, Services, Work, Reels, Industries, Testimonials, Blog and Contact pages. Each page needs a published WordPress page with the matching slug. See `docs/wordpress-migration/03-page-sections.md`.

---

## 3. How to Manage Content Without Touching React Code

### 🎬 Uploading 9:16 Client Reels
1. Go to **Client Reels > Add New**.
2. Set the title (e.g. *Aura Botanicals - Summer Glow D2C*).
3. Under the **Client Reel & Creative Video Settings** meta box:
   - Enter **Client / Brand Name**.
   - Select **Category** (*Reels*, *Product Shoots*, *Brand Films*, *Ad Creatives*).
   - Enter video URL (upload an MP4 directly to WordPress Media Library or link to a CDN).
   - Upload a custom vertical thumbnail (JPG/WebP).
   - Add duration (*0:28*) and view count (*1.4M+*).
4. Click **Publish**. The reel will immediately appear in the **Made to Stop the Scroll** section on the frontend.

### 💼 Adding Projects & Case Studies
1. Go to **Projects > Add New**.
2. Enter the title, client name, industry, and hero image.
3. Fill in the **The Challenge**, **The Strategy**, and **Execution & Rollout** narrative fields.
4. Add measurable KPIs (e.g., *+210% YoY Revenue*, *3.9x Blended ROAS*).
5. Click **Publish**.

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

# Legacy switch for the bulk collections loaded by CMSContext
VITE_ENABLE_WP_SYNC=false
```

`VITE_WP_API_URL` is still read as a fallback name for `VITE_WORDPRESS_API_URL`.

Page content and section order (`api.getPage(slug)`, used by every main page) always read from WordPress. The static defaults in `src/content/` are used as a whole only when WordPress is unreachable or the page has no fields. Once the page has fields, a field cleared in the admin stays empty, and its text block is hidden on the site. `VITE_ENABLE_WP_SYNC` only controls the older bulk collections (services, projects, reels, testimonials, industries, blog, team, settings), and should stay `false` until each one is migrated.
