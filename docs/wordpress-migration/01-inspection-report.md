# Adlogix: WordPress Headless Migration — Phase 1 Inspection Report

Inspection date: 2026-10-15
Scope: full read of `src/`, `public/`, `index.html`, build config, the `wordpress/` folder, and live checks against `https://adlogix.in/wp-json/`.
No source code was changed during this phase.

---

## 0. Executive summary

| Area | Finding |
|---|---|
| Stack | React 18 + Vite 6 + Tailwind 3 + Framer Motion + React Router 6 + lucide-react. JavaScript (`.jsx`/`.js`), no TypeScript, **no ESLint config or `lint` script**. |
| Existing CMS layer | Already present: `src/services/api.js` (fetch + per-type normalizers + fallback), `src/context/CMSContext.jsx` (loads everything once via `Promise.all`), `src/hooks/useCMS.js`. |
| Is it active? | **No.** Gated by `VITE_ENABLE_WP_SYNC === 'true'`. The live bundle (`dist/assets/index-CBdM1cNx.js`) was built with sync off, so `fetchWP` compiles to `return fallback`. The live site never calls WordPress. |
| Default API URL | `https://cms.adlogix.agency/wp-json` — **wrong domain** for the current deployment (`adlogix.in`). |
| Live WordPress | Reachable. Plugin **Adlogix Headless Core is active** (`adlogix/v1` namespace + 5 CPTs registered). **All content is empty**: 0 pages, 0 media, 0 services/projects/reels/testimonials/industries, 1 post (`hello-world`). |
| ACF | No `acf` key appears in any REST response and no ACF REST namespace exists. Cannot confirm whether ACF is installed without admin access. `acf-export.json` defines only 2 field groups (Reels, Projects) and neither sets `show_in_rest`. |
| Static content | Essentially **all** visible content is hardcoded: 10 data files in `src/data/` + section headings/copy inside ~30 components/pages. |
| Media | 35 unique Unsplash images and 6 Mixkit preview MP4s, all hotlinked. No uploaded media in the repo (good). `public/` has only `favicon.svg`, `robots.txt`, `sitemap.xml`. |
| SEO | Client-side SPA. `SEOHead` mutates `document.title`/meta tags in `useEffect`. All canonicals hardcode `https://adlogix.agency`. |

### Blocking / high-priority issues found (outside the migration itself)

1. **`.env` is committed to git and not ignored.** `.gitignore` has no `.env` rule (`git ls-files` shows `.env`). Its contents were deliberately **not** read during this inspection. Someone with access should check it for secrets; if any exist, rotate them and remove the file from history. Fix going forward: ignore `.env*` (except `.env.example`) and `git rm --cached .env`.
2. **`.env.example` is tracked** — correct, it's the template others need. It must stay un-ignored when `.env*` rules are added.
3. **`dist/` is committed** although `.gitignore` lists `dist` (it was committed before the rule). Rebuilding locally produces diffs in tracked files. Decide whether the deploy relies on committed `dist/`; if not, untrack it.
4. **Deep links return 404 on the live site.** `https://adlogix.in/` → 200, but `/about`, `/contact`, `/blog/<slug>` → `404 nginx/1.31.6`. The React container's nginx lacks an SPA fallback (`try_files $uri /index.html`). In-app navigation works; refreshes, shared links, and crawlers fail. This is a VPS/container config fix (not done here, per the rules) and matters a lot for WordPress-driven detail pages.
5. **Plugin exposes the WordPress admin email publicly.** `GET /wp-json/adlogix/v1/settings` returns `contact.email` from `get_option('admin_email')` — currently a personal address. It should come from a dedicated public option instead.
6. **Plugin CORS reflects any `Origin` with `Access-Control-Allow-Credentials: true`.** Verified live with `Origin: http://localhost:3000`. Since the frontend is same-origin (`adlogix.in`), this should be restricted to an allow-list (production + local dev origins).
7. **Enquiry endpoint** `POST /adlogix/v1/enquiry` is public with only a honeypot — no rate limiting / nonce / captcha. Acceptable for now, but expect spam once it is live.

---

## 1. Page routes

Defined in `src/App.jsx` (React Router `BrowserRouter`, single `Layout` wrapper, `CMSProvider` around everything):

| Route | Component | Data source today |
|---|---|---|
| `/` | `HomePage` | 13 section components (see §4) |
| `/about` | `AboutPage` | `team`, `settings` + hardcoded copy |
| `/services` | `ServicesPage` | `services` + hardcoded hero/filters |
| `/services/:slug` | `ServiceDetailPage` | `services.find(slug)` → redirect `/services` if missing |
| `/work` | `WorkPage` | `projects` + `projectCategories` (direct import) |
| `/work/:slug` | `ProjectDetailPage` | `projects.find(slug)` → redirect `/work` |
| `/reels` | `ReelsPage` | `reels` + `reelCategories` (direct import) |
| `/industries` | `IndustriesPage` | `industries` |
| `/industries/:slug` | `IndustryDetailPage` | `industries.find(slug)` → redirect `/industries` |
| `/testimonials` | `TestimonialsPage` | `testimonials` |
| `/blog` | `BlogPage` | `blogs` + `blogCategories` (direct import) |
| `/blog/:slug` | `BlogPostPage` | `blogs.find(slug)` → redirect `/blog` |
| `/contact` | `ContactPage` | `settings.contact`, form → `api.submitEnquiry` |
| `/privacy-policy` | `PrivacyPolicyPage` | fully hardcoded |
| `/terms` | `TermsPage` | fully hardcoded |
| `*` | `NotFoundPage` | hardcoded |

**Detail-page risk:** all four detail pages redirect immediately when `find()` returns nothing, without checking a loading state. Today that's harmless because static data is the initial state. Once data comes only from WordPress, a direct visit to `/services/seo-optimization` would redirect to `/services` before the fetch resolves. Detail pages need a loading state before any fallback removal.

---

## 2. Hardcoded text that should become WordPress-managed

### 2a. Collection data in `src/data/` (best candidates — already structured)

| File | Export | Items | Fetched by `api.js` today | WP endpoint `api.js` expects | Exists on live WP? |
|---|---|---|---|---|---|
| `servicesData.js` | `servicesData` | 14 | yes | `/wp/v2/services` | CPT yes, **0 items** |
| `servicesData.js` | `servicesCategories` | 2 | no (direct import) | — | no |
| `projectsData.js` | `projectsData` | 5 | yes | `/wp/v2/projects` | CPT yes, **0 items** |
| `projectsData.js` | `projectCategories` | 6 strings | no | — | no |
| `reelsData.js` | `clientReelsData` | 8 | yes | `/wp/v2/reels` | CPT yes, **0 items** |
| `reelsData.js` | `reelCategories` | 5 strings | no | — | no |
| `testimonialsData.js` | `testimonialsData` | 4 | yes | `/wp/v2/testimonials` | CPT yes, **0 items** |
| `industriesData.js` | `industriesData` | 8 | yes | `/wp/v2/industries` | CPT yes, **0 items** |
| `blogsData.js` | `blogsData` | 4 | yes | `/wp/v2/posts` | core, **1 item (`hello-world`)** |
| `blogsData.js` | `blogCategories` | 5 strings | no | — | could be WP categories |
| `clientsData.js` | `clientsData` | 10 | yes | `/adlogix/v1/clients` | **route does not exist** (404 → fallback) |
| `teamData.js` | `teamData` | 4 | yes | `/adlogix/v1/team` | **route does not exist** |
| `pricingData.js` | `growthPlansData` | 1 obj / 3 plans | **no** | — | no |
| `siteSettings.js` | `defaultSiteSettings` | 1 obj | yes | `/adlogix/v1/settings` | exists, but **response is ignored** (see §6) |

### 2b. Inline content inside components (not in data files)

Home page sections (all headings = badge + title + highlightWord + subtitle):

| Component | Hardcoded content |
|---|---|
| `HeroSection` | Top badge ("GUJARAT & INDIA'S PREMIER DIGITAL AGENCY • POWERED BY AUMENTO"), 4-line headline ("WE DON'T JUST GET / ATTENTION. / WE GROW YOUR / BUSINESS."), 6 rotating specializations, 2 supporting paragraphs, partner trust line, 2 CTA labels ("Grow My Business" → `/contact`, "Book Strategy Call"), 4 metrics (500+ Clients Served, 200+ Verified Influencers, 6+ Years Experience, 99% Satisfaction Rate). |
| `ReelShowcase` | Section heading, helper text, CTA "Explore All Client Creative Productions" → `/reels`. |
| `StudioSection` | **Fully static**: heading, 8 studio shoots (`{id,title,category,image,location}` with Unsplash images), 8-item "Perfect For" ticker, CTA "Book Studio Shoot". |
| `BrandMarquee` | Label "Brands We've Had the Pleasure of Working With". |
| `ServicesOverview` | Heading, bottom callout (title + paragraph + "Custom Scope Proposal"). |
| `FeaturedProjects` | Heading, "Watch Creative Reel", "Read Case Study", bottom CTA. |
| `IndustriesSection` | Heading, bottom CTA. |
| `WhyAdlogix` | Heading + **6 differentiators** `{icon, title, desc}` (icons are lucide components inline). |
| `ProcessTimeline` | Heading + **5 steps** `{number, icon, title, desc}` (icons inline). |
| `GrowthPlansSection` | H2 "Choose Your Growth Plan" (hardcoded even though data has `title`), billing labels, "Save 10% / 20%", help callout. |
| `VideoTestimonials` | Heading, "Watch Video Story". |
| `AumentoCredibility` | Badge, H2, extra paragraph, card copy, "Visit Aumento Infoway". Ignores `poweredBy.badgeText`. |
| `InsightsSection` | Heading, "Explore All Insights". |
| `ClosingCTA` | Pill, H2, paragraph, 5 quick-start `<option>`s, "Start Project", discovery link, 3 trust badges. |

Inner pages:

| Page | Hardcoded content |
|---|---|
| `AboutPage` | Hero (badge, 2-line H1, subtitle), story section (eyebrow, H2, 2 paragraphs, 2 stat cards: 100% / 3.9x), story image (Unsplash), partner block, team heading, CTA block. |
| `ServicesPage` | Hero, 3 filter labels, CTA block. |
| `ServiceDetailPage` | Section eyebrows/H2s, a generic deliverable caption repeated on every item, tech-stack note, CTA texts. |
| `WorkPage` | Hero, search placeholder, empty state, CTA. |
| `ProjectDetailPage` | Narrative section H2s identical for every project ("Breaking Through the Acquisition Ceiling", etc.), labels, CTA. |
| `ReelsPage` | Hero, 4 studio feature stats (4K Cinema, Macro Studio, 3-Sec Hooks, 12M+ Views), CTA mentioning Ahmedabad studio. |
| `IndustriesPage` / `IndustryDetailPage` | Hero, labels, generic service caption, CTA. |
| `TestimonialsPage` | Hero, CTA. |
| `BlogPage` / `BlogPostPage` | Hero, labels, CTA. |
| `ContactPage` | Hero, form labels/placeholders, **8 service options** and **5 budget ranges** (not linked to the services CPT), success message, discovery card, "Agency Coordinates" labels. |
| `PrivacyPolicyPage` | 5 prose sections + "Last Updated" + hardcoded `privacy@adlogix.agency`. |
| `TermsPage` | 5 prose sections + "Last Updated" (breadcrumb says "Terms & Conditions", H1 says "Terms of Service"). |
| `NotFoundPage` | Should stay static. |

Layout:

| Component | Hardcoded content |
|---|---|
| `Header` | Desktop nav **is** data-driven (`settings.navigation`). Brand text, "Book Call", "Let's Talk" hardcoded. |
| `MegaMenu` | Driven by `settings.navigation[].subcategories`; bottom bar text hardcoded. |
| `MobileNav` | **Entire menu hardcoded** — does not read `settings.navigation`, so it already differs from desktop (fewer service links). |
| `Footer` | Tagline, partner box, 3 link columns (18 links, hardcoded service slugs), copyright line. Contact email/phone and 3 socials come from `settings`. |
| `DiscoveryModal` | All copy, 5 goal options, 4 budget options, success text (claims a calendar invite is sent — it isn't). |

---

## 3. Hardcoded images and media

All media is hotlinked; nothing is stored in the repo.

| Host | Unique assets | Where |
|---|---|---|
| `images.unsplash.com` | 35 | `projectsData` (21 refs), `reelsData` (8), `blogsData` (8), `industriesData` (8), `teamData` (4), `testimonialsData` (4), `StudioSection.jsx` (8), `AboutPage.jsx:94` (1), `SEOHead.jsx` default OG image (1), `api.js` normalizer fallbacks (3) |
| `assets.mixkit.co` (preview MP4) | 6 | `projectsData` (5), `reelsData` (8), `testimonialsData` (4) — clips reused and mismatched to titles; preview hotlinks are not a stable source |
| Local | `favicon.svg` | `index.html`, JSON-LD logo `https://adlogix.agency/favicon.svg` |
| Missing | `/og-image.jpg`, `/logo.svg` | Referenced in `index.html` meta/JSON-LD but **not present** in `public/` |

There is no image logo anywhere; the "A" logo is CSS + text in `Header`, `Footer`, `MobileNav`, `PageLoader`.

Migration target: images uploaded to the WordPress Media Library, referenced by `source_url` + `alt_text` from REST. Videos either uploaded to WP Media or a stable CDN URL stored in a URL field.

---

## 4. Sections that should probably become WordPress content

Prioritized by editor value vs. migration risk:

| Priority | Content | Suggested WP model | Notes |
|---|---|---|---|
| High | Blog posts | Core **Posts** + Categories/Tags + featured image | Native WP; `api.js` normalizer already exists. Needs `read_time`/`author_role` meta (optional). |
| High | Legal pages (Privacy, Terms) | Core **Pages** (`privacy-policy`, `terms`) | Long-form prose; perfect fit for the block editor. No plugin/ACF changes needed. |
| High | Services | Existing **`services` CPT** | 14 items; needs fields: category, icon, highlights, deliverables, technologies, faqs. |
| High | Projects / case studies | Existing **`projects` CPT** | ACF group exists but is incomplete (no results, year, category_label, services_delivered, testimonial, gallery). |
| High | Reels | Existing **`reels` CPT** | ACF group exists; missing `description`, `tags`. |
| High | Testimonials | Existing **`testimonials` CPT** | No field group defined yet. |
| High | Industries | Existing **`industries` CPT** | No field group defined yet. |
| Medium | Site settings (contact, socials, partner info) | Existing `/adlogix/v1/settings` endpoint | Fix admin-email leak; back fields with a settings page/options. |
| Medium | Homepage section copy (hero, headings, metrics, CTAs) | Core **Page** with slug `home` + fields | Single editable page rather than a new CPT. |
| Medium | About page copy | Core **Page** with slug `about` + fields | |
| Medium | Team members | New CPT `team` *or* repeater on the About page | `/adlogix/v1/team` is called but doesn't exist. |
| Medium | Client logos (marquee) | New CPT `clients` *or* repeater on settings | `/adlogix/v1/clients` is called but doesn't exist. Currently text-only logos. |
| Medium | Growth plans / pricing | Repeater on a settings/options page, or CPT `plans` | Nested pricing structure (monthly/quarterly/annual). Requires careful validation (component crashes on missing keys). |
| Low | Studio shoots gallery | Gallery field on `home` page or a `studio` page | 8 items. |
| Low | Why Adlogix (6), Process (5) | Repeaters on `home` page | Icons must become icon-name strings mapped through `DynamicIcon`. |
| Low | Navigation (desktop + mobile + footer) | WP Menus (`/wp/v2/menu-items` requires auth by default) or a settings field | Nav is structural; recommend keeping static until later. |
| Low | Contact/discovery form option lists | Settings field | Could derive service options from the services CPT. |

---

## 5. Reusable content structures (implied content model)

These are the frontend shapes components already consume. Normalizers must output exactly these.

- **Service**: `id, slug, title, icon (DynamicIcon name), category ('marketing-creative'|'web-it'), categoryTitle, shortDesc, fullDesc (HTML), highlights[], deliverables[], technologies[], faqs[{q,a}]`
- **Project**: `id, slug, title, client, industry, year, category, categoryLabel, heroImage, thumbnail, videoReelUrl, overview, challenge, strategy, execution, results[{value,label,sub}], servicesDelivered[], gallery[], testimonial{quote,author,role}`
- **Reel**: `id, title, client, category, aspectRatio, duration, views, ctr, thumbnail, videoUrl, description, tags[]`
- **Testimonial**: `id, clientName, role, company, industry, rating, videoThumbnail, videoUrl, quote, result, projectSlug`
- **Industry**: `id, slug, name, icon, heroImage, shortDesc, keyMetrics, challenges[], solutions[], relevantServices[]`
- **Blog post**: `id, slug, title, excerpt, category, readTime, publishedDate (display string), featuredImage, author{name,role,avatar}, tags[], content (HTML)`
- **Team member**: `name, role, bio, image, linkedin`
- **Client**: `name, sector, logoText`
- **Growth plans**: `badge, title, highlightWord, subtitle, disclaimer, plans[{id,name,tagline,isPopular,popularBadge,pricing{monthly,quarterly,annual}{price,period,total?,billingNote?},metrics[{value,label}],features[],ctaText}]`
- **Site settings**: `brandName, tagline, poweredBy{text,partnerName,url,description,badgeText,showBadge}, contact{email,supportEmail,phone,intlPhone,address,city,workingHours,calendlyUrl}, socials{instagram,linkedin,twitter,facebook,youtube}, navigation[], cta{}`
- **Section heading** (repeated ~20×): `badge, title, highlightWord, subtitle` — consumed by `SectionHeading`.

Shape-sensitive logic to protect during migration:

- `FeaturedProjects` / `WorkPage`: `p.categoryLabel.includes(...)` — crashes if `categoryLabel` is missing.
- `WorkPage` search: `client`, `industry` required (no optional chaining).
- `BlogPage` search: `title`, `excerpt`, `category` required.
- `GrowthPlansSection`: `plan.pricing[billingCycle].price` — crashes if any cycle is missing.
- Reel/project filters compare `category` to the category arrays **exactly** (string match).
- `SEOHead`: crashes if `title` is undefined.
- `VideoModal` reads `videoUrl`; project objects use `videoReelUrl` (pages remap it — keep that).

---

## 6. Existing WordPress / API-related code

### `src/services/api.js`
- `WP_API_URL = import.meta.env.VITE_WP_API_URL || 'https://cms.adlogix.agency/wp-json'`
- `ENABLE_WP_SYNC = import.meta.env.VITE_ENABLE_WP_SYNC === 'true'`
- `fetchWP(endpoint, fallback)`: 4s `AbortController` timeout, `Accept: application/json`, warns and returns fallback on any error.
- **Bug:** `return Array.isArray(data) && data.length > 0 ? data : fallbackData;` — any **object** response (e.g. `/adlogix/v1/settings`) is discarded, so WP settings can never take effect.
- **Risk:** for posts, the single `hello-world` post would *replace* all 4 static blog posts the moment sync is turned on (array is non-empty). Same will happen for any CPT as soon as one test item is published.
- Normalizers exist for services, projects, reels, testimonials, industries, posts. They read `item.acf.*` field names that are **mostly not defined** in `acf-export.json`. Several insert Unsplash fallback images. No HTML entity decoding of `title.rendered` (e.g. `&#8217;` would render literally).
- `submitEnquiry`: POSTs to `/adlogix/v1/enquiry` when sync is on; otherwise (or on failure) **fakes success** after 800 ms. A failed submission is reported to the user as success — leads can be silently lost.

### `src/context/CMSContext.jsx`
- Initial state = static data, then one `Promise.all` over 9 API calls on mount. All-or-nothing; no per-section loading/error state. `isLoading` is exposed but unused by any component.
- Also hosts global modal state (video + discovery) — unrelated to CMS; keep.

### `wordpress/adlogix-headless-core.php` (active on live site)
- Registers CPTs `services`, `projects` (rewrite `work`), `reels`, `testimonials`, `industries`, all `show_in_rest: true`, supporting `custom-fields`.
- `rest_api_init`: CORS override (see issue #6), routes `GET /adlogix/v1/settings`, `POST /adlogix/v1/enquiry`, and a `featured_media_url` REST field on posts + all CPTs (confirmed present on live `posts` response).
- `get_site_settings()` uses `get_option()` with hardcoded defaults; `contact.email` = `admin_email` (issue #5). Only returns a subset of what the frontend needs (no `navigation`, `cta`, `facebook`, `youtube`, `supportEmail`, `badgeText`, ...).
- **No `register_post_meta` / `register_rest_field` for any custom field** — so plain custom fields are not exposed in REST either.

### `wordpress/acf-export.json`
- `group_reels_fields` (reels): client, category, aspect_ratio, duration, views, ctr, video_url, thumbnail (image → url).
- `group_project_fields` (projects): client_name, industry, category, hero_image, video_url, overview, challenge, strategy, execution.
- README claims a "Global Settings" group is included — **it is not**.
- Neither group sets `"show_in_rest": 1`, so even if imported, ACF ≥ 5.11 would not add them to REST responses.

### `wordpress/README.md`
- Documents `VITE_WP_API_URL=https://cms.adlogix.agency/wp-json` — outdated for `adlogix.in`.

### Live API verification (2026-10-15)

```
GET https://adlogix.in/wp-json/
  namespaces: oembed/1.0, adlogix/v1, wp/v2, wp-site-health/v1, wp-block-editor/v1, wp-abilities/v1
GET /wp/v2/pages         → X-WP-Total: 0
GET /wp/v2/posts         → X-WP-Total: 1  (hello-world)
GET /wp/v2/services      → 0     GET /wp/v2/projects → 0
GET /wp/v2/reels         → 0     GET /wp/v2/testimonials → 0
GET /wp/v2/industries    → 0     GET /wp/v2/media → 0
GET /adlogix/v1/settings → 200 (object; contains admin email)
GET /adlogix/v1/team     → route not registered
GET /adlogix/v1/clients  → route not registered
Post response keys: id, date, slug, status, type, link, title, content, excerpt, author,
  featured_media, ..., meta, categories, tags, featured_media_url, _links   (no `acf`)
CORS: Access-Control-Allow-Origin reflects request Origin; Allow-Credentials: true
```

---

## 7. Assumptions about custom post types and ACF fields

1. **ACF availability is unverified.** No `acf` key in responses, but there's also no content to attach fields to. Need admin confirmation of: ACF installed? Free or Pro? Version?
2. **Repeaters/galleries need ACF Pro.** `faqs`, `results`, `highlights`, `deliverables`, `technologies`, `challenges`, `solutions`, `gallery`, plan features, etc. are lists. With ACF Free, alternatives are: one-item-per-line textarea fields (split in the normalizer), or `register_post_meta` with `type: array` + `show_in_rest` schema in the plugin (no ACF needed, but editing UX is poor without a custom meta box).
3. **Preferred REST exposure:** ACF field groups with `"show_in_rest": 1` (adds `acf` object to `/wp/v2/<type>` responses). Fallback option: plugin-side `register_rest_field` producing a clean `fields` object. Either way, it must be verified against a real published item before the frontend relies on it.
4. **No new post types are assumed** beyond what the code already calls for. `team` and `clients` are referenced by `api.js` but do not exist; whether they become CPTs, repeaters on a page, or stay static is a decision to make (see §4) — not implemented silently.
5. **Homepage/About copy** is assumed best modelled as fields on core Pages (`home`, `about`), not new CPTs.
6. **Blog categories** are assumed to map to core WP Categories (names matching `blogCategories`).
7. **Slugs must match existing frontend slugs** (e.g. `seo-optimization`, `headless-wordpress`) because Footer/MegaMenu/MobileNav hardcode service URLs.

---

## 8. Code that should remain static (React-owned)

- **Layout & structure:** `Layout`, `Header`/`MegaMenu`/`MobileNav` behavior, `Footer` structure, route definitions, `PageLoader`, page transition animations.
- **Reusable UI:** `Button`, `Badge`, `Breadcrumb`, `SectionHeading`, `VideoModal`, `DiscoveryModal` (behavior), `DynamicIcon` (icon registry — WP sends only icon *names* from its 26-name allow-list).
- **Styling:** all Tailwind classes, `src/styles/index.css`, `tailwind.config.js`, decorative SVGs/gradients/3D shapes in `HeroSection`, brand "A" logo.
- **Behavioral logic:** filters, search, billing-cycle switcher, carousels/marquees, modals, form validation, honeypot.
- **UI microcopy** (button verbs, aria-labels, empty states, form labels, 404 page) — keep static unless editors specifically need control.
- **Global SEO defaults in `index.html`** — keep as-is (see §9).
- **Navigation** — recommended static for now (structural, tied to route slugs).

---

## 9. SEO and rendering

- Pure client-side SPA (`createRoot`, no SSR/prerender). Crawlers that don't execute JS see only `index.html` metadata.
- `SEOHead` updates title/description/OG/canonical/JSON-LD at runtime. Canonicals and JSON-LD used to hardcode `https://adlogix.agency` while the live domain is `https://adlogix.in`. **Resolved:** every canonical, JSON-LD URL, `index.html` meta, `robots.txt`, `sitemap.xml` and contact/social default now uses `adlogix.in`. The canonicals are still written out per page rather than derived from `VITE_SITE_URL`.
- Combined with the deep-link 404 issue, inner pages currently have effectively no crawlable presence. WordPress-driven metadata would also be client-side only; it does **not** provide server-side SEO. Proper SEO would require prerendering/SSR (separate project).

---

## 10. Recommended plan (small, reviewable steps)

| Step | Change | WP changes needed |
|---|---|---|
| 1 | Env config: add `VITE_WORDPRESS_API_URL=https://adlogix.in/wp-json` (keep reading the legacy `VITE_WP_API_URL` as a fallback), fix `.env.example`, untrack `.env`. Build check. | none |
| 2 | Add `src/api/client.js` (URL builder, timeout, JSON parsing, typed errors, in-memory cache + request de-dup), `src/api/wordpress.js` (endpoint functions), `src/api/normalizers.js` (HTML entity decode, media extraction, page/post normalizers), `src/hooks/useWordPressData.js` (`{data, status, error}` with loading/empty/error). Not wired to any component yet. Existing `services/api.js` + `CMSContext` left untouched. | none |
| 3 | **Pilot:** Privacy Policy page from `GET /wp/v2/pages?slug=privacy-policy` (core Pages, rendered HTML). Static content stays as the fallback; dev-only warning on failure. | Create one Page in WP admin |
| 4 | Loading/empty/error states for the pilot; then apply the same to Terms. | Create one Page |
| 5 | Plugin hardening PR: CORS allow-list, public contact email option, REST exposure of fields (`show_in_rest` field groups or `register_rest_field`). Then migrate collections one at a time: Blog → Services → Industries → Projects → Reels → Testimonials, then settings, then homepage/about copy. | Per type, documented before implementation |
| 6 | Remove static fallbacks only after each WP-driven version is verified. | — |

Why the legal page first: it uses only core WordPress (no ACF/plugin dependency), carries no layout risk, exercises the full path (env → client → normalizer → hook → loading/error/fallback), and is the content most naturally edited in WordPress's own editor. Homepage hero is a reasonable alternative but needs a field model on a `home` page first.
