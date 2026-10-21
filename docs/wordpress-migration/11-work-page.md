# Dynamic page: Work (portfolio + single case study template)

Status: every piece of text on `/work` reads from WordPress, and so do the labels that frame every case study (`/work/<slug>`). Section order and visibility come from the "Page Sections" box (see `03-page-sections.md`).

The static copy now lives in one place, `workDefaults` in `src/content/work.js`. It is the safety fallback for when WordPress can't be reached, not test code, and stays in the codebase.

**WordPress is the only source once the page has content.** A cleared field stays cleared and the element it feeds is not rendered. The static copy is used only as a whole: while loading, when the request fails, or when the page or its fields don't exist.

## Summary

| Item | Value |
|---|---|
| WordPress content type | Core **Page** |
| WordPress slug | `work` (page ID **495** on the live site) |
| Field group | `Work Page Content` (`group_adlogix_page_work`), file `wordpress/acf/page-work.json`, ACF Free compatible |
| Project cards | The **Projects** post type — separate entries with their own fields and "Show on" box (`04-collections.md`) |
| Content model | `workDefaults` + `mapWorkFields(acf)` in `src/content/work.js`, registered in `src/content/index.js` |
| Hook | `usePageContent('work')` |
| Page components | `src/pages/WorkPage.jsx` → `<PageSections>`, and `src/pages/ProjectDetailPage.jsx` |
| Section registry | Already present in `get_section_registry()` — **no plugin change was needed** |
| Gated by `VITE_ENABLE_WP_SYNC`? | No |

## What is edited where

| What | Edited in |
|---|---|
| Hero, filter and card labels, closing CTA, case-study frame labels | **Pages → Work** (this field group) |
| Each case study: client, industry, images, video, overview, results, narrative, quote | **Projects** entries (`post-type-projects.json`) |

## Fields by tab

| Tab (section key) | Fields | Notes |
|---|---|---|
| Hero (`hero`) | `hero_badge_text`, `hero_headline_line_1`, `hero_headline_highlight_1`, `hero_description` | The highlighted line shows in the blue gradient on its own line. |
| Portfolio (`portfolio`) | `portfolio_all_label`, `portfolio_search_placeholder`, `portfolio_video_label`, `portfolio_link_label`, `portfolio_empty_title`, `portfolio_empty_button` | Labels only — the cards are Projects entries. See below. |
| Closing CTA (`cta`) | `cta_title`, `cta_text`, `cta_button_label`, `cta_button_link_type` / `_page` / `_url` | The button needs a label and a link. |
| Single Project Pages (`detail`) | 14 label fields, see below | Not a section of this page: these frame `/work/<slug>`. |

### Portfolio labels

| Field | Where it shows | Blank behaviour |
|---|---|---|
| `portfolio_all_label` | The first filter pill | Pill row hidden |
| `portfolio_search_placeholder` | Inside the search box | Search box hidden |
| `portfolio_video_label` | The play button on cards that have a video | Label empty |
| `portfolio_link_label` | The card's bottom-right link | Link hidden; the card title still opens the case study |
| `portfolio_empty_title` / `_button` | Shown when a search matches nothing | That element hidden |

The **category pills** themselves are not labels here: they come from each project's **Category**, and only categories that actually have projects are shown.

### Single Project Pages labels

`detail_breadcrumb_label`, `detail_video_button_label`, `detail_results_label`, `detail_challenge_eyebrow`, `detail_strategy_eyebrow`, `detail_execution_eyebrow`, `detail_services_label`, `detail_client_label`, `detail_sidebar_cta_label`, `detail_cta_title`, `detail_cta_primary_label` + link, `detail_cta_secondary_label` + link.

The two closing buttons use the shared Page/Custom link trio documented in `02-home-page.md`. The sidebar button always points at `/contact?project=<project title>`, so the form arrives pre-filled — that is behaviour, not copy.

## The three narrative headings are per project

The Challenge / Strategy / Execution blocks have two parts, and they are edited in **different places**:

| Part | Example | Edited in |
|---|---|---|
| Small coloured eyebrow | "The Challenge" | **Pages → Work → Single Project Pages** (shared) |
| Large heading | "Breaking Through the Acquisition Ceiling" | **That Projects entry** (`challenge_title`) |
| Paragraph | The case study text | **That Projects entry** (`challenge`) |

Those three headings used to be hardcoded in React and identical on every case study, even though they read as project-specific copy. They are now `challenge_title`, `strategy_title` and `execution_title`, sitting directly above the paragraph each one introduces. A blank heading renders nothing — no stale headline from another project.

## What the projects post type was missing

| Checked | Result |
|---|---|
| Card fields vs. what React renders | Complete: `client_name`, `industry`, `category`, `category_label`, `year`, `hero_image`, `video_file`/`video_url`, `overview`, `results`, `services_delivered` all consumed. |
| Case study fields | `challenge`, `strategy`, `execution` consumed. |
| Client quote | `testimonial_quote` / `_author` / `_role` consumed; the quote block hides without a quote. |
| **Section headings** | **Were hardcoded and shared.** Now `challenge_title`, `strategy_title`, `execution_title` per entry. |
| **Per-project SEO** | **Was missing.** New **SEO** tab: `seo_title`, `seo_description`, matching the Services post type. |
| Category choices | `Marketing`, `Branding`, `Video Production`, `E-commerce`, `Web Development` — matching `projectCategories` in `src/data/projectsData.js`. |
| **Published entries** | **Zero.** The cards on the live site are still `src/data/projectsData.js`. |

## Behavior when content is missing

| Situation | What renders |
|---|---|
| Page `work` not found, or no fields | All defaults, default section order |
| Field blank | That element hidden |
| No published Projects entries | Built-in list from `src/data/projectsData.js` |
| Published entries | Only those, filtered by "Show on" |
| No projects to show at all | The portfolio section is hidden |
| Network error, timeout, missing env var | All defaults (dev: `console.warn`, production: `console.error`) |

## WordPress admin setup

1. **Custom Fields → Tools → Import Field Groups**:
   - `wordpress/acf/page-work.json` — **new**, bound to the Work page (ID 495).
   - `wordpress/acf/post-type-projects.json` — **re-import**, it gained the three headings and the SEO tab. Existing field keys are untouched, so saved content is preserved.
2. Open **Pages → Work**. The four tabs are pre-filled with the current site text.
3. **Publish the project entries.** There are none yet, so the portfolio is still the built-in list. Prepare them as drafts and publish together: the first published entry replaces the built-in list for the whole site (`04-collections.md`).
4. Verify `https://adlogix.in/wp-json/wp/v2/pages?slug=work&_fields=id,acf,adlogix_sections`.

### If the field group doesn't appear

The group is bound to the Work page by ID (**495**). If the page is ever recreated with a different ID, open **Custom Fields → Work Page Content → Location Rules** and re-pick *Page is equal to Work*.

## How to test

1. `npm run dev`, change one field per tab, reload `http://localhost:3000/work`.
2. Clear `portfolio_search_placeholder` and confirm the search box disappears while the filter pills stay.
3. Clear `portfolio_link_label` and confirm the card links go, with card titles still clickable.
4. Search for nonsense and confirm the empty-state message and Reset button.
5. Open a `/work/<slug>` page and confirm the frame labels follow the Work page while the three narrative headings follow the entry.
6. Set the closing second button to **Page → Services** and confirm it opens without a reload.
7. `npm run build` must succeed.
