import { toSafeLink } from '../services/normalizers';
import { text, fillToken } from './helpers';

/**
 * Contact page content. `contactDefaults` renders only while WordPress is loading or when the
 * `contact` page has no ACF fields; `mapContactFields` maps the ACF fields of that page (see
 * wordpress/acf/page-contact.json) into the same shape.
 *
 * The top-level keys must match the page's section keys in the plugin registry (`hero`,
 * `enquiry`), because `PageSections` hands each section component `content[key]`. A key that
 * does not match leaves the component with nothing and it silently shows these defaults.
 *
 * Submissions are not content: they are stored by the plugin as **Enquiries** records
 * (`/adlogix/v1/enquiry`), separate from the Book a Call popup's **Call Bookings**.
 */
export const contactDefaults = {
  hero: {
    badge: "Let's Build Something Great",
    headline: {
      line1: 'Start Your Next',
      highlight1: 'Growth Chapter.'
    },
    description:
      'Whether you have a specific campaign to execute or want a holistic review of your growth architecture, our team responds within 24 hours.'
  },

  enquiry: {
    form: {
      title: 'Project Enquiry Form',
      subtitle: 'Fill out the details below and an executive strategist will get back to you.',
      nameLabel: 'Full Name *',
      namePlaceholder: 'e.g. Marcus Vance',
      emailLabel: 'Business Email *',
      emailPlaceholder: 'marcus@company.com',
      phoneLabel: 'Phone Number *',
      phonePlaceholder: '+1 (555) 019-2834',
      companyLabel: 'Company or Brand Name *',
      companyPlaceholder: 'e.g. Apex Realty',
      serviceLabel: 'Service Required',
      budgetLabel: 'Approximate Budget Range',
      detailsLabel: 'Project Overview & Target Goals *',
      detailsPlaceholder:
        'Tell us about your brand, current challenges, timeline, and what success looks like...',
      consentText: 'I agree to the processing of my contact information in accordance with the',
      consentLinkLabel: 'Privacy Policy',
      consentSuffix: '. Your information is kept strictly confidential.',
      submitLabel: 'Send Project Enquiry',
      successTitle: 'Enquiry Received!',
      successText:
        'Thank you, {name}. Our senior growth strategist will review your information and reply within 24 hours.',
      resetLabel: 'Submit Another Inquiry'
    },

    sidebar: {
      callTitle: 'Need Immediate Strategic Clarity?',
      callText:
        'Skip the form and jump straight onto a live 30-minute Google Meet discovery session with our managing directors.',
      callButton: 'Book 30-Min Discovery Call',
      coordinatesTitle: 'Agency Coordinates',
      emailLabel: 'Email Us',
      email: 'support@adlogix.in',
      phoneLabel: 'Direct Line',
      phone: '+1 (800) 592-3564',
      addressLabel: 'Studio Location',
      address: '742 Innovation Blvd, Suite 400, San Francisco, CA 94107',
      hoursLabel: 'Working Hours',
      hours: 'Mon – Fri: 9:00 AM – 6:30 PM (PST)',
      partnerLabel: 'Technology Partner:',
      partnerName: 'Aumento Infoway',
      partnerUrl: 'https://aumentoinfoway.com/'
    }
  }
};

/** Put the sender's name into the success message's `{name}` placeholder. */
export const fillName = (template, name) => fillToken(template, 'name', name);

export function mapContactFields(f) {
  return {
    hero: {
      badge: text(f, 'hero_badge_text'),
      headline: {
        line1: text(f, 'hero_headline_line_1'),
        highlight1: text(f, 'hero_headline_highlight_1')
      },
      description: text(f, 'hero_description')
    },

    enquiry: {
      form: {
        title: text(f, 'form_title'),
        subtitle: text(f, 'form_subtitle'),
        nameLabel: text(f, 'form_name_label'),
        namePlaceholder: text(f, 'form_name_placeholder'),
        emailLabel: text(f, 'form_email_label'),
        emailPlaceholder: text(f, 'form_email_placeholder'),
        phoneLabel: text(f, 'form_phone_label'),
        phonePlaceholder: text(f, 'form_phone_placeholder'),
        companyLabel: text(f, 'form_company_label'),
        companyPlaceholder: text(f, 'form_company_placeholder'),
        serviceLabel: text(f, 'form_service_label'),
        budgetLabel: text(f, 'form_budget_label'),
        detailsLabel: text(f, 'form_details_label'),
        detailsPlaceholder: text(f, 'form_details_placeholder'),
        consentText: text(f, 'form_consent_text'),
        consentLinkLabel: text(f, 'form_consent_link_label'),
        consentSuffix: text(f, 'form_consent_suffix'),
        submitLabel: text(f, 'form_submit_label'),
        successTitle: text(f, 'form_success_title'),
        successText: text(f, 'form_success_text'),
        resetLabel: text(f, 'form_reset_label')
      },

      sidebar: {
        callTitle: text(f, 'sidebar_call_title'),
        callText: text(f, 'sidebar_call_text'),
        callButton: text(f, 'sidebar_call_button'),
        coordinatesTitle: text(f, 'sidebar_coordinates_title'),
        emailLabel: text(f, 'sidebar_email_label'),
        email: text(f, 'sidebar_email'),
        phoneLabel: text(f, 'sidebar_phone_label'),
        phone: text(f, 'sidebar_phone'),
        addressLabel: text(f, 'sidebar_address_label'),
        address: text(f, 'sidebar_address'),
        hoursLabel: text(f, 'sidebar_hours_label'),
        hours: text(f, 'sidebar_hours'),
        partnerLabel: text(f, 'sidebar_partner_label'),
        partnerName: text(f, 'sidebar_partner_name'),
        partnerUrl: toSafeLink(f.sidebar_partner_url)
      }
    }
  };
}
