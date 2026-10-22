<?php
/**
 * Plugin Name: Adlogix Headless Core
 * Plugin URI: https://adlogix.in
 * Description: Core Headless CMS configuration, Custom Post Types, ACF bindings, CORS headers, and REST API endpoints for the Adlogix React Frontend (Powered by Aumento Infoway).
 * Version: 1.6.0
 * Author: Adlogix & Aumento Infoway
 * License: GPL-2.0+
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class Adlogix_Headless_Core {

    public function __construct() {
        // Register Custom Post Types
        add_action('init', [$this, 'register_post_types']);

        // Leads: admin list columns, read-only detail, CSV export
        add_filter('manage_adlogix_enquiry_posts_columns', [$this, 'lead_columns']);
        add_filter('manage_adlogix_booking_posts_columns', [$this, 'lead_columns']);
        add_action('manage_adlogix_enquiry_posts_custom_column', [$this, 'lead_column'], 10, 2);
        add_action('manage_adlogix_booking_posts_custom_column', [$this, 'lead_column'], 10, 2);
        add_action('add_meta_boxes_adlogix_enquiry', [$this, 'add_lead_meta_box']);
        add_action('add_meta_boxes_adlogix_booking', [$this, 'add_lead_meta_box']);
        add_action('admin_post_adlogix_export_leads', [$this, 'export_leads_csv']);
        add_action('restrict_manage_posts', [$this, 'lead_export_button']);

        // Appearance → Menus (headless themes often hide this)
        add_action('after_setup_theme', [$this, 'register_nav_menus'], 100);
        add_action('admin_menu', [$this, 'ensure_appearance_menus'], 999);
        add_action('admin_menu', [$this, 'limit_singleton_cpt_add_new'], 999);

        // Enable REST API CORS Headers
        add_action('rest_api_init', [$this, 'add_cors_support']);

        // Register Custom REST API Endpoints
        add_action('rest_api_init', [$this, 'register_custom_endpoints']);

        // Expose Featured Images in REST API
        add_action('rest_api_init', [$this, 'expose_featured_media_urls']);

        // Page Sections: admin ordering/visibility of React page sections
        add_action('add_meta_boxes_page', [$this, 'add_page_sections_meta_box']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_page_sections_assets']);
        add_action('save_post_page', [$this, 'save_page_sections'], 10, 2);
        add_action('rest_api_init', [$this, 'expose_page_sections']);

        // Media uploads: JFIF images (stored as .jpg) and sanitized SVG
        add_filter('upload_mimes', [$this, 'allow_extra_upload_mimes'], 10, 2);
        add_filter('wp_handle_upload_prefilter', [$this, 'prepare_upload']);
        add_filter('wp_handle_sideload_prefilter', [$this, 'prepare_upload']);
        add_filter('wp_check_filetype_and_ext', [$this, 'check_svg_filetype'], 10, 3);
        add_filter('wp_generate_attachment_metadata', [$this, 'svg_attachment_metadata'], 10, 2);
        add_filter('wp_prepare_attachment_for_js', [$this, 'svg_attachment_preview'], 10, 3);
    }

    const SECTIONS_META_KEY = '_adlogix_page_sections';
    const SECTIONS_NONCE = 'adlogix_page_sections_nonce';

    // SVG is markup, so only Editors and Administrators may upload it (after sanitizing).
    const SVG_UPLOAD_CAPABILITY = 'edit_others_posts';
    const JPEG_ALIAS_EXTENSIONS = ['jfif', 'jfi', 'jif'];

    /**
     * Sections each React page can render, keyed by page slug.
     * Keys must match the section maps in the React page components.
     */
    public function get_section_registry() {
        $hero = __('Hero', 'adlogix');
        $cta = __('Closing CTA', 'adlogix');
        $plans = __('Growth Plans', 'adlogix');
        $studio = __('Studio Showcase', 'adlogix');

        $registry = [
            'home' => [
                'hero' => $hero,
                'reels' => __('Client Reels', 'adlogix'),
                'studio' => $studio,
                'brands' => __('Brand Marquee', 'adlogix'),
                'services' => __('Services Overview', 'adlogix'),
                'projects' => __('Featured Projects', 'adlogix'),
                'industries' => __('Industries', 'adlogix'),
                'why' => __('Why Adlogix', 'adlogix'),
                'process' => __('Our Process', 'adlogix'),
                'plans' => $plans,
                'testimonials' => __('Video Testimonials', 'adlogix'),
                'aumento' => __('Technology Partner', 'adlogix'),
                'insights' => __('Insights', 'adlogix'),
                'cta' => $cta,
            ],
            'about' => [
                'hero' => $hero,
                'story' => __('Mission & Story', 'adlogix'),
                'partner' => __('Technology Partner', 'adlogix'),
                'team' => __('Leadership Team', 'adlogix'),
                'cta' => $cta,
            ],
            'services' => [
                'hero' => $hero,
                'catalog' => __('Services Catalog', 'adlogix'),
                'plans' => $plans,
                'cta' => $cta,
            ],
            'work' => [
                'hero' => $hero,
                'portfolio' => __('Portfolio', 'adlogix'),
                'cta' => $cta,
            ],
            'reels' => [
                'hero' => $hero,
                'production' => __('Production Highlights', 'adlogix'),
                'gallery' => __('Reels Gallery', 'adlogix'),
                'studio' => $studio,
                'plans' => $plans,
                'cta' => $cta,
            ],
            'industries' => [
                'hero' => $hero,
                'grid' => __('Industries Grid', 'adlogix'),
                'cta' => $cta,
            ],
            'testimonials' => [
                'hero' => $hero,
                'grid' => __('Testimonials Grid', 'adlogix'),
                'cta' => $cta,
            ],
            'blog' => [
                'hero' => $hero,
                'articles' => __('Articles', 'adlogix'),
            ],
            'contact' => [
                'hero' => $hero,
                'enquiry' => __('Enquiry Form & Contact Details', 'adlogix'),
            ],
        ];

        return apply_filters('adlogix_page_sections', $registry);
    }

    /**
     * Registry entry for a page: matched by slug, the static front page always maps to "home".
     */
    private function get_page_section_definitions($post) {
        $post = get_post($post);
        if (!$post || $post->post_type !== 'page') {
            return null;
        }

        $registry = $this->get_section_registry();
        $key = ((int) get_option('page_on_front') === (int) $post->ID) ? 'home' : $post->post_name;

        return $registry[$key] ?? null;
    }

    /**
     * Saved order merged with the registry: unknown keys are dropped, new sections are appended enabled.
     */
    public function get_page_sections($post) {
        $definitions = $this->get_page_section_definitions($post);
        if (!$definitions) {
            return null;
        }

        $saved = get_post_meta(get_post($post)->ID, self::SECTIONS_META_KEY, true);
        $sections = [];

        if (is_array($saved)) {
            foreach ($saved as $item) {
                $key = $item['key'] ?? '';
                if (isset($definitions[$key]) && !isset($sections[$key])) {
                    $sections[$key] = [
                        'key' => $key,
                        'label' => $definitions[$key],
                        'enabled' => !empty($item['enabled']),
                    ];
                }
            }
        }

        foreach ($definitions as $key => $label) {
            if (!isset($sections[$key])) {
                $sections[$key] = ['key' => $key, 'label' => $label, 'enabled' => true];
            }
        }

        return array_values($sections);
    }

    public function add_page_sections_meta_box($post) {
        if (!$this->get_page_section_definitions($post)) {
            return;
        }

        add_meta_box(
            'adlogix-page-sections',
            __('Page Sections', 'adlogix'),
            [$this, 'render_page_sections_meta_box'],
            'page',
            'side',
            'high'
        );
    }

    public function render_page_sections_meta_box($post) {
        wp_nonce_field(self::SECTIONS_NONCE, self::SECTIONS_NONCE);
        ?>
        <p class="description"><?php esc_html_e('Drag to reorder. Untick to hide a section without deleting its content.', 'adlogix'); ?></p>
        <ul class="adlogix-sections">
            <?php foreach ($this->get_page_sections($post) as $section) : ?>
                <li class="adlogix-sections__item">
                    <span class="adlogix-sections__handle" aria-hidden="true">&#x283F;</span>
                    <input type="hidden" name="adlogix_sections_order[]" value="<?php echo esc_attr($section['key']); ?>" />
                    <label>
                        <input type="checkbox" name="adlogix_sections_enabled[]" value="<?php echo esc_attr($section['key']); ?>" <?php checked($section['enabled']); ?> />
                        <?php echo esc_html($section['label']); ?>
                    </label>
                </li>
            <?php endforeach; ?>
        </ul>
        <?php
    }

    public function enqueue_page_sections_assets($hook) {
        if (!in_array($hook, ['post.php', 'post-new.php'], true)) {
            return;
        }

        $screen = get_current_screen();
        if (!$screen || $screen->post_type !== 'page') {
            return;
        }

        wp_enqueue_script('jquery-ui-sortable');
        wp_add_inline_script(
            'jquery-ui-sortable',
            'jQuery(function ($) { $(".adlogix-sections").sortable({ handle: ".adlogix-sections__handle", axis: "y", placeholder: "adlogix-sections__placeholder" }); });'
        );

        wp_register_style('adlogix-page-sections', false);
        wp_enqueue_style('adlogix-page-sections');
        wp_add_inline_style('adlogix-page-sections', '
            .adlogix-sections { margin: 12px 0 0; }
            .adlogix-sections__item { display: flex; align-items: center; gap: 8px; margin: 0 0 6px; padding: 8px 10px; background: #fff; border: 1px solid #dcdcde; border-radius: 4px; }
            .adlogix-sections__item label { flex: 1; cursor: pointer; }
            .adlogix-sections__handle { cursor: move; color: #8c8f94; font-size: 16px; line-height: 1; user-select: none; }
            .adlogix-sections__placeholder { height: 36px; margin: 0 0 6px; border: 1px dashed #2271b1; border-radius: 4px; background: #f0f6fc; }
        ');
    }

    public function save_page_sections($post_id, $post) {
        if (!isset($_POST[self::SECTIONS_NONCE]) || !wp_verify_nonce(sanitize_key(wp_unslash($_POST[self::SECTIONS_NONCE])), self::SECTIONS_NONCE)) {
            return;
        }
        if ((defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) || wp_is_post_revision($post_id)) {
            return;
        }
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        $definitions = $this->get_page_section_definitions($post);
        if (!$definitions || !isset($_POST['adlogix_sections_order']) || !is_array($_POST['adlogix_sections_order'])) {
            return;
        }

        $order = array_map('sanitize_key', wp_unslash($_POST['adlogix_sections_order']));
        $enabled = isset($_POST['adlogix_sections_enabled']) && is_array($_POST['adlogix_sections_enabled'])
            ? array_map('sanitize_key', wp_unslash($_POST['adlogix_sections_enabled']))
            : [];

        $sections = [];
        foreach ($order as $key) {
            if (isset($definitions[$key]) && !isset($sections[$key])) {
                $sections[$key] = ['key' => $key, 'enabled' => in_array($key, $enabled, true)];
            }
        }

        update_post_meta($post_id, self::SECTIONS_META_KEY, array_values($sections));
    }

    /**
     * REST: pages expose `adlogix_sections` as [{ key, label, enabled }] (null when the page has no registry entry).
     */
    public function expose_page_sections() {
        register_rest_field('page', 'adlogix_sections', [
            'get_callback' => function ($post_arr) {
                return $this->get_page_sections($post_arr['id']);
            },
            'schema' => [
                'description' => 'Ordered page sections for the React frontend.',
                'type' => ['array', 'null'],
                'context' => ['view', 'edit'],
                'readonly' => true,
            ],
        ]);
    }

    private function can_upload_svg($user = null) {
        $user = $user ?: get_current_user_id();
        return $user && user_can($user, self::SVG_UPLOAD_CAPABILITY);
    }

    /**
     * Adds JFIF (a JPEG variant) for everyone who can upload, and SVG for Editors/Administrators.
     * The browser uploader only offers extensions listed here.
     */
    public function allow_extra_upload_mimes($mimes, $user = null) {
        $mimes[implode('|', self::JPEG_ALIAS_EXTENSIONS)] = 'image/jpeg';
        if ($this->can_upload_svg($user)) {
            $mimes['svg'] = 'image/svg+xml';
        }
        return $mimes;
    }

    /**
     * Runs before WordPress validates the file: JFIF is renamed to .jpg so thumbnails and
     * browsers treat it as a normal JPEG; SVG is sanitized in place or rejected.
     */
    public function prepare_upload($file) {
        if (!empty($file['error']) || empty($file['name']) || empty($file['tmp_name'])) {
            return $file;
        }

        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

        if (in_array($extension, self::JPEG_ALIAS_EXTENSIONS, true)) {
            $file['name'] = substr($file['name'], 0, -strlen($extension)) . 'jpg';
            $file['type'] = 'image/jpeg';
        } elseif ($extension === 'svg') {
            if (!$this->can_upload_svg()) {
                $file['error'] = __('Only Editors and Administrators can upload SVG files.', 'adlogix');
            } elseif (!$this->sanitize_svg_file($file['tmp_name'])) {
                $file['error'] = __('This SVG could not be read or contains unsafe content (scripts, event handlers or external entities).', 'adlogix');
            }
        }

        return $file;
    }

    /**
     * Some servers detect SVG as text/xml or text/plain, which WordPress rejects as a type mismatch.
     * The file has already been sanitized and confirmed to have an <svg> root by prepare_upload().
     */
    public function check_svg_filetype($data, $file, $filename) {
        if (!empty($data['ext']) && !empty($data['type'])) {
            return $data;
        }

        $check = wp_check_filetype($filename);
        if ($check['ext'] === 'svg' && $check['type'] === 'image/svg+xml') {
            $data['ext'] = 'svg';
            $data['type'] = 'image/svg+xml';
        }
        return $data;
    }

    /**
     * Rewrites the uploaded SVG without scripts, event handlers, external entities or
     * javascript: URLs. Returns false when the file is not a well-formed SVG.
     */
    private function sanitize_svg_file($path) {
        $svg = is_readable($path) ? file_get_contents($path) : false;
        if (!is_string($svg) || trim($svg) === '' || !class_exists('DOMDocument')) {
            return false;
        }

        $svg = preg_replace('/<!DOCTYPE[^>\[]*(\[[^\]]*\])?\s*>/i', '', $svg);
        if (!is_string($svg) || stripos($svg, '<!ENTITY') !== false) {
            return false;
        }

        $dom = new DOMDocument();
        $previous = libxml_use_internal_errors(true);
        $loaded = $dom->loadXML($svg, LIBXML_NONET);
        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        if (!$loaded || !$dom->documentElement || strtolower($dom->documentElement->localName) !== 'svg') {
            return false;
        }

        $this->strip_unsafe_svg_nodes($dom);

        $clean = $dom->saveXML($dom->documentElement);
        return $clean && file_put_contents($path, '<?xml version="1.0" encoding="UTF-8"?>' . "\n" . $clean) !== false;
    }

    private function strip_unsafe_svg_nodes(DOMDocument $dom) {
        $blocked = ['script', 'foreignobject', 'iframe', 'embed', 'object', 'audio', 'video', 'handler', 'listener', 'base', 'link', 'meta'];
        $animations = ['animate', 'animatecolor', 'animatemotion', 'animatetransform', 'set'];
        $unsafe_value = '/javascript:|vbscript:|data:(?!image\/(png|jpe?g|gif|webp)|font\/)|expression\(|@import/i';
        $link_attributes = ['href', 'src', 'action', 'formaction'];

        $xpath = new DOMXPath($dom);
        $removals = iterator_to_array($xpath->query('//processing-instruction()'), false);

        foreach ($xpath->query('//*') as $element) {
            $name = strtolower($element->localName);

            if (in_array($name, $blocked, true)) {
                $removals[] = $element;
                continue;
            }

            if (in_array($name, $animations, true)) {
                $target = strtolower($element->getAttribute('attributeName'));
                if (str_starts_with($target, 'on') || in_array($target, ['href', 'xlink:href'], true)) {
                    $removals[] = $element;
                    continue;
                }
            }

            if ($name === 'style' && preg_match($unsafe_value, $element->textContent)) {
                $removals[] = $element;
                continue;
            }

            foreach (iterator_to_array($element->attributes) as $attribute) {
                $attribute_name = strtolower($attribute->localName);
                $value = preg_replace('/[\s\x00-\x1f]+/', '', $attribute->value);

                $is_handler = str_starts_with($attribute_name, 'on');
                $is_unsafe_link = in_array($attribute_name, $link_attributes, true)
                    && !preg_match('~^(#|https?://|data:image/(png|jpe?g|gif|webp);)~i', $value);

                if ($is_handler || $is_unsafe_link || preg_match($unsafe_value, $value)) {
                    $element->removeAttributeNode($attribute);
                }
            }
        }

        foreach ($removals as $node) {
            if ($node->parentNode) {
                $node->parentNode->removeChild($node);
            }
        }
    }

    /**
     * Width/height from the root <svg> attributes, falling back to the viewBox. [0, 0] when unknown.
     */
    private function svg_dimensions($path) {
        $svg = is_readable($path) ? file_get_contents($path) : false;
        if (!is_string($svg) || !preg_match('/<svg\b[^>]*>/i', $svg, $tag)) {
            return [0, 0];
        }

        $read = function ($name) use ($tag) {
            return preg_match('/\s' . $name . '\s*=\s*["\']([^"\']*)["\']/i', $tag[0], $match) ? trim($match[1]) : '';
        };

        $width = $read('width');
        $height = $read('height');
        $width = str_contains($width, '%') ? 0 : (float) $width;
        $height = str_contains($height, '%') ? 0 : (float) $height;

        if ($width <= 0 || $height <= 0) {
            $box = preg_split('/[\s,]+/', $read('viewBox'));
            $width = count($box) === 4 ? (float) $box[2] : 0;
            $height = count($box) === 4 ? (float) $box[3] : 0;
        }

        return [max(0, (int) round($width)), max(0, (int) round($height))];
    }

    public function svg_attachment_metadata($metadata, $attachment_id) {
        if (get_post_mime_type($attachment_id) !== 'image/svg+xml') {
            return $metadata;
        }

        $path = get_attached_file($attachment_id);
        [$width, $height] = $this->svg_dimensions($path);

        $metadata = is_array($metadata) ? $metadata : [];
        $metadata['width'] = $width;
        $metadata['height'] = $height;
        $metadata['file'] = _wp_relative_upload_path($path);
        return $metadata;
    }

    /**
     * Gives SVG attachments image sizes so the Media Library and ACF image fields show a preview
     * instead of a generic file icon.
     */
    public function svg_attachment_preview($response, $attachment, $meta) {
        if (($response['mime'] ?? '') !== 'image/svg+xml' || empty($response['url'])) {
            return $response;
        }

        $width = (int) ($meta['width'] ?? 0);
        $height = (int) ($meta['height'] ?? 0);
        if (!$width || !$height) {
            [$width, $height] = $this->svg_dimensions(get_attached_file($attachment->ID));
        }
        $width = $width ?: 512;
        $height = $height ?: 512;

        $size = [
            'url' => $response['url'],
            'width' => $width,
            'height' => $height,
            'orientation' => $height > $width ? 'portrait' : 'landscape',
        ];

        $response['width'] = $width;
        $response['height'] = $height;
        $response['sizes'] = ['thumbnail' => $size, 'medium' => $size, 'large' => $size, 'full' => $size];
        return $response;
    }

    /**
     * Theme menu support + locations used by the React header and footer.
     * Without this, many headless / block themes hide Appearance → Menus.
     */
    public function register_nav_menus() {
        add_theme_support('menus');
        register_nav_menus([
            'primary' => __('Primary Header', 'adlogix'),
            'footer_marketing' => __('Footer – Marketing & Creative', 'adlogix'),
            'footer_web' => __('Footer – Web & IT', 'adlogix'),
            'footer_company' => __('Footer – Company', 'adlogix'),
            'footer_legal' => __('Footer – Legal / Bottom bar', 'adlogix'),
        ]);
    }

    /**
     * Ensure Appearance → Menus is listed even when the active theme omitted it.
     */
    public function ensure_appearance_menus() {
        if (!current_user_can('edit_theme_options')) {
            return;
        }

        global $submenu;
        $has_menus = false;
        if (!empty($submenu['themes.php']) && is_array($submenu['themes.php'])) {
            foreach ($submenu['themes.php'] as $item) {
                if (isset($item[2]) && $item[2] === 'nav-menus.php') {
                    $has_menus = true;
                    break;
                }
            }
        }

        if (!$has_menus) {
            add_submenu_page(
                'themes.php',
                __('Menus', 'adlogix'),
                __('Menus', 'adlogix'),
                'edit_theme_options',
                'nav-menus.php'
            );
        }
    }

    /**
     * Header / Footer are singletons: hide "Add New" once one entry exists.
     */
    public function limit_singleton_cpt_add_new() {
        foreach (['site_header', 'site_footer', 'site_popup'] as $post_type) {
            $counts = wp_count_posts($post_type);
            if (!$counts) {
                continue;
            }
            $total = (int) ($counts->publish ?? 0) + (int) ($counts->draft ?? 0) + (int) ($counts->pending ?? 0) + (int) ($counts->private ?? 0);
            if ($total >= 1) {
                remove_submenu_page("edit.php?post_type={$post_type}", "post-new.php?post_type={$post_type}");
            }
        }
    }

    /**
     * Nested menu tree for a location. Empty array when nothing is assigned.
     * Badge: CSS class "badge-hot" → "HOT", or "badge-NEW" → "NEW".
     */
    private function get_menu_tree_for_location($location) {
        $locations = get_nav_menu_locations();
        if (empty($locations[$location])) {
            return [];
        }

        $items = wp_get_nav_menu_items($locations[$location]);
        if (!$items || is_wp_error($items)) {
            return [];
        }

        $nodes = [];
        $children_of = [];
        foreach ($items as $item) {
            $id = (int) $item->ID;
            $parent = (int) $item->menu_item_parent;
            $classes = array_values(array_filter((array) $item->classes));
            $badge = '';
            foreach ($classes as $class) {
                if ($class === 'badge-hot') {
                    $badge = 'HOT';
                    break;
                }
                if (str_starts_with($class, 'badge-') && strlen($class) > 6) {
                    $badge = strtoupper(substr($class, 6));
                    break;
                }
            }

            $nodes[$id] = [
                'id' => $id,
                'title' => html_entity_decode($item->title, ENT_QUOTES, 'UTF-8'),
                'url' => $item->url,
                'target' => $item->target ?: '',
                'description' => html_entity_decode((string) $item->description, ENT_QUOTES, 'UTF-8'),
                'badge' => $badge,
                'classes' => $classes,
                'children' => [],
            ];
            $children_of[$parent][] = $id;
        }

        $build = function ($id) use (&$build, $nodes, $children_of) {
            $node = $nodes[$id];
            $node['children'] = [];
            foreach ($children_of[$id] ?? [] as $child_id) {
                $node['children'][] = $build($child_id);
            }
            return $node;
        };

        $tree = [];
        foreach ($children_of[0] ?? [] as $root_id) {
            $tree[] = $build($root_id);
        }

        return $tree;
    }

    public function get_menus_response() {
        $registered = get_registered_nav_menus();
        $out = [];
        foreach (array_keys($registered) as $location) {
            $out[$location] = $this->get_menu_tree_for_location($location);
        }
        return $out;
    }

    /**
     * Register Custom Post Types with REST API support.
     * Content lives in the ACF groups from wordpress/acf/post-type-*.json; "page-attributes"
     * provides the Order box that sorts entries on the site.
     */
    public function register_post_types() {
        $supports = ['title', 'page-attributes'];

        // 1. Services
        register_post_type('services', [
            'labels' => [
                'name' => __('Services', 'adlogix'),
                'singular_name' => __('Service', 'adlogix'),
                'add_new_item' => __('Add New Service', 'adlogix'),
            ],
            'public' => true,
            'show_in_rest' => true,
            'rest_base' => 'services',
            'supports' => $supports,
            'menu_icon' => 'dashicons-grid-view',
            'has_archive' => true,
            'rewrite' => ['slug' => 'services'],
        ]);

        // 2. Projects / Case Studies
        register_post_type('projects', [
            'labels' => [
                'name' => __('Projects', 'adlogix'),
                'singular_name' => __('Project', 'adlogix'),
                'add_new_item' => __('Add New Case Study', 'adlogix'),
            ],
            'public' => true,
            'show_in_rest' => true,
            'rest_base' => 'projects',
            'supports' => $supports,
            'menu_icon' => 'dashicons-portfolio',
            'has_archive' => true,
            'rewrite' => ['slug' => 'work'],
        ]);

        // 3. Client Reels (9:16 Vertical Video Showcase)
        register_post_type('reels', [
            'labels' => [
                'name' => __('Client Reels', 'adlogix'),
                'singular_name' => __('Reel', 'adlogix'),
                'add_new_item' => __('Add New Client Reel', 'adlogix'),
            ],
            'public' => true,
            'show_in_rest' => true,
            'rest_base' => 'reels',
            'supports' => $supports,
            'menu_icon' => 'dashicons-video-alt3',
            'has_archive' => false,
        ]);

        // 4. Video Testimonials
        register_post_type('testimonials', [
            'labels' => [
                'name' => __('Testimonials', 'adlogix'),
                'singular_name' => __('Testimonial', 'adlogix'),
                'add_new_item' => __('Add New Testimonial', 'adlogix'),
            ],
            'public' => true,
            'show_in_rest' => true,
            'rest_base' => 'testimonials',
            'supports' => $supports,
            'menu_icon' => 'dashicons-testimonial',
            'has_archive' => false,
        ]);

        // 5. Industries
        register_post_type('industries', [
            'labels' => [
                'name' => __('Industries', 'adlogix'),
                'singular_name' => __('Industry', 'adlogix'),
                'add_new_item' => __('Add New Industry', 'adlogix'),
            ],
            'public' => true,
            'show_in_rest' => true,
            'rest_base' => 'industries',
            'supports' => $supports,
            'menu_icon' => 'dashicons-building',
            'has_archive' => true,
            'rewrite' => ['slug' => 'industries'],
        ]);

        // 6–7. Shared layout (one published entry each; not public on the WP front end)
        register_post_type('site_header', [
            'labels' => [
                'name' => __('Site Header', 'adlogix'),
                'singular_name' => __('Site Header', 'adlogix'),
                'add_new_item' => __('Add Site Header', 'adlogix'),
                'edit_item' => __('Edit Site Header', 'adlogix'),
            ],
            'public' => false,
            'show_ui' => true,
            'show_in_menu' => true,
            'show_in_rest' => true,
            'rest_base' => 'site-header',
            'supports' => ['title'],
            'menu_icon' => 'dashicons-heading',
            'has_archive' => false,
        ]);

        register_post_type('site_footer', [
            'labels' => [
                'name' => __('Site Footer', 'adlogix'),
                'singular_name' => __('Site Footer', 'adlogix'),
                'add_new_item' => __('Add Site Footer', 'adlogix'),
                'edit_item' => __('Edit Site Footer', 'adlogix'),
            ],
            'public' => false,
            'show_ui' => true,
            'show_in_menu' => true,
            'show_in_rest' => true,
            'rest_base' => 'site-footer',
            'supports' => ['title'],
            'menu_icon' => 'dashicons-table-row-after',
            'has_archive' => false,
        ]);

        // The Book a Call popup. It opens from the header and most pages, so like the header
        // and footer it is global chrome with one published entry, not page content.
        register_post_type('site_popup', [
            'labels' => [
                'name' => __('Call Popup', 'adlogix'),
                'singular_name' => __('Call Popup', 'adlogix'),
                'add_new_item' => __('Add Call Popup', 'adlogix'),
                'edit_item' => __('Edit Call Popup', 'adlogix'),
            ],
            'public' => false,
            'show_ui' => true,
            'show_in_menu' => true,
            'show_in_rest' => true,
            'rest_base' => 'site-popup',
            'supports' => ['title'],
            'menu_icon' => 'dashicons-format-chat',
            'has_archive' => false,
        ]);

        // 8-9. Leads. Private on purpose: never public, never in REST, so a submission
        // can be written by the public endpoint but only read inside wp-admin.
        $lead_args = [
            'public' => false,
            'publicly_queryable' => false,
            'exclude_from_search' => true,
            'show_ui' => true,
            'show_in_menu' => true,
            'show_in_rest' => false,
            'has_archive' => false,
            'rewrite' => false,
            'supports' => ['title'],
            'capabilities' => ['create_posts' => 'do_not_allow'],
            'map_meta_cap' => true,
        ];

        register_post_type('adlogix_enquiry', array_merge($lead_args, [
            'labels' => [
                'name' => __('Enquiries', 'adlogix'),
                'singular_name' => __('Enquiry', 'adlogix'),
                'menu_name' => __('Enquiries', 'adlogix'),
                'edit_item' => __('Enquiry', 'adlogix'),
                'search_items' => __('Search enquiries', 'adlogix'),
                'not_found' => __('No enquiries yet.', 'adlogix'),
            ],
            'menu_icon' => 'dashicons-email-alt',
            'menu_position' => 26,
        ]));

        register_post_type('adlogix_booking', array_merge($lead_args, [
            'labels' => [
                'name' => __('Call Bookings', 'adlogix'),
                'singular_name' => __('Call Booking', 'adlogix'),
                'menu_name' => __('Call Bookings', 'adlogix'),
                'edit_item' => __('Call Booking', 'adlogix'),
                'search_items' => __('Search bookings', 'adlogix'),
                'not_found' => __('No call bookings yet.', 'adlogix'),
            ],
            'menu_icon' => 'dashicons-phone',
            'menu_position' => 27,
        ]));
    }

    /**
     * Allow Cross-Origin Resource Sharing (CORS) for Headless React App
     */
    public function add_cors_support() {
        remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
        add_filter('rest_pre_serve_request', function ($value) {
            $origin = get_http_origin();
            if ($origin) {
                header('Access-Control-Allow-Origin: ' . esc_url_raw($origin));
                header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
                header('Access-Control-Allow-Credentials: true');
                header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-WpNonce');
            }
            return $value;
        });
    }

    /**
     * Register Custom Endpoints: Settings & Enquiry Handling
     */
    public function register_custom_endpoints() {
        // Global Settings & Partner Info Endpoint
        register_rest_route('adlogix/v1', '/settings', [
            'methods' => 'GET',
            'callback' => [$this, 'get_site_settings'],
            'permission_callback' => '__return_true',
        ]);

        // Form Lead Submission Endpoint
        register_rest_route('adlogix/v1', '/enquiry', [
            'methods' => 'POST',
            'callback' => [$this, 'handle_enquiry_submission'],
            'permission_callback' => '__return_true',
        ]);

        // Book a Call popup. A separate route so the two lead types never mix.
        register_rest_route('adlogix/v1', '/booking', [
            'methods' => 'POST',
            'callback' => [$this, 'handle_booking_submission'],
            'permission_callback' => '__return_true',
        ]);

        // Nav menus by location (Primary Header, Footer columns, …)
        register_rest_route('adlogix/v1', '/menus', [
            'methods' => 'GET',
            'callback' => [$this, 'get_menus_response'],
            'permission_callback' => '__return_true',
        ]);

        // Shared header + footer ACF + menus (public read; CPTs stay non-public)
        register_rest_route('adlogix/v1', '/layout', [
            'methods' => 'GET',
            'callback' => [$this, 'get_layout_response'],
            'permission_callback' => '__return_true',
        ]);
    }

    /**
     * Latest published Site Header / Site Footer ACF fields plus menu trees.
     */
    public function get_layout_response() {
        return [
            'header' => $this->get_singleton_acf('site_header'),
            'footer' => $this->get_singleton_acf('site_footer'),
            'popup' => $this->get_singleton_acf('site_popup'),
            'menus' => $this->get_menus_response(),
        ];
    }

    private function get_singleton_acf($post_type) {
        $posts = get_posts([
            'post_type' => $post_type,
            'post_status' => 'publish',
            'numberposts' => 1,
            'orderby' => 'modified',
            'order' => 'DESC',
        ]);

        if (!$posts) {
            return null;
        }

        $post = $posts[0];
        $acf = function_exists('get_fields') ? get_fields($post->ID) : [];

        return [
            'id' => (int) $post->ID,
            'title' => get_the_title($post),
            'acf' => is_array($acf) ? $acf : [],
        ];
    }

    /**
     * Return Global Settings, Contact, and Aumento Infoway Partner Info
     */
    public function get_site_settings() {
        return [
            'brandName' => get_bloginfo('name') ?: 'Adlogix',
            'tagline' => get_bloginfo('description') ?: 'Creative Digital Marketing & Technology Solutions',
            'poweredBy' => [
                'text' => get_option('adlogix_powered_by_text', 'Powered by Aumento Infoway'),
                'partnerName' => 'Aumento Infoway',
                'url' => 'https://aumentoinfoway.com/',
                'description' => 'Adlogix brings together digital marketing and creative execution, powered by robust technology capabilities through Aumento Infoway.',
                'showBadge' => true
            ],
            'contact' => [
                'email' => get_option('admin_email', 'support@adlogix.in'),
                'phone' => get_option('adlogix_phone', '+1 (800) 592-3564'),
                'address' => get_option('adlogix_address', '742 Innovation Blvd, Suite 400'),
                'city' => get_option('adlogix_city', 'San Francisco, CA 94107'),
                'workingHours' => 'Mon – Fri: 9:00 AM – 6:30 PM (PST)'
            ],
            'socials' => [
                'instagram' => get_option('adlogix_instagram', 'https://instagram.com/adlogix.in'),
                'linkedin' => get_option('adlogix_linkedin', 'https://linkedin.com/company/adlogix'),
                'twitter' => get_option('adlogix_twitter', 'https://twitter.com/adlogix_in'),
            ]
        ];
    }

    /**
     * Securely handle and validate contact form enquiries
     */
    /** Fields shown, in order, on a lead's admin screen and in the CSV export. */
    private function lead_fields($post_type) {
        if ($post_type === 'adlogix_booking') {
            return [
                'name' => __('Name', 'adlogix'),
                'email' => __('Email', 'adlogix'),
                'company' => __('Company', 'adlogix'),
                'goal' => __('Primary goal', 'adlogix'),
                'budget' => __('Budget', 'adlogix'),
            ];
        }

        return [
            'name' => __('Name', 'adlogix'),
            'email' => __('Email', 'adlogix'),
            'phone' => __('Phone', 'adlogix'),
            'company' => __('Company', 'adlogix'),
            'service' => __('Service', 'adlogix'),
            'budget' => __('Budget', 'adlogix'),
            'details' => __('Project details', 'adlogix'),
        ];
    }

    /**
     * Store one submission and notify the admin. Returns the REST response for either form.
     *
     * The record is written first: if wp_mail() fails (no SMTP on the server, for example)
     * the lead is still saved rather than lost.
     */
    private function store_lead($post_type, $values, $subject_prefix) {
        $name = $values['name'];
        $company = $values['company'] !== '' ? $values['company'] : $name;

        $post_id = wp_insert_post([
            'post_type' => $post_type,
            'post_status' => 'publish',
            'post_title' => sprintf('%s - %s', $name, $company),
        ], true);

        if (is_wp_error($post_id)) {
            return new WP_Error(
                'adlogix_lead_not_saved',
                __('We could not record your message. Please try again or email us directly.', 'adlogix'),
                ['status' => 500]
            );
        }

        foreach ($values as $key => $value) {
            update_post_meta($post_id, '_adlogix_' . $key, $value);
        }
        update_post_meta($post_id, '_adlogix_submitted_at', current_time('mysql'));

        $lines = [];
        foreach ($this->lead_fields($post_type) as $key => $label) {
            if (isset($values[$key]) && $values[$key] !== '') {
                $lines[] = $label . ': ' . $values[$key];
            }
        }

        wp_mail(
            get_option('admin_email'),
            sprintf('%s: %s', $subject_prefix, $company),
            implode("\n", $lines) . "\n\n" . __('View it in WordPress:', 'adlogix') . ' '
                . admin_url('post.php?post=' . $post_id . '&action=edit')
        );

        return $post_id;
    }

    /** Contact page form. */
    public function handle_enquiry_submission($request) {
        $params = $request->get_json_params();

        if (!empty($params['_honeypot'])) {
            return new WP_REST_Response(['success' => true, 'message' => 'Received.'], 200);
        }

        $name = sanitize_text_field($params['fullName'] ?? '');
        $email = sanitize_email($params['businessEmail'] ?? '');

        if (empty($name) || empty($email) || !is_email($email)) {
            return new WP_Error('invalid_data', __('Please provide a valid name and business email.', 'adlogix'), ['status' => 400]);
        }

        $result = $this->store_lead('adlogix_enquiry', [
            'name' => $name,
            'email' => $email,
            'phone' => sanitize_text_field($params['phone'] ?? ''),
            'company' => sanitize_text_field($params['company'] ?? ''),
            'service' => sanitize_text_field($params['serviceRequired'] ?? ''),
            'budget' => sanitize_text_field($params['budgetRange'] ?? ''),
            'details' => sanitize_textarea_field($params['projectDetails'] ?? ''),
        ], __('New Adlogix Enquiry', 'adlogix'));

        if (is_wp_error($result)) {
            return $result;
        }

        return new WP_REST_Response([
            'success' => true,
            'message' => __('Thank you for your enquiry. Our senior strategy team will be in touch within 24 hours.', 'adlogix'),
        ], 200);
    }

    /** Book a Call popup. */
    public function handle_booking_submission($request) {
        $params = $request->get_json_params();

        if (!empty($params['_honeypot'])) {
            return new WP_REST_Response(['success' => true, 'message' => 'Received.'], 200);
        }

        $name = sanitize_text_field($params['name'] ?? '');
        $email = sanitize_email($params['email'] ?? '');

        if (empty($name) || empty($email) || !is_email($email)) {
            return new WP_Error('invalid_data', __('Please provide a valid name and email.', 'adlogix'), ['status' => 400]);
        }

        $result = $this->store_lead('adlogix_booking', [
            'name' => $name,
            'email' => $email,
            'company' => sanitize_text_field($params['company'] ?? ''),
            'goal' => sanitize_text_field($params['goal'] ?? ''),
            'budget' => sanitize_text_field($params['budget'] ?? ''),
        ], __('New Adlogix Call Booking', 'adlogix'));

        if (is_wp_error($result)) {
            return $result;
        }

        return new WP_REST_Response([
            'success' => true,
            'message' => __('Thank you. We will confirm your call slot by email shortly.', 'adlogix'),
        ], 200);
    }

    /** Admin list columns for both lead types. */
    public function lead_columns($columns) {
        $screen = get_current_screen();
        $post_type = $screen ? $screen->post_type : 'adlogix_enquiry';

        $new = ['cb' => $columns['cb'] ?? ''];
        foreach ($this->lead_fields($post_type) as $key => $label) {
            if ($key === 'details') {
                continue;
            }
            $new['adlogix_' . $key] = $label;
        }
        $new['date'] = __('Received', 'adlogix');

        return $new;
    }

    public function lead_column($column, $post_id) {
        if (strpos($column, 'adlogix_') !== 0) {
            return;
        }

        $value = get_post_meta($post_id, '_' . $column, true);
        if ($value === '') {
            echo '&mdash;';
            return;
        }

        if ($column === 'adlogix_email') {
            printf('<a href="mailto:%1$s">%1$s</a>', esc_attr($value));
            return;
        }

        echo esc_html($value);
    }

    /** A lead is a record of what someone sent, so the edit screen shows it read-only. */
    public function add_lead_meta_box($post) {
        add_meta_box(
            'adlogix_lead',
            __('Submission', 'adlogix'),
            [$this, 'render_lead_meta_box'],
            $post->post_type,
            'normal',
            'high'
        );
    }

    public function render_lead_meta_box($post) {
        $submitted = get_post_meta($post->ID, '_adlogix_submitted_at', true);
        echo '<table class="widefat striped"><tbody>';

        foreach ($this->lead_fields($post->post_type) as $key => $label) {
            $value = get_post_meta($post->ID, '_adlogix_' . $key, true);
            printf(
                '<tr><th scope="row" style="width:180px">%s</th><td>%s</td></tr>',
                esc_html($label),
                $value === '' ? '&mdash;' : nl2br(esc_html($value))
            );
        }

        if ($submitted) {
            printf(
                '<tr><th scope="row">%s</th><td>%s</td></tr>',
                esc_html__('Received', 'adlogix'),
                esc_html(mysql2date(get_option('date_format') . ' ' . get_option('time_format'), $submitted))
            );
        }

        echo '</tbody></table>';
    }

    public function lead_export_button($post_type) {
        if (!in_array($post_type, ['adlogix_enquiry', 'adlogix_booking'], true)) {
            return;
        }

        printf(
            '<a href="%s" class="button">%s</a>',
            esc_url(wp_nonce_url(
                admin_url('admin-post.php?action=adlogix_export_leads&post_type=' . $post_type),
                'adlogix_export_leads'
            )),
            esc_html__('Export CSV', 'adlogix')
        );
    }

    public function export_leads_csv() {
        $post_type = isset($_GET['post_type']) ? sanitize_key($_GET['post_type']) : '';

        if (!in_array($post_type, ['adlogix_enquiry', 'adlogix_booking'], true)
            || !current_user_can('edit_posts')
            || !isset($_GET['_wpnonce'])
            || !wp_verify_nonce(sanitize_key(wp_unslash($_GET['_wpnonce'])), 'adlogix_export_leads')) {
            wp_die(esc_html__('You are not allowed to export leads.', 'adlogix'), '', ['response' => 403]);
        }

        $fields = $this->lead_fields($post_type);
        $leads = get_posts([
            'post_type' => $post_type,
            'post_status' => 'publish',
            'numberposts' => -1,
            'orderby' => 'date',
            'order' => 'DESC',
        ]);

        nocache_headers();
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=' . $post_type . '-' . gmdate('Y-m-d') . '.csv');

        $out = fopen('php://output', 'w');
        fputcsv($out, array_merge(array_values($fields), [__('Received', 'adlogix')]));

        foreach ($leads as $lead) {
            $row = [];
            foreach (array_keys($fields) as $key) {
                $row[] = get_post_meta($lead->ID, '_adlogix_' . $key, true);
            }
            $row[] = get_post_meta($lead->ID, '_adlogix_submitted_at', true) ?: $lead->post_date;
            fputcsv($out, $row);
        }

        fclose($out);
        exit;
    }

    /**
     * Expose featured media source URLs directly in post object REST responses
     */
    public function expose_featured_media_urls() {
        $post_types = ['post'];
        foreach ($post_types as $pt) {
            register_rest_field($pt, 'featured_media_url', [
                'get_callback' => function ($post_arr) {
                    $media_id = $post_arr['featured_media'] ?? 0;
                    if ($media_id) {
                        return wp_get_attachment_image_url($media_id, 'full');
                    }
                    return null;
                },
                'schema' => null,
            ]);
        }
    }
}

new Adlogix_Headless_Core();
