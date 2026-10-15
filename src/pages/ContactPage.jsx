import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, ArrowRight, CheckCircle2, AlertCircle, Sparkles, Video, Calendar } from 'lucide-react';
import { SEOHead } from '../components/ui/SEOHead';
import { Button } from '../components/ui/Button';
import { PageSections } from '../components/sections/PageSections';
import { useCMS } from '../hooks/useCMS';
import { usePageContent } from '../hooks/usePageContent';
import { api } from '../services/api';

const ContactHero = () => (
  <section className="py-16 sm:py-24 bg-brand-surface-soft/60 relative overflow-hidden border-b border-brand-border">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blue-light text-brand-blue text-xs font-bold border border-brand-blue/20 mb-6"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>Let's Build Something Great</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="editorial-heading text-4xl sm:text-5xl lg:text-6xl text-brand-navy font-black leading-[1.1]"
      >
        Start Your Next{' '}
        <span className="gradient-text-blue block mt-1">
          Growth Chapter.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-6 text-base sm:text-lg text-brand-muted leading-relaxed"
      >
        Whether you have a specific campaign to execute or want a holistic review of your growth architecture, our team responds within 24 hours.
      </motion.p>
    </div>
  </section>
);

// Form and sidebar share one grid, so they move as one section.
const ContactEnquiry = () => {
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get('service') || '';
  const preselectedProject = searchParams.get('project') || '';
  const preselectedIndustry = searchParams.get('industry') || '';

  const { settings, openDiscoveryModal } = useCMS();

  const [formData, setFormData] = useState({
    fullName: '',
    businessEmail: '',
    phone: '',
    company: '',
    serviceRequired: preselectedService || 'Performance Marketing',
    budgetRange: '₹30,000 - ₹75,000',
    projectDetails: preselectedProject ? `Inquiry regarding case study: ${preselectedProject}` : (preselectedIndustry ? `Inquiry regarding industry solution: ${preselectedIndustry}` : ''),
    privacyConsent: false,
    _honeypot: '' // Anti-spam trap
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const servicesList = [
    "Performance Marketing",
    "Meta & Google Ads",
    "Video Production & Reels",
    "SEO & Search Authority",
    "Shopify D2C Storefront",
    "React / Next.js Web App",
    "Headless WordPress CMS",
    "Full Growth Overhaul"
  ];

  const budgetRanges = [
    "Under ₹30,000",
    "₹30,000 - ₹75,000",
    "₹75,000 - ₹2,00,000",
    "₹2,00,000 - ₹5,00,000",
    "₹5,00,000+"
  ];

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = "Full name is required.";
    if (!formData.businessEmail.trim()) {
      errs.businessEmail = "Business email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.businessEmail)) {
      errs.businessEmail = "Please enter a valid email address.";
    }
    if (!formData.phone.trim()) errs.phone = "Phone number is required.";
    if (!formData.company.trim()) errs.company = "Company/brand name is required.";
    if (!formData.projectDetails.trim()) errs.projectDetails = "Please describe your project or objectives.";
    if (!formData.privacyConsent) errs.privacyConsent = "You must agree to the Privacy Policy.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    // Spam honeypot detection
    if (formData._honeypot) {
      console.warn("Spam bot submission caught.");
      setSubmitSuccess(true);
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await api.submitEnquiry(formData);
      if (res.success) {
        setSubmitSuccess(true);
      } else {
        setSubmitError(res.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setSubmitError("Failed to submit enquiry. Please email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Form Column (Left 7 Cols) */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-brand-border shadow-glossy relative overflow-hidden">
              
              {!submitSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot field (hidden from humans) */}
                  <input
                    type="text"
                    name="_honeypot"
                    value={formData._honeypot}
                    onChange={(e) => setFormData({ ...formData, _honeypot: e.target.value })}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div className="space-y-1 mb-4">
                    <h2 className="text-2xl font-bold font-display text-brand-navy">
                      Project Enquiry Form
                    </h2>
                    <p className="text-xs text-brand-muted">
                      Fill out the details below and an executive strategist will get back to you.
                    </p>
                  </div>

                  {/* Error Alert */}
                  {submitError && (
                    <div className="p-4 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold flex items-center gap-2 border border-rose-200">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Full Name & Business Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-navy mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Marcus Vance"
                        className={`w-full px-4 py-3 text-sm rounded-xl border ${
                          errors.fullName ? 'border-rose-500 bg-rose-50/20' : 'border-brand-border'
                        } focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none transition-all`}
                      />
                      {errors.fullName && (
                        <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-navy mb-1.5">
                        Business Email *
                      </label>
                      <input
                        type="email"
                        value={formData.businessEmail}
                        onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                        placeholder="marcus@company.com"
                        className={`w-full px-4 py-3 text-sm rounded-xl border ${
                          errors.businessEmail ? 'border-rose-500 bg-rose-50/20' : 'border-brand-border'
                        } focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none transition-all`}
                      />
                      {errors.businessEmail && (
                        <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.businessEmail}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone & Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-navy mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 019-2834"
                        className={`w-full px-4 py-3 text-sm rounded-xl border ${
                          errors.phone ? 'border-rose-500 bg-rose-50/20' : 'border-brand-border'
                        } focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none transition-all`}
                      />
                      {errors.phone && (
                        <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-navy mb-1.5">
                        Company or Brand Name *
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. Apex Realty"
                        className={`w-full px-4 py-3 text-sm rounded-xl border ${
                          errors.company ? 'border-rose-500 bg-rose-50/20' : 'border-brand-border'
                        } focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none transition-all`}
                      />
                      {errors.company && (
                        <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.company}</p>
                      )}
                    </div>
                  </div>

                  {/* Service Required Selector */}
                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-2">
                      Service Required
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {servicesList.map((srv) => (
                        <button
                          type="button"
                          key={srv}
                          onClick={() => setFormData({ ...formData, serviceRequired: srv })}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            formData.serviceRequired === srv
                              ? 'bg-brand-blue text-white shadow-sm'
                              : 'bg-brand-surface-soft text-slate-600 border border-brand-border hover:border-brand-blue/40'
                          }`}
                        >
                          {srv}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Budget Range */}
                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-2">
                      Approximate Budget Range
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {budgetRanges.map((b) => (
                        <button
                          type="button"
                          key={b}
                          onClick={() => setFormData({ ...formData, budgetRange: b })}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                            formData.budgetRange === b
                              ? 'bg-brand-navy text-white shadow-sm'
                              : 'bg-brand-surface-soft text-slate-600 border border-brand-border hover:border-brand-navy/30'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Project Details */}
                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1.5">
                      Project Overview & Target Goals *
                    </label>
                    <textarea
                      rows={4}
                      value={formData.projectDetails}
                      onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
                      placeholder="Tell us about your brand, current challenges, timeline, and what success looks like..."
                      className={`w-full px-4 py-3 text-sm rounded-xl border ${
                        errors.projectDetails ? 'border-rose-500 bg-rose-50/20' : 'border-brand-border'
                      } focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none transition-all`}
                    />
                    {errors.projectDetails && (
                      <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.projectDetails}</p>
                    )}
                  </div>

                  {/* Privacy Consent Checkbox */}
                  <div>
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.privacyConsent}
                        onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.checked })}
                        className="mt-0.5 w-4 h-4 rounded text-brand-blue focus:ring-brand-blue border-brand-border"
                      />
                      <span className="text-xs text-brand-muted leading-relaxed select-none">
                        I agree to the processing of my contact information in accordance with the{' '}
                        <Link to="/privacy-policy" className="text-brand-blue underline font-semibold">
                          Privacy Policy
                        </Link>. Your information is kept strictly confidential.
                      </span>
                    </label>
                    {errors.privacyConsent && (
                      <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.privacyConsent}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-8 rounded-full bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-base shadow-lg shadow-brand-blue/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Send Project Enquiry</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Success State */
                <div className="py-12 text-center space-y-5">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-black font-display text-brand-navy">
                    Enquiry Received!
                  </h3>
                  <p className="text-sm text-brand-muted max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-brand-navy">{formData.fullName}</strong>. Our senior growth strategist will review your information and reply within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitSuccess(false);
                      setFormData({
                        fullName: '',
                        businessEmail: '',
                        phone: '',
                        company: '',
                        serviceRequired: 'Performance Marketing',
                        budgetRange: '₹30,000 - ₹75,000',
                        projectDetails: '',
                        privacyConsent: false,
                        _honeypot: ''
                      });
                    }}
                    className="mt-4 px-6 py-2.5 rounded-full bg-brand-surface-soft border border-brand-border text-xs font-bold text-brand-navy hover:bg-slate-100 transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              )}

            </div>
          </div>

          {/* Contact Info & Discovery Call Sidebar (Right 5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Instant Video Discovery Call Card */}
            <div className="p-8 rounded-3xl bg-brand-navy text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center">
                  <Video className="w-5 h-5 text-white" />
                </div>

                <h3 className="text-xl font-bold font-display">
                  Need Immediate Strategic Clarity?
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Skip the form and jump straight onto a live 30-minute Google Meet discovery session with our managing directors.
                </p>

                <Button
                  onClick={openDiscoveryModal}
                  variant="primary"
                  size="md"
                  className="w-full justify-center"
                  icon={Calendar}
                >
                  Book 30-Min Discovery Call
                </Button>
              </div>
            </div>

            {/* Office & Coordinates Info */}
            <div className="p-8 rounded-3xl bg-brand-surface-soft border border-brand-border shadow-card-subtle space-y-6">
              <h3 className="text-base font-bold font-display text-brand-navy">
                Agency Coordinates
              </h3>

              <div className="space-y-4 text-xs text-brand-muted">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-brand-navy">Email Us</div>
                    <a href={`mailto:${settings.contact?.email}`} className="hover:text-brand-blue transition-colors">
                      {settings.contact?.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-brand-navy">Direct Line</div>
                    <a href={`tel:${settings.contact?.phone}`} className="hover:text-brand-blue transition-colors">
                      {settings.contact?.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-brand-navy">Studio Location</div>
                    <div>{settings.contact?.address}, {settings.contact?.city}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-brand-navy">Working Hours</div>
                    <div>{settings.contact?.workingHours}</div>
                  </div>
                </div>
              </div>

              {/* Partner Attribution Box */}
              <div className="pt-4 border-t border-brand-border/60">
                <div className="text-[11px] text-slate-500">
                  Technology Partner:{' '}
                  <a
                    href={settings.poweredBy?.url || 'https://aumentoinfoway.com/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-brand-navy hover:text-brand-blue underline"
                  >
                    Aumento Infoway
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

// Keys must match the "contact" entry in the plugin's section registry.
const contactSections = {
  hero: ContactHero,
  enquiry: ContactEnquiry
};

export const ContactPage = () => {
  const { content, order } = usePageContent('contact');

  return (
    <>
      <SEOHead
        title="Contact Us | Start a Project or Book a Discovery Call | Adlogix"
        description="Ready to scale your marketing or build high-performance web software? Contact Adlogix today for proposals, consultations, and creative reviews."
        canonical="https://adlogix.agency/contact"
      />

      <div className="bg-white">
        <PageSections sections={contactSections} order={order} content={content} />
      </div>
    </>
  );
};
