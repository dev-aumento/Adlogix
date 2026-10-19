import React from 'react';
import { SEOHead } from '../components/ui/SEOHead';
import { Breadcrumb } from '../components/ui/Breadcrumb';

export const TermsPage = () => {
  return (
    <>
      <SEOHead
        title="Terms & Conditions | Adlogix Agency"
        description="Review the terms and conditions governing professional digital marketing, web engineering, and media services with Adlogix."
        canonical="https://adlogix.in/terms"
      />

      <div className="bg-white py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Terms & Conditions" }]} />

          <h1 className="editorial-heading text-3xl sm:text-4xl font-black text-brand-navy mt-6 mb-8">
            Terms of Service
          </h1>

          <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6 text-slate-700">
            <p><strong>Last Updated: October 1, 2026</strong></p>

            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing and using this website or engaging Adlogix for digital marketing, performance advertising, video production, or web development services, you agree to comply with these terms.
            </p>

            <h2>2. Scope of Services</h2>
            <p>
              Adlogix provides specialized digital growth, creative design, media buying, and headless technology solutions. Individual project deliverables, schedules, and fee structures are formalized in specific Master Services Agreements (MSAs) or Statements of Work (SOWs).
            </p>

            <h2>3. Intellectual Property</h2>
            <p>
              Upon full payment for completed deliverables, all custom-produced creative video reels, graphics, ad copy, and bespoke web frontend source code are assigned to the client, subject to standard licensing for third-party libraries and frameworks.
            </p>

            <h2>4. Technology Partner Attribution</h2>
            <p>
              Adlogix operates with technology partnership capabilities through <strong>Aumento Infoway</strong>. Technical architectures and integrations may be engineered collaboratively under professional standards.
            </p>

            <h2>5. Limitation of Liability</h2>
            <p>
              While Adlogix employs rigorous conversion rate optimization and performance testing methodologies, digital advertising auctions and organic search rankings are subject to third-party algorithm updates (e.g. Meta, Google).
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
