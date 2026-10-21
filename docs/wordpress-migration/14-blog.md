# Dynamic pages: Insights listing + article pages

Status: the blog reads entirely from WordPress — the articles are ordinary **Posts**, and every label around them is editable. URLs are `/blog` and `/blog/<slug>` (see `06-spa-routing.md`).

## Three places, three kinds of content

| What | Edited in |
|---|---|
| The articles themselves | **Posts** — title, excerpt, body, featured image, categories, tags, author, date |
| Two extras per article | **Posts → Article Details** (`post-type-posts.json`) |
| Every label around them | **Pages → Insights** (`page-blog.json`) |

## Summary

| Item | Value |
|---|---|
| WordPress page | The Insights page, **slug `blog`**, ID **501** |
| Field groups | `Blog Page Content` (`group_adlogix_page_blog`), `Article Details` (`group_adlogix_post`) |
| Articles | `GET /wp/v2/posts?per_page=50&_embed=wp:term,wp:featuredmedia,author` |
| Normalizer | `normalizeBlogPost` in `src/services/blog.js` |
| Content model | `blogDefaults` + `mapBlogFields` in `src/content/blog.js` |
| Page components | `src/pages/BlogPage.jsx`, `src/pages/BlogPostPage.jsx` |
| Gated by `VITE_ENABLE_WP_SYNC`? | **No** (changed — posts used to be gated) |

**The page slug must be `blog`.** The page was created as "Insights" with slug `insights`; change its permalink to `blog` so the field group and `usePageContent('blog')` find it. The title can stay "Insights", and nothing on the frontend depends on the slug.

## What comes from the Post itself

No ACF needed for any of this:

| On the page | Where you set it |
|---|---|
| **Topics: #tag #tag** | The post's **Tags** |
| Category badge, filter pill, breadcrumb | The post's **Categories** — the first one that isn't "Uncategorized" |
| Featured image on the card and article header | **Featured image** |
| Title, excerpt, body | Title, Excerpt, editor |
| Date | Publish date |
| Author name and avatar | The WordPress user; avatar from Gravatar |

If the **Tags** or **Excerpt** boxes are missing from the edit screen, enable them under **Screen Options**.

Blank-field behaviour: the whole **Topics** row is hidden when a post has no tags, and a post with no featured image renders without one instead of a broken image. A post with no title or slug is skipped entirely.

### Article Details (the two optional extras)

| Field | Blank behaviour |
|---|---|
| `read_time` | Estimated from the article length, about 200 words a minute |
| `author_role` | Falls back to "Growth Strategist" |

## Fields by tab (Pages → Insights)

| Tab (section key) | Fields |
|---|---|
| Hero (`hero`) | `hero_badge_text`, `hero_headline_line_1`, `hero_headline_highlight_1`, `hero_description` |
| Articles (`articles`) | `articles_all_label`, `articles_search_placeholder`, `articles_featured_badge`, `articles_read_label`, `articles_card_read_label`, `articles_empty_title` |
| Single Post Pages (`detail`) | `detail_breadcrumb_label`, **`detail_topics_label`**, `detail_related_title`, `detail_related_link_label`, `detail_related_read_label`, `detail_cta_title`, `detail_cta_text`, `detail_cta_button_label` |

Blank behaviour: clearing `articles_all_label` hides the whole pill row, `articles_search_placeholder` hides the search box, `articles_featured_badge` hides the badge on the lead card, and the closing CTA disappears when its three fields are empty.

## Category pills follow the posts

The pills used to come from a hardcoded list in `src/data/blogsData.js`, so a category created in WordPress got no pill, and pills showed for categories with no posts.

They are now built with `presentCategories()` — the same helper the Work and Reels pages use — from the categories the published posts actually use. Create a category in WordPress, assign a post to it, and its pill appears on its own. The hardcoded list only fixes the display order of the categories it knows.

## Behavior when content is missing

| Situation | What renders |
|---|---|
| Page `blog` not found, or no fields | All label defaults |
| No published posts, or the request fails | Built-in list from `src/data/blogsData.js` |
| Published posts | Only those posts |
| A search matches nothing | `articles_empty_title` |
| Network error, timeout, missing env var | Built-in list (dev: `console.warn`, production: `console.error`) |

## WordPress admin setup

1. **Pages → Insights → permalink → Edit**: change the slug to `blog`.
2. **Custom Fields → Tools → Import Field Groups**:
   - `wordpress/acf/page-blog.json` — bound to page ID 501.
   - `wordpress/acf/post-type-posts.json` — adds **Article Details** to Posts.
3. **Settings → Permalinks → Custom Structure**: `/blog/%postname%/`, so an admin "View Post" link matches the React URL (`06-spa-routing.md`).
4. **Appearance → Menus → Primary**: point the Insights item at `/blog/`.
5. Add **Tags** to your posts — that is the Topics row.

## How to test

1. `npm run dev`, open `http://localhost:3000/blog`.
2. Add two tags to a post and confirm the Topics row appears on `/blog/<slug>`.
3. Create a new category, assign a post, and confirm a new filter pill appears.
4. Set `read_time` on one post and confirm it overrides the estimate.
5. Clear `detail_topics_label` and confirm the tags still show without a heading.
6. Search for nonsense and confirm the empty message.
7. `npm run build` must succeed.
