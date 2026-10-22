# Plain pages: legal pages and anything new

Some pages are just a title and a body — no sections, no field group. The Privacy Policy and Terms pages work that way, and so does **any page you create in WordPress from now on**.

## Summary

| Item | Value |
|---|---|
| Source | The page's own **content editor** (`post_content`), not ACF |
| API | `api.getPage(slug)` — `_fields` now includes `content` and `excerpt` |
| Component | `src/pages/DocumentPage.jsx` |
| Routes | `/privacy-policy`, `/terms`, and the catch-all `/:slug` |
| Gated by `VITE_ENABLE_WP_SYNC`? | No |

## Create a page, get a page

Publish a page in WordPress and it is live at its slug. Nothing to import, nothing to deploy:

```
Pages → Add Page → "Refund Policy", slug `refund-policy` → type the body → Publish
                                    ↓
                        https://adlogix.in/refund-policy
```

The catch-all route sits **below** every fixed route, and React Router matches static paths before dynamic ones, so `/about`, `/services`, `/contact` and the rest keep their own templates. A slug that doesn't exist in WordPress shows the themed 404.

This only covers simple documents. A page that needs a designed layout still gets its own React route and field group, as the main pages do.

## The legal pages

`/privacy-policy` and `/terms` use the same component with their own SEO metadata and a built-in copy of the text:

| Situation | What renders |
|---|---|
| WordPress body has content | That content |
| Body empty, request loading, or WordPress unreachable | The built-in copy in `PrivacyPolicyPage.jsx` / `TermsPage.jsx` |

A legal page must never render blank, which is why those two keep a fallback while a newly created page does not — an unknown page with no body is simply a 404.

Headings, lists, links and bold text from the editor are styled by the page's `prose` classes, so WordPress formatting comes through without extra work.

## A note on rendering the editor body

The body is inserted with `dangerouslySetInnerHTML`. That is deliberate: page content is written by signed-in editors and sanitized by WordPress on save, the same trust boundary as every other field this site reads. It is not visitor-supplied input.

If you ever let untrusted users author pages, this is the line to revisit.

## What was wrong before

`normalizePage()` already extracted `content`, but `api.getPage()` never asked for it — `_fields` listed only `id,slug,title,modified,acf,adlogix_sections`. So the body was always an empty string, and the legal pages could only ever show their hardcoded copy. Both `content` and `excerpt` are now requested.

## How to test

1. Edit the Privacy Policy body in WordPress, reload `/privacy-policy`, and confirm the change.
2. Empty the body, reload, and confirm the built-in copy appears rather than a blank page.
3. Create a new page, give it a slug, publish, and open that slug — it should render.
4. Open a slug that does not exist and confirm the themed 404.
5. Confirm `/about` and `/services` still show their own templates, not the plain document layout.
6. `npm run build` must succeed.
