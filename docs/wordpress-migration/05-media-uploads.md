# 05 – Media uploads: SVG, JFIF and large videos

## What was wrong

| Symptom | Cause |
|---|---|
| `adlogix-favicon.svg` → "This file cannot be processed by the web server." | WordPress only accepts a fixed list of file types. SVG is excluded by default because an SVG file can contain JavaScript. |
| `photo-….jfif` → same message | `.jfif` is a JPEG, but the extension is not in WordPress's list. |
| "Maximum upload file size: 2 MB." | PHP's default `upload_max_filesize` (2M). The official WordPress Docker image ships without a `php.ini`, so the PHP defaults apply. A plugin cannot raise this limit; it has to be set in the container's PHP configuration. |

## Fix 1: SVG and JFIF (plugin 1.3.0)

`wordpress/adlogix-headless-core.php` 1.3.0 adds:

| File type | Who can upload | What happens |
|---|---|---|
| `.jfif`, `.jfi`, `.jif` | Everyone who can upload media | Renamed to `.jpg` on upload, so thumbnails are generated and every browser/server treats it as a normal JPEG. |
| `.svg` | Editors and Administrators (`edit_others_posts`) | The file is rewritten without `<script>`, `<foreignObject>`, event handlers (`onload`, `onclick`, …), `javascript:`/`data:text/html` links, external entities and `@import`. Files that are not well-formed SVG are rejected with a clear message. |

SVG attachments also get width/height metadata and a preview in the Media Library and ACF image fields. The site reads only the image URL, so no React change was needed.

The post-type image fields (poster, hero image, video thumbnail) now also accept `svg`. Re-import the `wordpress/acf/post-type-*.json` files to apply this (importing again updates the existing groups).

### Install

1. Upload `wordpress/adlogix-headless-core.php` (1.3.0) over the existing plugin file. The plugin stays active.
2. Media → Add New: upload an `.svg` and a `.jfif` file. Both should appear in the library; the JFIF file is listed as `.jpg`.

## Fix 2: upload size limit (VPS – apply manually)

`wordpress/php/uploads.ini` raises the limit to 256 MB per file:

```ini
upload_max_filesize = 256M
post_max_size = 300M
max_execution_time = 300
max_input_time = 300
memory_limit = 256M
```

Change the numbers if you need more; `post_max_size` must stay larger than `upload_max_filesize`.

The live server responds with `Server: Apache/2.4 (Debian)` and `X-Powered-By: PHP/8.3` behind Caddy, i.e. the official `wordpress:php8.3-apache` image. Use **one** of the options below.

### Option A (recommended): mount the file in Docker Compose

1. Copy `wordpress/php/uploads.ini` next to the `docker-compose.yml` on the VPS.
2. Add one line to the WordPress service's `volumes`:

   ```yaml
   services:
     wordpress:
       volumes:
         - ./uploads.ini:/usr/local/etc/php/conf.d/uploads.ini:ro
   ```

3. Before recreating, confirm the WordPress files live in a volume (`/var/www/html` listed under `volumes`, or `docker inspect <container>` shows a mount for it). Standard setups do; this keeps uploads and plugins when the container is recreated.
4. `docker compose up -d wordpress` (only the WordPress container is recreated; the database is not touched).

This survives container updates.

### Option B: `.htaccess` (no container restart)

The Apache image runs PHP as an Apache module, so these lines work in `/var/www/html/.htaccess`. Put them **above** `# BEGIN WordPress` (WordPress rewrites only the block between its markers):

```apache
php_value upload_max_filesize 256M
php_value post_max_size 300M
php_value max_execution_time 300
php_value max_input_time 300
```

It takes effect immediately. If the site shows a 500 error afterwards, remove the lines (PHP is not running as an Apache module) and use Option A.

### Caddy

Caddy has no request size limit by default. Only if the Caddyfile for `adlogix.in` contains a `request_body { max_size … }` directive does it need to be at least the PHP limit. Nothing else changes in Caddy.

### Verify

Media → Add New should show **Maximum upload file size: 256 MB**. Upload a video larger than 2 MB.

## Video recommendations

Large files slow the site down for visitors. For reels, export H.264 MP4 at 1080×1920 and aim for 10–25 MB per clip; use the poster image so the page shows something before the video loads.

## How this was tested

The plugin's upload code was run on PHP 8.3 (WebAssembly build, outside the project) with sample files:

- Illustrator SVG with DOCTYPE, `<style>`, gradients and `xlink:href="#id"` → kept intact, size read as 64×32.
- SVG with `<script>`, `onload`/`onclick`, `javascript:` links (including obfuscated with a newline), `<foreignObject>`, `<set attributeName="href">`, `@import`, `data:image/svg+xml` image and an `xml-stylesheet` instruction → all removed; harmless shapes and a PNG `data:` image kept.
- SVG with an external entity (XXE), an HTML file renamed to `.svg` and a broken SVG → rejected.
- Author role → SVG refused; JFIF allowed and renamed to `.jpg`.
