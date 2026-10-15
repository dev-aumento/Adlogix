# Dynamic page: Homepage

Status: all 14 homepage sections read their text from WordPress. Section order and visibility come from the "Page Sections" box (see `03-page-sections.md`).

The static copy now lives in one place, `homeDefaults` in `src/content/home.js`. It is the safety fallback, not test code, and stays in the codebase.

## Summary

| Item | Value |
|---|---|
| WordPress content type | Core **Page** |
| WordPress slug | `home`, set as the static front page |
| Field group | `Homepage Content` (`group_adlogix_page_home`), file `wordpress/acf/page-home.json`, ACF Free compatible, one tab per section |
| API endpoint | `GET {VITE_WORDPRESS_API_URL}/wp/v2/pages?slug=home&_fields=id,slug,title,modified,acf,adlogix_sections&acf_format=standard` |
| API function | `api.getPage(slug)` in `src/services/api.js` |
| Content model | `homeDefaults` + `mapHomeFields(acf)` in `src/content/home.js`, registered in `src/content/index.js` |
| Hook | `usePageContent('home')` → `{ content, order, status }` |
| Page component | `src/pages/HomePage.jsx` → `<PageSections>` |
| Env variable | `VITE_WORDPRESS_API_URL` (public, read-only) |
| Gated by `VITE_ENABLE_WP_SYNC`? | No |

## How the code is structured

```
WordPress page "home" ──REST──▶ api.getPage('home') ──▶ normalizePage()
                                                        │  fields (ACF), sections (order)
                                                        ▼
usePageContent('home') ── mapHomeFields(fields) ── withDefaults(…, homeDefaults)
        │ content (one object per section key)        order
        ▼                                               ▼
HomePage ── <PageSections sections={homeSections} order={order} content={content} />
                 └─ renders each section component with content[sectionKey]
```

Adding a dynamic page follows the same pattern: create `src/content/<page>.js` with `<page>Defaults` and `map<Page>Fields`, register it in `src/content/index.js`, add `wordpress/acf/page-<slug>.json`, and pass `content[key]` into the section components.

`GrowthPlansSection` and `StudioSection` are also used on Services and Reels. When no `content` prop is passed they read the homepage content themselves, so plans and studio shoots are edited in one place (the Home page).

## Fields by tab

All fields are optional. A blank field falls back to its default. Lists use one item per line (or `Value | Label` per line) because ACF Free has no repeater. Fixed numbered groups (Metric 1–4, Shoot 1–8, …) stand in for repeatable items.

| Tab (section key) | Fields | Notes |
|---|---|---|
| Hero (`hero`) | `hero_badge_text`, `hero_badge_highlight`, `hero_headline_line_1/_highlight_1/_line_2/_highlight_2`, `hero_specializations_intro`, `hero_specializations` (lines), `hero_lead`, `hero_description`, `hero_partner_label/_name/_url`, `hero_primary_cta_label/_link`, `hero_secondary_cta_label`, `hero_metric_1..4` {value, label} | Field keys are unchanged from the old "Homepage Hero" group, so saved hero values carry over. A metric needs both value and label. |
| Client Reels (`reels`) | `reels_badge/_title/_highlight/_subtitle`, `reels_helper_text`, `reels_cta_label` | The reels themselves still come from the reels collection. |
| Studio Showcase (`studio`) | `studio_badge`, `studio_title`, `studio_subtitle`, `studio_shoot_1..8` {title, category, location, image}, `studio_ticker_label`, `studio_ticker` (lines), `studio_cta_label` | A shoot shows only when it has a title **and** an uploaded image. Until at least one shoot has an image, all 8 default shoots are shown. Once any shoot has an image, only the complete shoots are shown. |
| Brand Marquee (`brands`) | `brands_label`, `brands_list` (`Name \| Sector` lines) | |
| Services Overview (`services`) | `services_badge/_title/_highlight/_subtitle`, `services_callout_title/_text/_button` | Service cards come from the services collection. |
| Featured Projects (`projects`) | `projects_badge/_title/_highlight/_subtitle`, `projects_cta_label` | |
| Industries (`industries`) | `industries_badge/_title/_highlight/_subtitle`, `industries_cta_label` | |
| Why Adlogix (`why`) | `why_badge/_title/_highlight/_subtitle`, `why_item_1..6` {icon, title, description} | Icon is a dropdown of the icons React knows. An item needs a title. |
| Our Process (`process`) | `process_badge/_title/_highlight/_subtitle`, `process_step_1..5` {icon, title, description} | Step numbers (01, 02, …) are automatic. |
| Growth Plans (`plans`) | `plans_badge/_title/_highlight/_subtitle`, `plans_plan_1..3` {name, tagline, is_popular, popular_badge, monthly/quarterly/annual _price/_period/_total, metrics (`Value \| Label` lines), features (lines), cta_label}, `plans_disclaimer`, `plans_help_text`, `plans_help_button` | A plan needs a name and a monthly price; clear either to hide that plan. Empty quarterly/annual prices fall back to the monthly price. |
| Video Testimonials (`testimonials`) | `testimonials_badge/_title/_highlight/_subtitle` | Testimonials come from the testimonials collection. |
| Technology Partner (`aumento`) | `aumento_badge/_title/_text/_card_label/_partner_name/_card_text/_link_label/_link_url` | |
| Insights (`insights`) | `insights_badge/_title/_highlight/_subtitle`, `insights_cta_label` | Posts come from the blog collection. |
| Closing CTA (`cta`) | `cta_badge/_title/_highlight/_text`, `cta_options` (`Value \| Label` lines), `cta_button_label`, `cta_alt_text`, `cta_alt_link_label`, `cta_trust_badges` (lines) | The option value is sent to `/contact?service=`. |

"Highlighted words" fields must match part of the title exactly; that part gets the accent colour. If they don't match, the title shows without a highlight.

Links (`*_link`, `*_url`) accept a site path (`/contact`) or an `http(s)://` URL; anything else falls back to the default.

## Example API response (abridged)

```json
[
  {
    "id": 12,
    "slug": "home",
    "title": { "rendered": "Home" },
    "modified": "2026-10-15T11:30:00",
    "acf": {
      "hero_headline_highlight_1": "ATTENTION.",
      "hero_metric_1": { "value": "500+", "label": "Clients Served" },
      "studio_shoot_1": { "title": "Festive Silk & Lehenga Couture", "category": "Ethnic Fashion", "location": "Studio Bay 1", "image": { "url": "https://adlogix.in/wp-content/uploads/2026/10/shoot-1.jpg", "alt": "Model in a crimson lehenga", "width": 800, "height": 1000 } },
      "cta_options": "Performance Marketing & Ads | I need Performance Marketing & Paid Ads\r\nShopify D2C Storefront | I need a High-Converting Shopify Store"
    },
    "adlogix_sections": [
      { "key": "hero", "label": "Hero", "enabled": true },
      { "key": "reels", "label": "Client Reels", "enabled": true },
      { "key": "brands", "label": "Brand Marquee", "enabled": false }
    ]
  }
]
```

## Behavior when content is missing

| Situation | What renders | Logging |
|---|---|---|
| Request in flight | Defaults (hidden behind the intro loader on first visit) | none |
| Page `home` not found | All defaults, default section order | Dev: `console.warn` |
| Page found, some fields blank | WordPress values + defaults for blank fields | none |
| Network error, timeout (8 s), HTTP error, non-JSON, missing env var | All defaults, default order | Dev: `console.warn`; **Production: `console.error`** |

The page never renders blank. Responses are cached in memory for 5 minutes, and identical in-flight requests are shared, so the sections that read the homepage content (Studio and Growth Plans on other pages) don't trigger extra requests.

## WordPress admin setup

1. **Custom Fields → Field Groups**: delete the old **Homepage Hero** group if you imported it, then empty the trash. Saved hero values are kept: they are stored on the page, and the new group uses the same field names and keys.
2. **Custom Fields → Tools → Import Field Groups**: upload `wordpress/acf/page-home.json`. Check that "Show in REST API" is on for **Homepage Content**.
3. The Home page (slug `home`) must be the static front page (**Settings → Reading**).
4. Edit the Home page. Every tab is pre-filled with the current site text; change what you want and click **Update**. Upload real images for the Studio shoots.
5. Verify `https://adlogix.in/wp-json/wp/v2/pages?slug=home&_fields=id,acf,adlogix_sections`.

Do not import `wordpress/acf-export.json` yet; it will be rewritten when Reels and Projects are migrated.

## How to test

1. `.env.local` (git-ignored): `VITE_WORDPRESS_API_URL=https://adlogix.in/wp-json`, then `npm run dev`.
2. Change one field per tab in WordPress, reload `http://localhost:3000/`, and confirm each change. The cache only lives in the open tab, so a full reload always fetches fresh content.
3. Blank a field and confirm the default text returns.
4. Error path: point `VITE_WORDPRESS_API_URL` at a wrong path, restart, and confirm the page still renders fully.
5. Check desktop and mobile widths, as longer WordPress text can wrap differently.
6. `npm run build` must succeed.
