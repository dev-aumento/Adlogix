# Dynamic page: Industries (grid + single industry template)

Status: every piece of text on `/industries` reads from WordPress, and so do the labels that frame every single industry page (`/industries/<slug>`). Section order and visibility come from the "Page Sections" box (see `03-page-sections.md`).

The static copy now lives in one place, `industriesDefaults` in `src/content/industries.js`. It is the safety fallback for when WordPress can't be reached, not test code, and stays in the codebase.

## Summary

| Item | Value |
|---|---|
| WordPress content type | Core **Page** |
| WordPress slug | `industries` (page ID **499** on the live site) |
| Field group | `Industries Page Content` (`group_adlogix_page_industries`), file `wordpress/acf/page-industries.json` |
| Industry cards | The **Industries** post type (`04-collections.md`) |
| Content model | `industriesDefaults` + `mapIndustriesFields(acf)` in `src/content/industries.js` |
| Hook | `usePageContent('industries')` |
| Page components | `src/pages/IndustriesPage.jsx` → `<PageSections>`, and `src/pages/IndustryDetailPage.jsx` |
| Section registry | Already present in `get_section_registry()` — **no plugin change was needed** |
| Gated by `VITE_ENABLE_WP_SYNC`? | No |

## Fields by tab

| Tab (section key) | Fields | Notes |
|---|---|---|
| Hero (`hero`) | `hero_badge_text`, `hero_headline_line_1`, `hero_headline_highlight_1`, `hero_description` | The highlighted line shows in the blue gradient on its own line. |
| Industries Grid (`grid`) | `grid_solutions_label`, `grid_link_label` | Labels only — the cards are Industries entries. |
| Closing CTA (`cta`) | `cta_title`, `cta_text`, `cta_button_label` | The button opens the Book a Discovery Call form, so it has a label only. |
| Single Industry Pages (`detail`) | 14 label fields, see below | Not a section of this page: these frame `/industries/<slug>`. |

### Single Industry Pages labels

`detail_breadcrumb_label`, `detail_badge_label`, `detail_headline_suffix`, `detail_hero_cta_label`, `detail_hero_secondary_label`, `detail_benchmark_label`, `detail_challenges_title`, `detail_solutions_title`, `detail_services_eyebrow`, `detail_services_title`, `detail_services_link_label`, `detail_cta_title`, `detail_cta_text`, `detail_cta_button_label`.

**The `{industry}` placeholder.** Four of these are written once and used on every industry, so they take the industry name as `{industry}`:

- `detail_hero_cta_label` — `Request {industry} Growth Plan`
- `detail_challenges_title` — `Common {industry} Challenges`
- `detail_services_title` — `Recommended Services for {industry}`
- `detail_cta_title` — `Scale Your {industry} Brand`

Remove the placeholder for a fixed wording on every industry; it is not required.

The hero button and the closing button always point at `/contact?industry=<industry name>`, so the form arrives pre-filled. That is behaviour, not copy, and stays in React.

## Recommended services are per industry and per card

This was the gap you flagged. The section used to read `relevant_services`, a plain list of names, and render **the same sentence under every card** — "Customized campaign workflows and technical delivery tuned for *industry*" — with every card linking to `/services`.

Each recommended service is now its own set of fields on the Industries entry, **Service 1** to **Service 6**:

| Field | Shows as |
|---|---|
| Service name | The card heading |
| Description | The paragraph under it — **different for every card and every industry** |
| Link | Page or Custom link for "Explore Capability" |

Rules:

- A service needs a **name**; empty slots are skipped, so four services means leaving 5–6 blank.
- A service with **no description** shows the heading alone, with no filler sentence.
- A service with **no link** hides its "Explore Capability" row; the card still shows.
- The link takes a **Page** of this site, or a **Custom link** such as `/services/video-production-reels` to point at one service page. Site paths open without a reload; other websites open in a new tab. Anything that is not a path or an `http(s)` URL is treated as blank.
- `detail_services_link_label` sets the wording of that link for all cards; clearing it hides every link.

The grid card on `/industries` shows the first two service **names** as chips, so filling descriptions does not change that page.

## What the industries post type was missing

| Checked | Result |
|---|---|
| Fields vs. what React renders | `icon`, `key_metric`, `hero_image`, `short_description`, `challenges`, `solutions` all consumed. |
| Icon dropdown | Matches `DynamicIcon`, so an editor cannot pick an icon React can't draw. |
| **Recommended services** | **Was a plain list** with one shared description and a fixed `/services` link. Now `service_1..6` {name, description, link}. |
| Published entries | **Zero.** The cards on the live site are still `src/data/industriesData.js`. |

`post-type-industries.json` **must be re-imported** for the new service fields.

## Behavior when content is missing

| Situation | What renders |
|---|---|
| Page `industries` not found, or no fields | All defaults, default section order |
| Field blank | That element hidden |
| No published Industries entries | Built-in list from `src/data/industriesData.js` (service names only, no descriptions or links) |
| No industries to show | The grid section is hidden |
| Network error, timeout, missing env var | All defaults (dev: `console.warn`, production: `console.error`) |

## WordPress admin setup

1. **Custom Fields → Tools → Import Field Groups**:
   - `wordpress/acf/page-industries.json` — **new**, bound to the Industries page (ID 499).
   - `wordpress/acf/post-type-industries.json` — **re-import** for the Service 1–6 fields.
2. Open **Pages → Industries**. The four tabs are pre-filled with the current site text.
3. On each **Industries** entry, fill Service 1–6 with a name, its own description and its link.
4. Verify `https://adlogix.in/wp-json/wp/v2/pages?slug=industries&_fields=id,acf,adlogix_sections`.

### If the field group doesn't appear

The group is bound by ID (**499**). If the page is recreated with a different ID, open **Custom Fields → Industries Page Content → Location Rules** and re-pick *Page is equal to Industries*.

## How to test

1. `npm run dev`, change one field per tab, reload `http://localhost:3000/industries`.
2. Give two services on one industry different descriptions and confirm each card reads differently.
3. Point one service at `/services/performance-marketing` via Custom link and confirm it opens without a page reload.
4. Clear one service's link and confirm only that card loses its "Explore Capability" row.
5. Clear `detail_services_link_label` and confirm every card loses its link while the cards stay.
6. Clear a service's name and confirm that card disappears with no gap.
7. `npm run build` must succeed.
