# Collections: Services, Projects, Client Reels, Testimonials, Industries

Status: all five post types are edited in WordPress and read by the React site through the public REST API. One entry can be shown in several places through its **Show on** box.

## What was missing

| Problem | Fix |
|---|---|
| The post types had no fields; entries returned `"acf": []`. The only field file, `acf-export.json`, covered just Reels and Projects, was never imported, and didn't match the site. | One ACF group per post type in `wordpress/acf/post-type-*.json` (ACF Free compatible). `acf-export.json` was removed. |
| The site never read these entries: they were gated by `VITE_ENABLE_WP_SYNC=false`, so the hard-coded lists in `src/data/` were always shown. | The five collections are read from WordPress regardless of that flag. |
| No way to choose where an entry appears; every section showed the whole list. | A **Show on** checkbox box in the editor sidebar, plus the **Order** number from the Attributes box. |
| Editing screens showed boxes the site ignores (Excerpt, Custom Fields, content editor, Featured Image). | Plugin 1.2.0 registers the post types with only Title and Attributes (Order); everything else is in the ACF fields. |

## Summary

| Item | Value |
|---|---|
| Plugin | `wordpress/adlogix-headless-core.php` 1.2.0 (`supports: title, page-attributes`) |
| Field groups | `wordpress/acf/post-type-reels.json`, `-projects`, `-services`, `-testimonials`, `-industries`. Each file holds the content group and a "Show on" group (sidebar) |
| API endpoint | `GET {VITE_WORDPRESS_API_URL}/wp/v2/{post_type}?per_page=100&_fields=id,slug,title,menu_order,acf&acf_format=standard` |
| API functions | `api.getReels/getProjects/getServices/getTestimonials/getIndustries` → `getCollection()` in `src/services/api.js` |
| Normalizers | `src/services/collections.js` (`normalizeReel`, `normalizeProject`, …) |
| Hook | `useCollection(name, placement)` in `src/hooks/useCMS.js` |
| Gated by `VITE_ENABLE_WP_SYNC`? | No (the flag now only affects blog posts, team, settings and the enquiry form) |

## Show on (placements)

Every option is ticked for a new entry. Untick a box to remove the entry from that section; untick all to keep the entry only on its own detail page.

| Post type | Show on options | Detail page |
|---|---|---|
| Client Reels | Homepage – Client Reels, Reels page – Reels Gallery | none |
| Projects | Homepage – Featured Projects, Work page – Portfolio | `/work/<slug>` |
| Services | Homepage – Services Overview, Services page – Services Catalog | `/services/<slug>` |
| Testimonials | Homepage – Video Testimonials, Testimonials page – Testimonials Grid | none |
| Industries | Homepage – Industries, Industries page – Industries Grid | `/industries/<slug>` |

Detail pages open for every published entry, whatever is ticked. **Order** (Attributes box) sorts entries everywhere, lowest first; equal numbers keep newest first.

## Fields

Lists use one item per line (ACF Free has no repeater). All fields are optional unless the "Shows when" column says otherwise; a blank field hides the element it feeds.

| Post type | Title is | Fields | Shows when |
|---|---|---|---|
| Client Reels | Reel title | client, category (select), aspect_ratio, **poster** (image), **video_file** / **video_url**, duration, views, ctr, description, tags (lines) | Poster image **and** a video (file or URL) |
| Projects | Case study headline | Card tab: client_name, industry, category (select, drives filters), category_label, year, hero_image, video_file / video_url, overview, results (`Value \| Label \| Note` lines), services_delivered (lines). Case study tab: challenge, strategy, execution. Client quote tab: testimonial_quote, testimonial_author, testimonial_role | Title (always present) |
| Services | Service name | category (Digital Marketing & Creative / Web, E-commerce & IT), icon, short_description, full_description, highlights, deliverables, technologies (lines), FAQ 1–6 {question, answer} | Title. A FAQ needs both question and answer |
| Testimonials | Client's name | role, company, industry, rating (1–5, blank hides stars), result, **quote**, video_thumbnail, video_file / video_url, related_project (links "View Case Study") | Name **and** quote. The play button appears only with a video |
| Industries | Industry name | icon, key_metric, hero_image, short_description, challenges, solutions, relevant_services (lines) | Title |

The video upload accepts MP4/WebM/MOV. Large videos are better hosted on a CDN and pasted into the URL field.

## Behavior when content is missing

| Situation | What renders | Logging |
|---|---|---|
| Request in flight | Built-in lists from `src/data/` (hidden behind the intro loader on first visit) | none |
| WordPress has **no published entries** of that type | Built-in list for that type, shown everywhere | none |
| WordPress has entries | Only WordPress entries, filtered by "Show on"; incomplete entries (see table above) are skipped | none |
| A section has no entries to show | The whole section is hidden (heading included) | none |
| Only one category has entries | Filter buttons are hidden | none |
| Network error, timeout, HTTP error, missing env var | Built-in lists | Dev: `console.warn`; Production: `console.error` |

So the built-in list of a type disappears as soon as its first entry is published. Prepare the entries as drafts and publish them together.

## WordPress admin setup

1. Upload `wordpress/adlogix-headless-core.php` (1.2.0 or later) over the existing plugin file. The plugin stays active.
2. **Custom Fields → Tools → Import Field Groups**: import each `wordpress/acf/post-type-*.json` file (five imports). Check that **Show in REST API** is on for each group.
3. Open an entry: the content fields appear in the main column, **Show on** and **Attributes → Order** in the sidebar.
4. Verify: `https://adlogix.in/wp-json/wp/v2/reels?_fields=id,title,menu_order,acf` should list `acf.display_on` and the reel fields.

## How to test

1. `.env.local`: `VITE_WORDPRESS_API_URL=https://adlogix.in/wp-json`, then `npm run dev`.
2. Publish one complete reel ticked only for "Homepage – Client Reels": it appears on the homepage, not on `/reels`. Tick the Reels page too: it appears on both.
3. Clear an optional field (e.g. Views): that badge disappears from the card. Remove the poster: the reel disappears.
4. Change the Order numbers of two entries and confirm the new order after a reload.
5. `npm run build` must succeed.
