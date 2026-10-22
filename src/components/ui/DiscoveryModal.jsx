import React, { useState, useEffect } from 'react';
import { fillToken } from '../../content/helpers';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Video, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCMS } from '../../hooks/useCMS';
import { api } from '../../services/api';

export const DiscoveryModal = () => {
  const { isDiscoveryModalOpen, closeDiscoveryModal, popup: c } = useCMS();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    goal: '',
    date: 'Tomorrow, 2:00 PM PST',
    notes: '',
    _honeypot: '' // Anti-spam trap, same as the contact form
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeDiscoveryModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeDiscoveryModal]);

  if (!isDiscoveryModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData._honeypot) return;

    setIsSubmitting(true);
    setSubmitError('');
    try {
      // Its own endpoint, so bookings are stored apart from contact enquiries.
      await api.submitBooking({
        ...formData,
        goal: formData.goal || c.goalOptions[0],
        budget: formData.budget || c.budgetOptions[0],
      });
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setSubmitError("We couldn't send that just now. Please try again, or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setIsSuccess(false);
    setStep(1);
    closeDiscoveryModal();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/80 backdrop-blur-md"
        onClick={resetAndClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-brand-border"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={resetAndClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {!isSuccess ? (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-brand-blue uppercase tracking-wider mb-2">
                <Video className="w-4 h-4" />
                <span>{c.badge}</span>
              </div>
              {c.title && (
                <h3 className="text-2xl font-bold font-display text-brand-navy">{c.title}</h3>
              )}
              {c.subtitle && (
                <p className="text-sm text-brand-muted mt-1.5 leading-relaxed">{c.subtitle}</p>
              )}

              {(c.metaDuration || c.metaPlatform || c.metaPrice) && (
                <div className="mt-4 flex items-center gap-4 py-2 px-3.5 bg-brand-surface-soft rounded-xl text-xs text-brand-navy font-medium">
                  {c.metaDuration && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-blue" />
                      {c.metaDuration}
                    </span>
                  )}
                  {c.metaPlatform && (
                    <span className="flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-brand-blue" />
                      {c.metaPlatform}
                    </span>
                  )}
                  {c.metaPrice && (
                    <span className="text-emerald-600 font-semibold ml-auto">{c.metaPrice}</span>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* Anti-spam trap: hidden from people, tempting to bots */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  name="_honeypot"
                  value={formData._honeypot}
                  onChange={(e) => setFormData({ ...formData, _honeypot: e.target.value })}
                  className="absolute left-[-9999px] w-px h-px opacity-0"
                />
                {submitError && (
                  <p className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                    {submitError}
                  </p>
                )}
                <div>
                  <label className="block text-xs font-semibold text-brand-navy mb-1">
                    {c.nameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={c.namePlaceholder}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-brand-border focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-brand-navy mb-1">
                      {c.emailLabel}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={c.emailPlaceholder}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-brand-border focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-navy mb-1">
                      {c.companyLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder={c.companyPlaceholder}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-brand-border focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-navy mb-1">
                    {c.goalLabel}
                  </label>
                  <select
                    value={formData.goal || c.goalOptions[0]}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-brand-border focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none bg-white transition-all"
                  >
                    {c.goalOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-navy mb-1">
                    {c.budgetLabel}
                  </label>
                  <select
                    value={formData.budget || c.budgetOptions[0]}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-brand-border focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none bg-white transition-all"
                  >
                    {c.budgetOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3.5 px-6 rounded-full bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-sm shadow-lg shadow-brand-blue/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{c.submitLabel}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              {c.successTitle && (
                <h3 className="text-2xl font-bold font-display text-brand-navy">{c.successTitle}</h3>
              )}
              {c.successText && (
                <p className="text-sm text-brand-muted max-w-sm mx-auto leading-relaxed">
                  {fillToken(c.successText, 'email', formData.email)}
                </p>
              )}
              <button
                onClick={resetAndClose}
                className="mt-4 px-6 py-2.5 rounded-full bg-brand-navy text-white text-xs font-semibold hover:bg-brand-navy-dark transition-all"
              >
                {c.successButton}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
