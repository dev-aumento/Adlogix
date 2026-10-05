<?php
/**
 * Plugin Name: Adlogix Headless Core
 * Plugin URI: https://adlogix.agency
 * Description: Core Headless CMS configuration, Custom Post Types, ACF bindings, CORS headers, and REST API endpoints for the Adlogix React Frontend (Powered by Aumento Infoway).
 * Version: 1.0.0
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
