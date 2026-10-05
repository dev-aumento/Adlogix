import React from 'react';
import { SEOHead } from '../components/ui/SEOHead';
import { Breadcrumb } from '../components/ui/Breadcrumb';

export const PrivacyPolicyPage = () => {
  return (
    <>
      <SEOHead
        title="Privacy Policy | Adlogix Agency"
        description="Our privacy policy outlines how Adlogix collects, protects, and handles personal data and client communications."
        canonical="https://adlogix.agency/privacy-policy"
      />

      <div className="bg-white py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Privacy Policy" }]} />

          <h1 className="editorial-heading text-3xl sm:text-4xl font-black text-brand-navy mt-6 mb-8">
            Privacy Policy
          </h1>

          <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6 text-slate-700">
            <p><strong>Last Updated: October 1, 2026</strong></p>

            <h2>1. Information We Collect</h2>
            <p>
              Adlogix ("we", "us", "our") collects information provided directly by users when submitting enquiry forms, requesting discovery calls, or subscribing to industry insights. This information may include your full name, business email address, phone number, company name, and project requirements.
            </p>

            <h2>2. How We Use Information</h2>
            <p>
              We use the collected information exclusively to:
            </p>
            <ul>
              <li>Respond to your project inquiries and provide tailored growth proposals.</li>
              <li>Schedule discovery strategy sessions and consultation meetings.</li>
              <li>Deliver digital marketing, video production, and technology services as agreed under contract.</li>
              <li>Improve website performance, user experience, and server-side conversion measurement.</li>
            </ul>

            <h2>3. Information Sharing & Third Parties</h2>
            <p>
              We do not sell, rent, or trade your personal information. We may share information with trusted technology partners, including <strong>Aumento Infoway</strong>, solely for the technical execution of web development and software integration projects requested by the client.
            </p>

            <h2>4. Cookies & Analytics</h2>
            <p>
              Our website uses cookies and server-side tracking (Google Analytics 4, Meta Conversions API) to understand user interactions and optimize page rendering speeds. You can configure your browser to decline cookies if preferred.
            </p>

            <h2>5. Contact Us</h2>
            <p>
              If you have any questions regarding this Privacy Policy, please contact us at <a href="mailto:privacy@adlogix.agency" className="text-brand-blue underline">privacy@adlogix.agency</a>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
