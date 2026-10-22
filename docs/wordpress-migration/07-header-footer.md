# 07 – Site Header, Footer & Menus

## What this covers

| Piece | Managed in WordPress | Used on |
|---|---|---|
| Header brand, CTAs, mega-menu footer | **Site Header** post type (one entry) | Every page |
| Footer brand, partner box, socials, contact, column titles | **Site Footer** post type (one entry) | Every page |
| Top navigation (+ Services mega menu) | **Appearance → Menus → Primary Header** | Header + mobile drawer |
| Footer link columns | Four footer menu locations | Footer |
| Bottom legal links | **Footer – Legal / Bottom bar** menu | Footer copyright row |

React loads all of this from `GET /adlogix/v1/layout` (plugin 1.4.0). Built-in defaults are used until you publish content / assign menus.

## Fix: Menus missing under Appearance

Headless / block themes often hide classic menus. Plugin **1.4.0**:

1. Calls `add_theme_support('menus')` and registers five menu locations.
2. Re-adds **Appearance → Menus** if the theme omitted it.

After uploading the plugin, hard-refresh wp-admin. You should see **Appearance → Menus**.

## Admin setup

### 1. Plugin + field groups

1. Deploy `wordpress/adlogix-headless-core.php` **1.4.0** (git pull on the VPS mounts the file — then `docker compose restart wordpress` in `/docker/adlogix-wordpress`).
2. **Custom Fields → Tools → Import Field Groups**: import `post-type-header.json` and `post-type-footer.json`. Confirm **Show in REST API** is on.

### 2. Site Header / Site Footer

1. **Site Header → Add Site Header** — title can be “Main Header”. Fill the fields (brand, Book Call, Let’s Talk, mega menu footer). Publish.
2. **Site Footer → Add Site Footer** — same idea. Publish.
3. After one entry exists, **Add New** is hidden so you keep a single shared record.

### 3. Menus

**Appearance → Menus**:

1. Create a menu named e.g. **Primary**, add pages/custom links in this order: Home, Services, Work, Reels, Industries, About, Insights, Contact.
2. For the **HOT** badge on Reels: open the item → **CSS Classes** (enable under Screen Options if hidden) → add `badge-hot`.
3. **Services mega menu** (two columns):
   - Under **Services**, add two custom links (URL `#` is fine) titled **Digital Marketing & Creative** and **Web, E-commerce & IT**.
   - Under each of those, nest the service links. Optional: put a short line in each item’s **Description** for the mega-menu subtitle.
4. At the bottom of the Menus screen, tick **Primary Header** and save.
5. Create four more menus (or reuse structure) and assign:
   - **Footer – Marketing & Creative**
   - **Footer – Web & IT**
   - **Footer – Company**
   - **Footer – Legal / Bottom bar** (Privacy, Terms, Get in Touch)

Until a location has a menu, React keeps the previous built-in links for that column.

### 4. Verify

```
https://adlogix.in/wp-json/adlogix/v1/layout
https://adlogix.in/wp-json/adlogix/v1/menus
```

You should see `header.acf`, `footer.acf`, and menu trees. Deploy the React build, then change a header label and reload any page — it should update everywhere.

## React notes

- `src/content/layout.js` — defaults + normalizers.
- `api.getLayout()` — always calls WordPress (ignores `VITE_ENABLE_WP_SYNC`).
- Blank CTA label/link hides that button (same blank-field rule as the homepage).
- Site paths open without a full reload (`SmartLink`).

## Logo

The header and footer each take **one logo image**. The letter mark and typed brand name they used to have are gone — a brand should be set in one place, not typed twice.

| Situation | What renders |
|---|---|
| A logo is uploaded | The image, linked to the homepage |
| No logo | The square mark plus the **Site Title** from **Settings → General** |

The letter in the square is the first character of the Site Title, uppercased, so there is no
separate field to keep in sync — rename the site to "Beacon" and the square shows **B**.

The fallback comes from WordPress itself (`site_name` on `/adlogix/v1/layout`, plugin 1.7.0), so there is no third place to keep the brand name in sync. The header keeps its tagline field, shown under the site title when no logo is set.

Sizing: the header logo renders about 40px tall, the footer about 44px, width automatic. An SVG or a transparent PNG works best, and the footer sits on a dark background so a light version belongs there. SVG uploads are already allowed (`05-media-uploads.md`).

Fields changed in `post-type-header.json` and `post-type-footer.json`: `brand_mark` and `brand_name` replaced by `logo`. **Both files need re-importing.**

## Homepage preloader

The full-screen intro loader runs **only when the homepage is the page being entered**. Deep links to any other page, and every route change, go straight to the content — the thin progress bar at the top of the screen remains the cue for navigation.

Before, the loader ran on first load of *any* page and again on *every* route change, which added about 850ms to each click.

