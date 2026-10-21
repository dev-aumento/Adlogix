# Dynamic page: Services (listing + single service template)

Status: every piece of text on `/services` reads from WordPress, and so do the labels that frame every single service page (`/services/<slug>`). Section order and visibility come from the "Page Sections" box (see `03-page-sections.md`).

The static copy now lives in one place, `servicesDefaults` in `src/content/services.js`. It is the safety fallback for when WordPress can't be reached, not test code, and stays in the codebase.

**WordPress is the only source once the page has content.** If the Services page returns its ACF fields, every value comes from WordPress. A cleared field stays cleared, and the element it feeds is not rendered. The static copy is used only as a whole: while the request is loading, when the request fails, or when the page or its fields don't exist.

## Summary

| Item | Value |
|---|---|
| WordPress content type | Core **Page** |
| WordPress slug | `services` (page ID **493** on the live site) |
| Field group | `Services Page Content` (`group_adlogix_page_services`), file `wordpress/acf/page-services.json`, ACF Free compatible, one tab per section |
| Service cards | The **Services** post type — separate entries with their own fields and "Show on" box (`04-collections.md`) |
| API function | `api.getPage('services')` in `src/services/api.js` |
| Content model | `servicesDefaults` + `mapServicesFields(acf)` in `src/content/services.js`, registered in `src/content/index.js` |
| Hook | `usePageContent('services')` → `{ content, order, status }` |
| Page components | `src/pages/ServicesPage.jsx` → `<PageSections>`, and `src/pages/ServiceDetailPage.jsx` |
| Section registry | Already present in `get_section_registry()` — **no plugin change was needed** |
| Gated by `VITE_ENABLE_WP_SYNC`? | No |

## What is edited where

The Services area has three sources, and it helps to keep them apart:

| What | Edited in |
|---|---|
| Hero, filter labels, card badges, closing CTA, single-service labels | **Pages → Services** (this field group) |
| Each service: name, icon, description, highlights, deliverables, tools, FAQs | **Services** entries (`post-type-services.json`) |
| The Growth Plans pricing block on `/services` | **Pages → Services → Growth Plans** |
| The pricing on one `/services/<slug>` page | That **Services** entry → **Pricing** tab, else the Services page |

## Fields by tab

All fields are optional. A blank field hides the text or button it feeds. When a section has nothing left to show, the whole section is hidden. To hide a section on purpose, untick it in the "Page Sections" box instead of clearing its fields.

| Tab (section key) | Fields | Notes |
|---|---|---|
| Hero (`hero`) | `hero_badge_text`, `hero_headline_line_1`, `hero_headline_highlight_1`, `hero_description` | `hero_headline_highlight_1` is the second line, shown in the blue gradient. Either line may stand alone. |
| Services Catalog (`catalog`) | `catalog_all_label`, `catalog_cta_label`, `catalog_marketing_label`, `catalog_web_label`, `catalog_marketing_badge`, `catalog_web_badge`, `catalog_marketing_title`, `catalog_web_title`, `catalog_learn_more_label` | Labels only — the cards are Services entries. See the table below. |
| Growth Plans (`plans`) | `plans_badge/_title/_highlight/_subtitle`, `plans_plan_1..3`, `plans_disclaimer`, `plans_help_text`, `plans_help_button` | **This page's own pricing**, not shared. A Services entry can override it on its own page. See `10-pricing-plans.md`. |
| Closing CTA (`cta`) | `cta_title`, `cta_text`, `cta_button_label` | The button opens the "Book a Discovery Call" form, so it has a label only — blank hides it. |
| Single Service Pages (`detail`) | 20 label fields, see below | Not a section of this page: these frame `/services/<slug>`. |

### Services Catalog labels

| Field | Where it shows | Blank behaviour |
|---|---|---|
| `catalog_all_label` | The first filter pill. The count is added automatically: "All Capabilities (14)" | Pill hidden |
| `catalog_marketing_label` / `catalog_web_label` | The two category filter pills | Both pills hidden |
| `catalog_marketing_badge` / `catalog_web_badge` | The small label in each card's top-right corner | That badge hidden |
| `catalog_marketing_title` / `catalog_web_title` | The full category name in the pill on a single service page | Pill hidden |
| `catalog_learn_more_label` | The card's bottom-right link | Link hidden; the card title still opens the service |
| `catalog_cta_label` | "Request Custom Scope", opens the discovery form | Button hidden |

The category filter pills appear only when **both** categories have at least one service **and** both labels are filled. When the whole filter bar is empty it is removed, and the grid moves up.

### Single Service Pages labels

These frame every `/services/<slug>` page. The content inside — description, deliverables, tools, FAQs — belongs to each Services entry.

| Field | Where it shows |
|---|---|
| `detail_breadcrumb_label` | The "Services" step in the breadcrumb |
| `detail_hero_cta_label`, `detail_hero_secondary_label` | The two buttons under the service name |
| `detail_deliverables_eyebrow`, `detail_deliverables_title` | The heading above the deliverables list |
| `detail_tech_title`, `detail_tech_note`, `detail_tech_note_highlight` | The tools box; the highlight is the words inside the note to show in bold |
| `detail_consult_title`, `detail_consult_text`, `detail_consult_button_label` | The dark consultation box in the sidebar |
| `detail_faq_eyebrow`, `detail_faq_title` | The heading above the FAQs |
| `detail_cta_title`, `detail_cta_primary_label` + link, `detail_cta_secondary_label` + link | The closing band |

**Each service's own content.** The frame above is written once; everything inside a single service page comes from that **Services** entry:

| Part of the page | Field on the entry |
|---|---|
| Category pill icon | `icon` (and the pill's wording from `catalog_*_title`) |
| Title | The entry's title |
| Description paragraph | `full_description`, or `short_description` when blank |
| Deliverables list | `deliverable_1..8` — each with its **own title and description** |
| Tool chips | `technologies` |
| FAQs | `faq_1..6` |
| Pricing | The **Pricing** tab (`10-pricing-plans.md`) |
| Browser title / meta description | The **SEO** tab, falling back to the title and short description |

**Deliverable descriptions.** Each deliverable is its own pair of fields on the Services entry, **Deliverable 1** to **Deliverable 8**:

| Field | Shows as |
|---|---|
| Title | The bold heading of the row |
| Description | The small line under that heading |

A deliverable needs a title; empty slots are skipped, so a service with four deliverables simply leaves the rest blank. A title with no description renders the heading alone, with no empty line under it.

There is **no shared description**: every deliverable on every service reads whatever that one says. The old single `detail_deliverable_note` on the Services page, which repeated the same sentence under every deliverable, has been removed.

**The `{service}` placeholder.** Three of these labels are written once and used on every service, so they take the service name as `{service}`:

- `detail_hero_cta_label` — `Request {service} Scope`
- `detail_consult_title` — `Need a Custom Strategy for {service}?`
- `detail_cta_title` — `Ready to Accelerate with {service}?`

On the SEO page that becomes "Request Search Engine Optimization (SEO) Scope". Remove the placeholder for a fixed label on every service; it is not required.

### Button links (Page / Custom link)

The two closing buttons on a single service page use the shared Page/Custom link trio documented in `02-home-page.md`: prefixes `detail_cta_primary` (default Page → Contact) and `detail_cta_secondary` (default Page → Services). Site paths go through the router; another website opens in a new tab. A label without a link, or a link that is neither a site path nor an `http(s)` URL, hides that button.

The hero and consultation buttons always point at `/contact?service=<service name>`, so the form arrives pre-filled. That is behaviour, not copy, and stays in React.

## Adding a service later

Nothing in the code names a service. `/services/<slug>` matches the slug of whatever entries exist, so **publishing a new Services entry is all it takes** — it gets its listing card, its detail page in the same layout, its own pricing and its own SEO, with no code change and no new WordPress Page.

Child Pages under **Pages → Services** are *not* used for this. React routes `/services/<slug>` to its own template and reads the Services entries; a WordPress Page at that path is never fetched, and Caddy sends the address to the React app rather than WordPress. If such pages exist they can be moved to Trash without affecting the site.

## What the services post type was missing

The user asked for the post type to be checked as well. Findings:

| Checked | Result |
|---|---|
| Fields vs. what React renders | Complete. `category`, `icon`, `short_description`, `full_description`, `highlights`, `deliverable_1..8`, `technologies`, `faq_1..6` and `display_on` are all consumed. |
| Icon dropdown vs. `DynamicIcon` | Matches exactly — the same 30 icons. An editor cannot pick an icon React can't draw. |
| Category values | `marketing-creative` / `web-it`, matching `normalizeService`. |
| **Category display name** | **Was hardcoded** in `SERVICE_CATEGORY_TITLES` (`src/services/collections.js`) and not editable anywhere. Now editable as `catalog_marketing_title` / `catalog_web_title`; the constant remains as the fallback. |
| **Published entries** | **Zero.** The 14 cards on the live site are still `src/data/servicesData.js`. |
| **Per-deliverable description** | **Was missing.** One shared line repeated under every deliverable. Each deliverable now has its own title and description (`deliverable_1..8`). |
| **Per-service SEO** | **Was missing.** New **SEO** tab: `seo_title`, `seo_description`. |

**`post-type-services.json` has since gained a Pricing tab, so it does need re-importing** — see `10-pricing-plans.md`. Existing field keys are untouched, so saved content is preserved.

## Behavior when content is missing

| Situation | What renders | Logging |
|---|---|---|
| Request in flight | Defaults | none |
| Page `services` not found | All defaults, default section order | Dev: `console.warn` |
| Page found, field group not assigned / no fields (`acf: []`) | All defaults | none |
| Page found with fields, some blank | WordPress values only; blank elements are hidden | none |
| No published Services entries | Built-in list from `src/data/servicesData.js` | none |
| Published Services entries | Only those entries, filtered by "Show on" | none |
| No services to show at all | The catalog section is hidden | none |
| Network error, timeout (8 s), HTTP error, missing env var | All defaults | Dev: `console.warn`; **Production: `console.error`** |

## WordPress admin setup

1. **Custom Fields → Tools → Import Field Groups**: upload `wordpress/acf/page-services.json`. Check that "Show in REST API" is on for **Services Page Content**. Also re-import `post-type-services.json` for the per-service **Pricing** tab (`10-pricing-plans.md`).
2. Open **Pages → Services**. The five tabs are pre-filled with the current site text.
3. **Publish the service entries.** There are none yet, so the catalog is still the built-in list. Prepare all of them as drafts and publish together: the first published entry replaces the built-in list for the whole site (`04-collections.md`).
4. Verify `https://adlogix.in/wp-json/wp/v2/pages?slug=services&_fields=id,acf,adlogix_sections` and `https://adlogix.in/wp-json/wp/v2/services?_fields=id,slug,acf`.

### If the field group doesn't appear on the page

The group is bound to the Services page by ID (**493**), matching the live site. If the page is ever recreated with a different ID, open **Custom Fields → Services Page Content → Location Rules** and re-pick *Page is equal to Services*.

## How to test

1. `.env.local`: `VITE_WORDPRESS_API_URL=https://adlogix.in/wp-json`, then `npm run dev`.
2. Change one field per tab, reload `http://localhost:3000/services`, and confirm each change.
3. Clear `catalog_learn_more_label` and confirm the card links go, with the card title still clickable.
4. Clear both category filter labels and confirm the pills go while the grid still shows every service.
5. Clear the hero badge, the closing CTA button label and `catalog_cta_label`, and confirm each element disappears with no empty gap.
6. Open any `/services/<slug>` page and confirm the single-service labels follow the Services page, including the `{service}` placeholder in the three labels that use it.
7. Set the closing second button to **Page → Work** and confirm it opens without a page reload.
8. `npm run build` must succeed.
