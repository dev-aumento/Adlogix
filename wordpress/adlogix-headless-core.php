<?php
/**
 * Plugin Name: Adlogix Headless Core
 * Plugin URI: https://adlogix.agency
 * Description: Core Headless CMS configuration, Custom Post Types, ACF bindings, CORS headers, and REST API endpoints for the Adlogix React Frontend (Powered by Aumento Infoway).
 * Version: 1.1.0
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
    }

    const SECTIONS_META_KEY = '_adlogix_page_sections';
    const SECTIONS_NONCE = 'adlogix_page_sections_nonce';

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

    /**
     * Register Custom Post Types with REST API support
     */
    public function register_post_types() {
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
            'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
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
            'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
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
            'supports' => ['title', 'thumbnail', 'custom-fields', 'excerpt'],
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
            'supports' => ['title', 'editor', 'thumbnail', 'custom-fields'],
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
            'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
            'menu_icon' => 'dashicons-building',
            'has_archive' => true,
            'rewrite' => ['slug' => 'industries'],
        ]);
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
                'email' => get_option('admin_email', 'hello@adlogix.agency'),
                'phone' => get_option('adlogix_phone', '+1 (800) 592-3564'),
                'address' => get_option('adlogix_address', '742 Innovation Blvd, Suite 400'),
                'city' => get_option('adlogix_city', 'San Francisco, CA 94107'),
                'workingHours' => 'Mon – Fri: 9:00 AM – 6:30 PM (PST)'
            ],
            'socials' => [
                'instagram' => get_option('adlogix_instagram', 'https://instagram.com/adlogix.agency'),
                'linkedin' => get_option('adlogix_linkedin', 'https://linkedin.com/company/adlogix'),
                'twitter' => get_option('adlogix_twitter', 'https://twitter.com/adlogix_agency'),
            ]
        ];
    }

    /**
     * Securely handle and validate contact form enquiries
     */
    public function handle_enquiry_submission($request) {
        $params = $request->get_json_params();

        // Spam honeypot check
        if (!empty($params['_honeypot'])) {
            return new WP_REST_Response(['success' => true, 'message' => 'Received.'], 200);
        }

        $full_name = sanitize_text_field($params['fullName'] ?? '');
        $email = sanitize_email($params['businessEmail'] ?? '');
        $phone = sanitize_text_field($params['phone'] ?? '');
        $company = sanitize_text_field($params['company'] ?? '');
        $service = sanitize_text_field($params['serviceRequired'] ?? 'General');
        $budget = sanitize_text_field($params['budgetRange'] ?? 'Unspecified');
        $details = sanitize_textarea_field($params['projectDetails'] ?? '');

        if (empty($full_name) || empty($email) || !is_email($email)) {
            return new WP_Error('invalid_data', __('Please provide a valid name and business email.', 'adlogix'), ['status' => 400]);
        }

        // Email notification to Admin
        $to = get_option('admin_email');
        $subject = "New Adlogix Lead: {$company} ({$service})";
        $message = "You received a new growth enquiry from Adlogix website:\n\n"
                 . "Name: {$full_name}\n"
                 . "Email: {$email}\n"
                 . "Phone: {$phone}\n"
                 . "Company: {$company}\n"
                 . "Service: {$service}\n"
                 . "Budget: {$budget}\n\n"
                 . "Project Details:\n{$details}\n";

        wp_mail($to, $subject, $message);

        return new WP_REST_Response([
            'success' => true,
            'message' => 'Thank you for your enquiry. Our senior strategy team will be in touch within 24 hours.'
        ], 200);
    }

    /**
     * Expose featured media source URLs directly in post object REST responses
     */
    public function expose_featured_media_urls() {
        $post_types = ['post', 'services', 'projects', 'reels', 'testimonials', 'industries'];
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
