# Dynamic page: Reels

Status: every piece of text on `/reels` reads from WordPress. Section order and visibility come from the "Page Sections" box (see `03-page-sections.md`).

The static copy now lives in one place, `reelsDefaults` in `src/content/reels.js`. It is the safety fallback for when WordPress can't be reached, not test code, and stays in the codebase.

## Summary

| Item | Value |
|---|---|
| WordPress content type | Core **Page** |
| WordPress slug | `reels` (page ID **497** on the live site) |
| Field group | `Reels Page Content` (`group_adlogix_page_reels`), file `wordpress/acf/page-reels.json`, ACF Free compatible |
| Reel cards | The **Client Reels** post type — separate entries with their own fields and "Show on" box (`04-collections.md`) |
| Content model | `reelsDefaults` + `mapReelsFields(acf)` in `src/content/reels.js`, registered in `src/content/index.js` |
| Hook | `usePageContent('reels')` |
| Page component | `src/pages/ReelsPage.jsx` → `<PageSections>` |
| Section registry | Already present in `get_section_registry()` — **no plugin change was needed** |
| Gated by `VITE_ENABLE_WP_SYNC`? | No |

This file replaces the earlier version of `page-reels.json`, which held only the Growth Plans tab. **All twelve Growth Plans field keys are unchanged**, so re-importing keeps pricing already saved on the page.

## Fields by tab

| Tab (section key) | Fields | Notes |
|---|---|---|
| Hero (`hero`) | `hero_badge_text`, `hero_headline_line_1`, `hero_headline_highlight_1`, `hero_description` | The highlighted line shows in the blue gradient on its own line. |
| Production Highlights (`production`) | `production_item_1..4` {value, label} | The dark band under the hero. An item needs a **value**; its label is optional. With all four cleared the band is hidden. The colour of each column is design and stays in React. |
| Reels Gallery (`gallery`) | `gallery_all_label`, `gallery_cta_label`, `gallery_views_suffix`, `gallery_ctr_suffix` | Labels only — the reels are Client Reels entries. |
| Studio Showcase (`studio`) | *(none — a note only)* | Shared with the Home page; edited at **Pages → Home → Studio Showcase**. Untick it in Page Sections to hide it here only. |
| Growth Plans (`plans`) | The standard plans block | **This page's own pricing**, not shared. See `10-pricing-plans.md`. |
| Closing CTA (`cta`) | `cta_title`, `cta_text`, `cta_button_label`, `cta_button_link_type` / `_page` / `_url` | The button needs a label and a link. It defaults to the custom path `/contact?service=Video Reels Production`, so the contact form arrives pre-filled. |

### Gallery labels

| Field | Where it shows | Blank behaviour |
|---|---|---|
| `gallery_all_label` | The first filter pill | Pill row hidden |
| `gallery_cta_label` | "Book a Video Shoot", opens the discovery form | Button hidden |
| `gallery_views_suffix` | After a reel's view count — "2.4M **Views**" | Just the number shows |
| `gallery_ctr_suffix` | After the click-through rate — "4.1% **CTR**" | Just the number shows |

The **category pills** come from each reel's **Category**, and only categories that have reels are shown.

### Two shared sections, two different rules

| Section | Behaviour |
|---|---|
| **Studio Showcase** | Shared. The shoots are edited once on the Home page and appear on Home and Reels. |
| **Growth Plans** | Page-wise. The Reels page stores its own pricing, independent of Home and Services. |

Both can still be hidden on this page alone by unticking them in the Page Sections box.

## What the client reels post type was missing

| Checked | Result |
|---|---|
| Fields vs. what React renders | **Complete.** `client`, `category`, `aspect_ratio`, `poster`, `video_file`/`video_url`, `duration`, `views`, `ctr`, `description` and `tags` are all consumed — `tags` in the video modal, the rest on the card. |
| Category choices | `Reels`, `Product Shoots`, `Brand Films`, `Ad Creatives` — matching `reelCategories` in `src/data/reelsData.js`, and all four are in use on the live site. |
| Required fields | A reel needs a **poster image** and a **video** (file or URL); incomplete entries are skipped. |
| Published entries | **8** — this is the one collection already running on WordPress content. |

**Nothing was missing, so `post-type-reels.json` is unchanged and does not need re-importing.**

## Behavior when content is missing

| Situation | What renders |
|---|---|
| Page `reels` not found, or no fields | All defaults, default section order |
| Field blank | That element hidden |
| No published Client Reels entries | Built-in list from `src/data/reelsData.js` |
| No reels to show at all | The gallery section is hidden |
| Network error, timeout, missing env var | All defaults (dev: `console.warn`, production: `console.error`) |

## WordPress admin setup

1. **Custom Fields → Tools → Import Field Groups**: upload `wordpress/acf/page-reels.json`. Check that "Show in REST API" is on for **Reels Page Content**. No other field group changed.
2. Open **Pages → Reels**. The six tabs are pre-filled with the current site text; the Growth Plans tab keeps whatever you already saved.
3. Verify `https://adlogix.in/wp-json/wp/v2/pages?slug=reels&_fields=id,acf,adlogix_sections`.

### If the field group doesn't appear

The group is bound to the Reels page by ID (**497**). If the page is ever recreated with a different ID, open **Custom Fields → Reels Page Content → Location Rules** and re-pick *Page is equal to Reels*.

## How to test

1. `npm run dev`, change one field per tab, reload `http://localhost:3000/reels`.
2. Clear a Production Highlights value and confirm that column goes while the others stay; clear all four and confirm the dark band disappears.
3. Clear `gallery_views_suffix` and confirm reels show the bare number.
4. Clear `gallery_cta_label` and confirm "Book a Video Shoot" disappears without breaking the filter row.
5. Set a different Growth Plans title here and on Home, and confirm each page shows its own.
6. Untick **Studio Showcase** in Page Sections and confirm it goes from Reels but stays on Home.
7. `npm run build` must succeed.
