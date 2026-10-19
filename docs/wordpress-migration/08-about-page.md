# Dynamic page: About

Status: all five About sections read their text from WordPress. Section order and visibility come from the "Page Sections" box (see `03-page-sections.md`).

The static copy now lives in one place, `aboutDefaults` in `src/content/about.js`. It is the safety fallback for when WordPress can't be reached, not test code, and stays in the codebase.

**WordPress is the only source once the page has content.** If the About page returns its ACF fields, every value comes from WordPress. A cleared field stays cleared, and the element it feeds is not rendered (no empty heading, paragraph, button or wrapper). The static copy is used only as a whole: while the request is loading, when the request fails, or when the page or its fields don't exist.

## Summary

| Item | Value |
|---|---|
| WordPress content type | Core **Page** |
| WordPress slug | `about` (page ID **310** on the live site) |
| Field group | `About Page Content` (`group_adlogix_page_about`), file `wordpress/acf/page-about.json`, ACF Free compatible, one tab per section |
| API endpoint | `GET {VITE_WORDPRESS_API_URL}/wp/v2/pages?slug=about&_fields=id,slug,title,modified,acf,adlogix_sections&acf_format=standard` |
| API function | `api.getPage('about')` in `src/services/api.js` |
| Content model | `aboutDefaults` + `mapAboutFields(acf)` in `src/content/about.js`, registered in `src/content/index.js` |
| Hook | `usePageContent('about')` → `{ content, order, status }` |
| Page component | `src/pages/AboutPage.jsx` → `<PageSections>` |
| Section registry | Already present in `get_section_registry()` — **no plugin change was needed** |
| Gated by `VITE_ENABLE_WP_SYNC`? | No |

## Fields by tab

All fields are optional. A blank field hides the text, image or button it feeds. When a section has nothing left to show, the whole section is hidden. To hide a section on purpose, untick it in the "Page Sections" box instead of clearing its fields. Fixed numbered groups (Metric 1–2, Member 1–8) stand in for repeatable items, because ACF Free has no repeater.

| Tab (section key) | Fields | Notes |
|---|---|---|
| Hero (`hero`) | `hero_badge_text`, `hero_headline_line_1`, `hero_headline_highlight_1`, `hero_description` | `hero_headline_highlight_1` is the second line, shown in the blue gradient. Either headline line may stand alone. |
| Mission & Story (`story`) | `story_eyebrow`, `story_title`, `story_paragraph_1`, `story_paragraph_2`, `story_metric_1..2` {value, label}, `story_image` | A metric needs a value; its label is optional. **Without `story_image` the text column spans the full width** instead of leaving a gap. |
| Technology Partner (`partner`) | `partner_badge`, `partner_title`, `partner_text`, `partner_highlight`, `partner_cta_label`, `partner_cta_link_type` / `_page` / `_url` | `partner_highlight` is the words **inside `partner_text`** to show in bold — it must match exactly, otherwise nothing is bolded. The button needs a label and a link. |
| Leadership Team (`team`) | `team_badge`, `team_title`, `team_highlight`, `team_subtitle`, `team_member_1..8` {name, role, photo, bio, linkedin} | **A member needs a name and a photo**; without either the card is dropped. Role, bio and LinkedIn are optional. With no members at all the section is hidden, heading included. |
| Closing CTA (`cta`) | `cta_title`, `cta_text`, `cta_primary_label`, `cta_primary_link_type` / `_page` / `_url`, `cta_secondary_label` | The primary button needs a label and a link. The secondary button opens the "Book a Discovery Call" form, so it has a label only — blank hides it. |

`team_highlight` must match part of `team_title` exactly; that part gets the accent colour. If it doesn't match, the title shows without a highlight.

### Why the team lives on the page, not in a post type

The team was the one section with no editable source at all: `api.getTeam()` calls `/adlogix/v1/team`, an endpoint the plugin never registered, so the cards could only ever render `src/data/teamData.js`. Leadership is About-page content, so the members are numbered groups in `page-about.json` — the same approach as `studio_shoot_1..8` on the homepage. This needs no new post type and no plugin version bump. If team members are ever needed on other pages, promoting them to a sixth collection (CPT + "Show on") would be the next step; see `04-collections.md`.

### Button links (Page / Custom link)

Two buttons use the shared Page/Custom link trio documented in `02-home-page.md`: prefixes `partner_cta` and `cta_primary`. React maps them with `link(fields, prefix)` (`src/content/helpers.js`).

- The Technology Partner button renders with `SmartLink`, and defaults to **Custom link** → `https://aumentoinfoway.com/`.
- The Closing CTA primary button keeps the `Button` styling, so it picks `to` vs `href` with `toRouterPath()` from `SmartLink`: site paths go through the router, another website opens in a new tab. It defaults to **Page** → Contact.

Links that are neither a site path nor an `http(s)` URL are treated as blank, so the button that needs them is hidden.

Text that is part of the interface rather than the content stays in React: the "Connect on LinkedIn" label and the section layout.

## Behavior when content is missing

| Situation | What renders | Logging |
|---|---|---|
| Request in flight | Defaults | none |
| Page `about` not found | All defaults, default section order | Dev: `console.warn` |
| Page found, field group not assigned / no fields (`acf: []`) | All defaults | none |
| Page found with fields, some blank | WordPress values only; blank elements are hidden | none |
| Page found with fields, all of a section blank | That section is hidden | none |
| Network error, timeout (8 s), HTTP error, non-JSON, missing env var | All defaults, default order | Dev: `console.warn`; **Production: `console.error`** |

An outage never blanks the page, because the defaults are used as a whole.

## WordPress admin setup

1. **Custom Fields → Tools → Import Field Groups**: upload `wordpress/acf/page-about.json`. Check that "Show in REST API" is on for **About Page Content**.
2. Open **Pages → About**. The five tabs are pre-filled with the current site text; change what you want and click **Update**.
3. **Upload a Story image and a photo for each team member.** Images can't have a default value, so until they are uploaded the story visual is hidden and the team cards are dropped — the site falls back to nothing for those, not to the old Unsplash pictures.
4. Verify `https://adlogix.in/wp-json/wp/v2/pages?slug=about&_fields=id,acf,adlogix_sections`.

### If the field group doesn't appear on the page

The group is bound to the About page by ID (**310**), matching the live site. If the About page is ever recreated with a different ID, open **Custom Fields → About Page Content → Location Rules** and re-pick *Page is equal to About*.

## How to test

1. `.env.local` (git-ignored): `VITE_WORDPRESS_API_URL=https://adlogix.in/wp-json`, then `npm run dev`.
2. Change one field per tab in WordPress, reload `http://localhost:3000/about`, and confirm each change. The cache only lives in the open tab, so a full reload always fetches fresh content.
3. Clear a field (for example the hero badge), update, reload, and confirm that element disappears with no empty gap or placeholder.
4. Clear the Story image and confirm the text spans the full width.
5. Clear a team member's name or photo and confirm only that card goes; clear all eight and confirm the whole section goes, heading included.
6. Set the Technology Partner button to **Page → Services** and confirm it opens without a page reload; set it back to the Aumento URL and confirm it opens in a new tab.
7. Error path: point `VITE_WORDPRESS_API_URL` at a wrong path, restart, and confirm the page still renders fully.
8. `npm run build` must succeed.
