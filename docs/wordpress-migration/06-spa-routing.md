# 06 – Direct links / refresh return nginx 404

## What was wrong

| Symptom | Cause |
|---|---|
| Clicking **Contact** in the header works | React Router changes the URL in the browser; nginx is never asked for `/contact`. |
| Opening `https://adlogix.in/contact` in a new tab → bare **"404 Not Found / nginx/1.31.6"** | The browser asks nginx for `/contact`. There is no file at that path, and nginx was not told to fall back to `index.html`, so React never loads. |

This affects every route except `/`: `/about`, `/services`, `/work`, `/reels`, `/blog/...`, shared links, and page refreshes.

Caddy is fine: it already proxies non-WordPress paths to `adlogix-frontend`. The fix belongs in the **frontend container's nginx**, not in Caddy or WordPress.

## Fix (frontend nginx SPA fallback)

`deploy/nginx.conf` in this repo contains:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

`Dockerfile` builds the Vite app and serves it with that config.

### Option A – quick fix on the running container (immediate)

SSH into the VPS:

```bash
# Find the frontend container (name may vary)
docker ps --format '{{.Names}}\t{{.Image}}' | grep -iE 'frontend|adlogix'

# Confirm the bare nginx 404 is from this container
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:<frontend-host-port>/contact
```

Write the SPA config into the container and reload nginx (replace the container name):

```bash
FE=adlogix-frontend   # use the name from docker ps

docker exec "$FE" sh -c 'cat > /etc/nginx/conf.d/default.conf <<EOF
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files \$uri =404;
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF'

docker exec "$FE" nginx -t && docker exec "$FE" nginx -s reload
curl -s -o /dev/null -w "local contact: %{http_code}\n" http://127.0.0.1:$(docker port "$FE" 80 | head -1 | cut -d: -f2)/contact
curl -s -o /dev/null -w "public contact: %{http_code}\n" https://adlogix.in/contact
```

Both should print `200`. This lasts until the container is recreated.

### Option B – permanent (recommended)

1. Copy `deploy/nginx.conf` next to the frontend compose file on the VPS (or rebuild from this repo's `Dockerfile`).
2. Either:
   - **Mount the config** in the frontend service volumes:
     ```yaml
     - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
     ```
     then `docker compose up -d <frontend-service>`
   - **Or rebuild** the image with this repo's `Dockerfile` and redeploy that image.

Do **not** change the Caddyfile for this. WordPress paths (`/wp-admin*`, `/wp-json*`, `/wp-content/*`, …) must keep going to the WordPress container.

## Verify

1. Incognito tab → open `https://adlogix.in/contact` → Contact page (with site header), not nginx's "404 Not Found".
2. Refresh on `/services`, `/work`, `/reels` → same.
3. Open a nonsense URL such as `https://adlogix.in/this-page-does-not-exist` → Adlogix themed 404 page (React `NotFoundPage`), still with header and footer.

## React error pages

| Page | When it shows |
|---|---|
| `NotFoundPage` (`/*`) | React loaded, but no route matches. |
| `ErrorPage` (ErrorBoundary) | A React component threw while rendering. |

Neither can appear while nginx returns its own 404; fix Option A/B first.

## Detail-page slugs with non-ASCII characters

WordPress returns a slug containing ₹, é or – percent-encoded (`…-to-%e2%82%b930-cr-arr`), while React Router's `useParams()` decodes it. A strict comparison therefore failed and the detail page redirected to its listing. `findBySlug()` in `src/services/normalizers.js` compares both forms and is used by the project, service, industry and blog detail pages. See `11-work-page.md`.

## Blog URL structure

The blog listing and posts live at **`/blog`** and **`/blog/<slug>`**.

The React routes used to be `/category/blog` and `/category/blog/:slug`, copied from WordPress's category archive, while every link in the app already pointed at `/blog/<slug>`. So the listing opened only from the header menu and **every post card led to the 404 page**. The routes now match the links, and the old paths redirect:

| URL | Result |
|---|---|
| `/blog` | Listing |
| `/blog/<slug>` | Post |
| `/category/blog` | Redirects to `/blog` |
| `/category/blog/<slug>` | Redirects to `/blog/<slug>` |

The redirects exist because the WordPress **Primary** menu pointed its Insights item at `https://adlogix.in/category/blog/`, and that link may also be shared or indexed elsewhere.

Two WordPress settings should match this structure. Neither changes what the site serves — Caddy sends every non-`/wp-*` path to the React app — but they keep the admin's "View Post" link and any copied permalink pointing at a page that exists:

1. **Settings → Permalinks → Custom Structure**: `/blog/%postname%/`. Posts currently resolve to `https://adlogix.in/<slug>/`, which React does not route.
2. **Appearance → Menus → Primary**: change the Insights item's URL from `/category/blog/` to `/blog/`.

