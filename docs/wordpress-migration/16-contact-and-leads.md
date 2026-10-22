# Contact page and lead capture

Two separate things live here: the **Contact page content** (editable like every other page) and the **leads** the site captures, which are now stored in WordPress.

---

# Part 1 — Leads

## What was wrong

| Problem | Effect |
|---|---|
| `handle_enquiry_submission()` only called `wp_mail()` | **Nothing was stored.** If mail failed — likely with no SMTP on the server — the lead was lost and the visitor still saw "thank you". |
| `api.submitEnquiry()` was gated by `VITE_ENABLE_WP_SYNC` (false) | Nothing reached WordPress at all. Both forms waited 800 ms and showed a fake success. |
| The Book a Call popup posted to the enquiry endpoint with different field names (`name`/`email` instead of `fullName`/`businessEmail`) | Every booking would have failed validation with a 400. |
| The popup had no honeypot | The contact form had spam protection; the popup did not. |
| The popup's success screen claimed a calendar invite had been sent | Untrue — nothing sends an invite. |

## How it works now

Plugin **1.5.0** registers two post types, one per form, so the two never mix:

| Form | Endpoint | Stored as | Admin menu |
|---|---|---|---|
| Contact page enquiry form | `POST /adlogix/v1/enquiry` | `adlogix_enquiry` | **Enquiries** |
| Book a Call popup | `POST /adlogix/v1/booking` | `adlogix_booking` | **Call Bookings** |

Each submission creates one record titled "Name - Company", with every field saved as post meta and a `_adlogix_submitted_at` timestamp. The admin is emailed afterwards, with a link to the record.

**The record is written before the email is sent**, so a mail failure no longer loses the lead.

### Privacy and security

These post types are deliberately locked down:

```php
'public'             => false,   // no front-end URL
'publicly_queryable' => false,
'exclude_from_search'=> true,
'show_in_rest'       => false,   // never readable over the REST API
'capabilities'       => ['create_posts' => 'do_not_allow'],
```

So the public endpoint can **write** a lead, but nothing can **read** leads except a logged-in user in wp-admin. `show_in_rest => false` matters most: without it, every name, email and phone number would be downloadable from `/wp-json`. Leads cannot be created by hand in the admin either, since a lead is a record of something a visitor actually sent.

Both endpoints keep `permission_callback => '__return_true'` because a public form must be able to post without a nonce. Protection comes from the honeypot field, required-field validation and `is_email()`.

### Admin screens

Each screen lists the submissions with sortable date, a column per field, a clickable email address, and an **Export CSV** button. Opening one shows the submission read-only — a lead is a record of what someone sent, not a document to edit.

| Enquiries columns | Call Bookings columns |
|---|---|
| Name, Email, Phone, Company, Service, Budget, Received | Name, Email, Company, Primary goal, Budget, Received |

The CSV export is nonce-checked and requires `edit_posts`.

### Email delivery

`wp_mail()` on a plain Docker WordPress usually has no mail transport, so **notification emails may silently not arrive**. The leads are still saved either way. To get the emails, install an SMTP plugin on the VPS and point it at a real mailbox. Worth testing with one submission before relying on it.

---

# Part 2 — Contact page content

| Item | Value |
|---|---|
| WordPress slug | `contact` (page ID **503**) |
| Field group | `Contact Page Content` (`group_adlogix_page_contact`), file `wordpress/acf/page-contact.json` |
| Content model | `contactDefaults` + `mapContactFields` in `src/content/contact.js` |
| Page component | `src/pages/ContactPage.jsx` → `<PageSections>` |

## The model keys must match the section keys

`PageSections` hands each section component `content[<section key>]`. The Contact page's sections are **`hero`** and **`enquiry`**, so the content model's top level must use those exact names.

This bit once: the model returned `hero`, `form` and `sidebar`, so `content['enquiry']` was `undefined` and the form and sidebar silently showed their built-in defaults no matter what was saved in WordPress — while the hero updated normally. The form and sidebar fields now live **nested under `enquiry`**.

It fails quietly rather than loudly, so it is worth checking whenever a page model is added: every section key in `get_section_registry()` needs a matching top-level key in that page's defaults, apart from sections rendered by a shared component that reads another page (Reels' Studio Showcase) and model-only keys for detail templates (`detail`).

## Fields by tab

| Tab (section key) | Covers |
|---|---|
| Hero (`hero`) | Badge, both headline lines, intro paragraph |
| Enquiry Form (`enquiry`) | Form heading and subheading, every field label and placeholder, the consent sentence and its Privacy Policy link text, the submit button, and the success screen |
| Sidebar | The Book a Call card, "Agency Coordinates" and its four rows, and the technology partner line |

The success message takes a **`{name}`** placeholder, replaced with what the sender typed.

Blank behaviour: each sidebar row (email, phone, address, hours) disappears when its **value** is cleared, the Book a Call button hides without a label, and the "Send another" button hides when its label is cleared.

### The sidebar details moved

The email, phone, address and working hours used to come from `defaultSiteSettings` through `/adlogix/v1/settings`, which is still gated by `VITE_ENABLE_WP_SYNC` — so they were effectively hardcoded. They are now fields on the Contact page.

Note the overlap: the **Site Footer** entry has its own email and phone. They are independent on purpose — the footer shows a general address while the Contact page can show a sales line — but if you want them identical, set both.

## WordPress admin setup

1. **Deploy the plugin** (this is what creates the lead screens):
   ```bash
   cd /opt/adlogix && git pull
   cd /docker/adlogix-wordpress && docker compose restart wordpress
   ```
2. **Custom Fields → Tools → Import Field Groups**: upload `wordpress/acf/page-contact.json`.
3. Open **Pages → Contact** and review the three tabs.
4. Deploy the React build.
5. Send one test submission through each form and confirm a row appears under **Enquiries** and **Call Bookings**.

## How to test

1. Submit the contact form → a row under **Enquiries** with all seven fields.
2. Submit the Book a Call popup → a row under **Call Bookings**, and **nothing** under Enquiries.
3. Open a record and confirm the read-only submission table.
4. Click **Export CSV** on each screen.
5. Confirm `https://adlogix.in/wp-json/wp/v2/adlogix_enquiry` returns **404** — leads must not be public.
6. Clear the sidebar phone number and confirm only that row disappears.
7. `npm run build` must succeed.

---

# Part 3 — The Book a Call popup

The popup opens from the header button, the mobile menu, the hero, the Growth Plans section, the closing CTA and ten pages — **fifteen places in all**. It belongs to no single page, so like the header and footer it is global chrome with one published entry.

| Item | Value |
|---|---|
| Admin screen | **Call Popup** (post type `site_popup`), beside Site Header and Site Footer |
| Field group | `Call Popup Content` (`group_adlogix_popup`), file `wordpress/acf/post-type-popup.json` |
| Delivered by | `GET /adlogix/v1/layout`, alongside `header` and `footer` — the same request the site already makes |
| React | `defaultPopup` + `normalizePopup` in `src/content/layout.js`; exposed as `popup` on `CMSContext`; rendered by `src/components/ui/DiscoveryModal.jsx` |
| Plugin | **1.6.0** |

Only one entry is kept: once a Call Popup is published, **Add New** disappears, exactly as for Site Header and Site Footer.

## Fields by tab

| Tab | Fields |
|---|---|
| Header | `badge`, `title`, `subtitle`, and the grey strip: `meta_duration`, `meta_platform`, `meta_price` |
| Form | Label and placeholder for name, email and company; `goal_label` + `goal_options`; `budget_label` + `budget_options`; `submit_label` |
| Success | `success_title`, `success_text`, `success_button` |

`success_text` takes an **`{email}`** placeholder, replaced with the address the visitor typed.

Blank behaviour: the badge pill, each item of the grey strip, and the close button all disappear when cleared. **The two dropdowns are the exception** — clearing their options falls back to the built-in list, because a picker with no options could not be answered.

Nothing here changes where submissions go: they are still stored as **Call Bookings**, separate from Enquiries.

## Admin setup

1. Deploy plugin **1.6.0** (`git pull` + `docker compose restart wordpress`).
2. **Custom Fields → Tools → Import Field Groups**: `wordpress/acf/post-type-popup.json`.
3. **Call Popup → Add Call Popup**, title it anything (e.g. "Book a Call"), fill the three tabs, **Publish**.
4. Deploy the React build.
5. Open the popup from the header and confirm your wording appears.

Until an entry is published the popup shows its built-in wording, so the site is never blank mid-setup.

