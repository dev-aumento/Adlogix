# Growth Plans: page-wise pricing

Status: pricing is no longer shared. Every place that shows the Growth Plans block stores its own `plans_*` fields, so the packages on one page can differ from another, and a single service can price itself.

## Where pricing is edited

| Page on the site | Edited in | Field group |
|---|---|---|
| `/` | **Pages → Home → Growth Plans** | `page-home.json` (unchanged) |
| `/services` | **Pages → Services → Growth Plans** | `page-services.json` |
| `/reels` | **Pages → Reels → Growth Plans** | `page-reels.json` (new) |
| `/services/<slug>` | **Services → _that entry_ → Pricing** | `post-type-services.json` |

A single service page falls back when it has no pricing of its own:

```
/services/seo-optimization
   └─ Services entry "SEO" → Pricing tab
         ├─ at least one plan filled?  →  that pricing
         └─ empty?                     →  Pages → Services → Growth Plans
```

So you only fill a service's Pricing tab when that service really is priced differently. Everything else keeps following the Services page, and changing the Services page updates them all at once.

## Fields

The same block everywhere, so the same mapper reads it (`mapPlansFields` in `src/content/plans.js`):

| Field | Notes |
|---|---|
| `plans_badge`, `plans_title`, `plans_highlight`, `plans_subtitle` | `plans_highlight` must match part of the title exactly to get the gradient. |
| `plans_plan_1..3` | Each: name, tagline, "Highlight as popular" + badge, **monthly** / **quarterly** / **annual** {price, period, billed-as note}, metrics, features, button label. |
| `plans_disclaimer`, `plans_help_text`, `plans_help_button` | The small print and the help line under the cards. |

Rules, unchanged from the homepage behaviour:

- **A plan needs a name and a monthly price.** Clear either one and that plan is dropped.
- The Quarterly / Annual switch appears only when at least one plan has that price. A plan without it shows its monthly price on every tab.
- Metrics are one `Value | Label` per line; features one per line (ACF Free has no repeater).
- A plan's button is hidden when its label is blank.
- With no plans and no heading left, the whole section is hidden.
- The "Save 10%" / "Save 20%" pills on the billing switch are interface text and stay in React.

On the Services and Reels pages you can also untick **Growth Plans** in the **Page Sections** box to hide the section there without clearing any of these fields.

## What changed in React

| File | Change |
|---|---|
| `src/content/plans.js` | **New.** `plansDefaults`, `mapPlansFields`, `isPlansEmpty` — one copy of the pricing shape, used by all four sources. |
| `src/content/home.js` | Its inline plans defaults and `mapPlan` moved into `plans.js`; behaviour identical. |
| `src/content/services.js` | Gained a `plans` key. |
| `src/content/reels.js` | **New.** Only `plans` so far — the rest of the Reels page is still static in React. |
| `src/services/collections.js` | `normalizeService` now returns `plans`, or `null` when that entry's Pricing tab is empty. |
| `src/components/home/GrowthPlansSection.jsx` | No longer reads the Home page itself. Every caller passes the pricing it should show, which also removes a Home page request from `/services`, `/reels` and every single service page. |
| `src/pages/ServiceDetailPage.jsx` | Renders `service.plans ?? content.plans`. |

`StudioSection` is unaffected and still reads the Home page, so studio shoots stay edited in one place.

## WordPress admin setup

1. **Custom Fields → Tools → Import Field Groups**, three files:
   - `wordpress/acf/page-services.json` — now carries a real **Growth Plans** tab instead of the "edited on Home" note.
   - `wordpress/acf/page-reels.json` — **new**, bound to the Reels page (ID 497).
   - `wordpress/acf/post-type-services.json` — **re-import**, it gained a **Pricing** tab.
2. Re-importing the services group is safe: every existing field keeps its key, name and settings, so the content already saved on each service entry is preserved. Only the new `plans_*` fields are added.
3. The Services and Reels Growth Plans tabs arrive pre-filled with the current pricing, so the site looks the same until you change them.
4. Each service's **Pricing** tab is deliberately **empty**, which means "use the Services page pricing". Fill it only for services that need their own packages.

## How to test

1. `npm run dev`, then set a different `plans_title` on Home, Services and Reels and confirm each page shows its own.
2. Open any `/services/<slug>`: it shows the Services page pricing.
3. Give one service its own plan (name + monthly price) and confirm only that service's page changes.
4. Clear that service's Pricing tab again and confirm it goes back to the Services page pricing.
5. On the Services page, clear a plan's monthly price and confirm only that card goes; clear all three plus the heading and confirm the section disappears.
6. Untick **Growth Plans** in Page Sections on Reels and confirm it is hidden there but still on Home and Services.
7. `npm run build` must succeed.
