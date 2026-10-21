# Dynamic page: Testimonials

Status: every piece of text on `/testimonials` reads from WordPress. Section order and visibility come from the "Page Sections" box (see `03-page-sections.md`).

The static copy now lives in one place, `testimonialsDefaults` in `src/content/testimonials.js`. It is the safety fallback for when WordPress can't be reached, not test code, and stays in the codebase.

## Summary

| Item | Value |
|---|---|
| WordPress content type | Core **Page** |
| WordPress slug | `testimonials` (page ID **568** on the live site) |
| Field group | `Testimonials Page Content` (`group_adlogix_page_testimonials`), file `wordpress/acf/page-testimonials.json` |
| Testimonial cards | The **Testimonials** post type (`04-collections.md`) |
| Content model | `testimonialsDefaults` + `mapTestimonialsFields(acf)` in `src/content/testimonials.js` |
| Hook | `usePageContent('testimonials')` |
| Page component | `src/pages/TestimonialsPage.jsx` → `<PageSections>` |
| Section registry | Already present in `get_section_registry()` — **no plugin change was needed** |
| Gated by `VITE_ENABLE_WP_SYNC`? | No |

## This is the smallest page group so far

The testimonial cards are almost entirely driven by their entries, so the page itself only owns the hero, one label and the closing CTA — eight fields in total.

| Tab (section key) | Fields | Notes |
|---|---|---|
| Hero (`hero`) | `hero_badge_text`, `hero_headline_line_1`, `hero_headline_highlight_1`, `hero_description` | The highlighted line shows in the blue gradient on its own line. |
| Testimonials Grid (`grid`) | `grid_video_label` | The "Watch Video" caption over a testimonial that has a video. Blank hides the caption; the play button stays. |
| Closing CTA (`cta`) | `cta_title`, `cta_text`, `cta_button_label` | The button opens the Book a Discovery Call form, so it has a label only. |

## What the testimonials post type was missing

| Checked | Result |
|---|---|
| Fields vs. what React renders | `role`, `company`, `rating`, `result`, `quote`, `video_thumbnail`, `video_file`, `video_url` and `related_project` are all consumed. |
| `related_project` | Works: the entry stores a project ID, and `CMSContext` turns it into the slug behind the "View Case Study" link in the video player. |
| Entry rules | A testimonial needs a **name** (the entry title) and a **quote**; anything else is optional. A rating outside 1–5 hides the stars; a decimal is rounded. The video block appears only with a thumbnail or a video. |
| **`industry`** | **Mapped but never rendered anywhere.** It is the one field on this post type with no effect on the site. |
| Published entries | **Zero.** The cards on the live site are still `src/data/testimonialsData.js`. |

**Nothing had to change, so `post-type-testimonials.json` does not need re-importing.**

The unused `industry` field is harmless — it just adds a box editors may wonder about. Two options if it bothers you: remove it from the post type, or surface it on the card next to the result badge. Neither is done yet.

## Behavior when content is missing

| Situation | What renders |
|---|---|
| Page `testimonials` not found, or no fields | All defaults, default section order |
| Field blank | That element hidden |
| No published Testimonials entries | Built-in list from `src/data/testimonialsData.js` |
| An entry with no quote | That entry is skipped |
| No testimonials to show at all | The grid section is hidden |
| Network error, timeout, missing env var | All defaults (dev: `console.warn`, production: `console.error`) |

## WordPress admin setup

1. **Custom Fields → Tools → Import Field Groups**: upload `wordpress/acf/page-testimonials.json`. Check that "Show in REST API" is on for **Testimonials Page Content**. No other field group changed.
2. Open **Pages → Testimonials**. The three tabs are pre-filled with the current site text.
3. **Publish the testimonial entries.** There are none yet, so the grid is still the built-in list. Prepare them as drafts and publish together: the first published entry replaces the built-in list for the whole site (`04-collections.md`).
4. Verify `https://adlogix.in/wp-json/wp/v2/pages?slug=testimonials&_fields=id,acf,adlogix_sections`.

### If the field group doesn't appear

The group is bound to the page by ID (**568**). If the page is ever deleted and recreated it gets a new ID and the box stops appearing; open **Custom Fields → Testimonials Page Content → Location Rules** and re-pick *Page is equal to Testimonials*.

## How to test

1. `npm run dev`, change one field per tab, reload `http://localhost:3000/testimonials`.
2. Clear `grid_video_label` and confirm the caption goes while the play button stays.
3. Clear the three Closing CTA fields and confirm the whole band disappears.
4. Publish one testimonial with a quote, a 4-star rating and a result badge, and confirm the card.
5. `npm run build` must succeed.
