# Page section ordering (all pages)

Editors can reorder and hide the sections of every main page from WordPress admin, without changing React code.

## In WordPress admin

Editing a page shows a **Page Sections** box in the right sidebar:

- Drag a row by its grip handle (⠿) to change the order.
- Untick a row to hide that section. Its content is kept, and ticking it again brings it back.
- Click **Update**.

The box appears only on pages whose slug is in the section registry below. The static front page always uses the `home` list.

## Pages and section keys

| Page slug | Route | Sections (default order) |
|---|---|---|
| `home` (front page) | `/` | hero, reels, studio, brands, services, projects, industries, why, process, plans, testimonials, aumento, insights, cta |
| `about` | `/about` | hero, story, partner, team, cta |
| `services` | `/services` | hero, catalog, plans, cta |
| `work` | `/work` | hero, portfolio, cta |
| `reels` | `/reels` | hero, production, gallery, studio, plans, cta |
| `industries` | `/industries` | hero, grid, cta |
| `testimonials` | `/testimonials` | hero, grid, cta |
| `blog` | `/blog` | hero, articles |
| `contact` | `/contact` | hero, enquiry |

Sections that share interactive state stay together as one section: a filter bar and its grid ("catalog", "portfolio", "gallery", "articles"), and the contact form with its sidebar ("enquiry").

Not included:
- Detail templates (`/services/:slug`, `/work/:slug`, `/industries/:slug`, `/blog/:slug`), because their layout is driven by each item.
- Privacy Policy and Terms, which are single documents with nothing to reorder.

To use ordering on a page other than Home, create a WordPress page with that slug (title can be anything) and publish it. Content on those pages is still static in React for now. Only the order and visibility come from WordPress until the page's own field group is added.

## How it works

| Item | Value |
|---|---|
| Storage | Post meta `_adlogix_page_sections` = `[{ key, enabled }]` (hidden from the Custom Fields box) |
| Registry | `Adlogix_Headless_Core::get_section_registry()` in `wordpress/adlogix-headless-core.php`; extendable with the `adlogix_page_sections` filter |
| REST field | `adlogix_sections` on `/wp/v2/pages`: `[{ key, label, enabled }]`, or `null` for pages not in the registry |
| React | `api.getPage(slug)` → `page.sections`; `usePageContent(slug).order`; `resolveSectionOrder()` in `src/content/sections.js`; `<PageSections>` in `src/components/sections/PageSections.jsx` |

Rules applied in both PHP and React:
- Sections are shown in the saved order, and unticked sections are skipped.
- Unknown keys are ignored.
- A section added in code but missing from the saved list is appended at the end and shown, so a new section never disappears silently.
- No saved order, a missing page or an API error all fall back to the default order in the React page component.

Saving requires the editor's nonce and `edit_post` capability. Keys are sanitized and restricted to the registry. Reading is public and read-only, like the rest of the page REST response.

## Adding a section to a page

1. Add the component to the page's section map in React, for example `homeSections` in `src/pages/HomePage.jsx`.
2. Add the same key and a label to that page's entry in `get_section_registry()`.
3. Upload the updated plugin. The new section appears at the end of the list and is ticked.

## Example

```json
"adlogix_sections": [
  { "key": "hero", "label": "Hero", "enabled": true },
  { "key": "cta", "label": "Closing CTA", "enabled": true },
  { "key": "story", "label": "Mission & Story", "enabled": false },
  { "key": "partner", "label": "Technology Partner", "enabled": true },
  { "key": "team", "label": "Leadership Team", "enabled": true }
]
```

On `/about` this renders Hero, Closing CTA, Technology Partner, Leadership Team, and hides Mission & Story.

## How to test

1. Upload the updated plugin (version 1.1.0) and edit the Home page. The **Page Sections** box lists the 14 homepage sections.
2. Drag "Closing CTA" to the top, untick "Brand Marquee", and click **Update**.
3. `https://adlogix.in/wp-json/wp/v2/pages?slug=home&_fields=id,adlogix_sections` shows the new order with `"enabled": false` for `brands`.
4. Reload the site. The CTA renders first and the brand marquee is gone. A full reload is enough: the 5-minute cache only lives in the open tab's memory.
5. Tick it again and restore the order to confirm everything returns.
