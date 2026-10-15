# Dynamic section: Homepage hero

Status: implemented in React, waiting for WordPress content.
Static fallback still in place: `src/data/homeHeroData.js`. Remove it only after the WordPress version has been verified (Step 6).

## Summary

| Item | Value |
|---|---|
| WordPress content type | Core **Page** |
| WordPress slug | `home` (must also be set as the static front page, see setup) |
| Field group | `Homepage Hero` (`group_adlogix_home_hero`) in `wordpress/acf-home-hero.json`, ACF Free compatible |
| API endpoint | `GET {VITE_WORDPRESS_API_URL}/wp/v2/pages?slug=home&_fields=id,slug,title,modified,acf` |
| API function | `api.getHomeHero()` in `src/services/api.js` |
| Normalizers | `normalizePage`, `normalizeHomeHero`, `mergeHomeHero` in `src/services/normalizers.js` |
| Hook | `useWordPressData('home-hero', api.getHomeHero)` in `src/hooks/useWordPressData.js` |
| Consuming component | `src/components/home/HeroSection.jsx` |
| Env variable | `VITE_WORDPRESS_API_URL` (public, read-only; e.g. `https://adlogix.in/wp-json`) |
| Gated by `VITE_ENABLE_WP_SYNC`? | No. That flag only controls the legacy bulk collections. |

## Fields

All fields are optional for the frontend. Any empty field falls back to the current static text (see "Behavior when content is missing").

| ACF field name | Type | Frontend use |
|---|---|---|
| `hero_badge_text` | text | Pill above the headline |
| `hero_badge_highlight` | text | Blue text after the dot in the pill. Empty hides it (only when `hero_badge_text` is filled). |
| `hero_headline_line_1` | text | First headline line (navy) |
| `hero_headline_highlight_1` | text | Large blue word |
| `hero_headline_line_2` | text | Second headline line (navy) |
| `hero_headline_highlight_2` | text | Large gradient word |
| `hero_specializations_intro` | text | "We specialize in" |
| `hero_specializations` | textarea, one item per line | Rotating words (every 2.8 s) |
| `hero_lead` | text | Bold supporting sentence |
| `hero_description` | textarea | Supporting paragraph |
| `hero_partner_label` | text | Partner pill text |
| `hero_partner_name` | text | Bold partner name |
| `hero_partner_url` | url | Partner link (http/https only) |
| `hero_primary_cta_label` | text | Blue button label |
| `hero_primary_cta_link` | text | `/path` = in-app link; `https://...` = opens in new tab. Anything else is rejected. |
| `hero_secondary_cta_label` | text | White button label (always opens the discovery-call modal) |
| `hero_metric_1` ... `hero_metric_4` | group: `value`, `label` | Scorecard. Icons stay in React by position: handshake, sparkles, trophy, star. A metric needs **both** value and label, otherwise it falls back. |

ACF Free has no repeater, so the list of specializations is a textarea and the four metrics are fixed groups.

## Example API response (after setup)

```json
[
  {
    "id": 12,
    "slug": "home",
    "title": { "rendered": "Home" },
    "modified": "2026-10-15T11:30:00",
    "acf": {
      "hero_badge_text": "GUJARAT & INDIA'S PREMIER DIGITAL AGENCY",
      "hero_badge_highlight": "POWERED BY AUMENTO",
      "hero_headline_line_1": "WE DON'T JUST GET",
      "hero_headline_highlight_1": "ATTENTION.",
      "hero_headline_line_2": "WE GROW YOUR",
      "hero_headline_highlight_2": "BUSINESS.",
      "hero_specializations_intro": "We specialize in",
      "hero_specializations": "Performance Marketing\r\n9:16 Viral Reels & Shoots\r\nMeta & Google Ads Scale",
      "hero_lead": "We Scale Brands with Viral Content, Performance Marketing & Modern Web Solutions.",
      "hero_description": "Most agencies only post content. ...",
      "hero_partner_label": "Powered by Technology Partner",
      "hero_partner_name": "Aumento Infoway",
      "hero_partner_url": "https://aumentoinfoway.com/",
      "hero_primary_cta_label": "Grow My Business",
      "hero_primary_cta_link": "/contact",
      "hero_secondary_cta_label": "Book Strategy Call",
      "hero_metric_1": { "value": "500+", "label": "Clients Served" },
      "hero_metric_2": { "value": "200+", "label": "Verified Influencers" },
      "hero_metric_3": { "value": "6+", "label": "Years Experience" },
      "hero_metric_4": { "value": "99%", "label": "Satisfaction Rate" }
    }
  }
]
```

Current live response (before setup): `[]`.

## Behavior when content is missing

| Situation | Hook status | What renders | Logging |
|---|---|---|---|
| Request in flight | `loading` | Static fallback (section has `aria-busy="true"`). On first visit this is hidden behind the intro loader. | none |
| Page `home` not published / not found | `empty` | Full static fallback | Dev: `console.warn` |
| Page found, some fields empty | `success` | WordPress values + static values for empty fields | Dev: `console.warn` listing the fields |
| Network error, timeout (8 s), HTTP error, non-JSON response, missing env var | `error` | Full static fallback | Dev: `console.warn`; **Production: `console.error`** (errors are not hidden) |

The hero never renders blank, and the layout doesn't shift between states.

Results are cached in memory for 5 minutes and identical in-flight requests are shared, so returning to the homepage doesn't refetch or flash.

## WordPress admin setup (required)

1. **Custom Fields → Tools → Import Field Groups**: upload `wordpress/acf-home-hero.json`. Confirm the group "Homepage Hero" has **Show in REST API** enabled (ACF 5.11+).
2. **Pages → Add New**: title `Home`, slug `home`. Publish.
3. **Settings → Reading → Your homepage displays → A static page**, Homepage: `Home`. The field group is attached to the front page. WordPress's own theme front-end isn't served to visitors (the proxy sends `/` to React), so this setting affects only the editor.
4. Edit the Home page. The fields come pre-filled with the current site text. Change what you want and click **Update**.
5. Verify: open `https://adlogix.in/wp-json/wp/v2/pages?slug=home&_fields=id,slug,acf`. You should see the `acf` object above.

If step 5 shows the page but no `acf` key, the field group's REST setting is off or its location rule doesn't match (front page not set).

## How to test

1. Local: `.env.local` (git-ignored) containing `VITE_WORDPRESS_API_URL=https://adlogix.in/wp-json`, then `npm run dev`.
2. Open `http://localhost:3000/`. Before WordPress setup, the hero looks exactly as before and the console shows `[WordPress] home-hero: no published content found...`.
3. After setup, change one field (e.g. `hero_headline_highlight_1`) in WordPress, reload, and confirm the new text appears.
4. Error path: temporarily set `VITE_WORDPRESS_API_URL=https://adlogix.in/wp-json-broken` in `.env.local`, restart, and confirm the hero still renders and the console shows a warning.
5. Check desktop and mobile widths (long WordPress text can wrap differently than the current copy).
6. `npm run build` must succeed.
