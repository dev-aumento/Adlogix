import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Video, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCMS } from '../../hooks/useCMS';
import { api } from '../../services/api';

export const DiscoveryModal = () => {
  const { isDiscoveryModalOpen, closeDiscoveryModal } = useCMS();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    goal: 'Scale Paid Ads & Creative',
    date: 'Tomorrow, 2:00 PM PST',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
    setIsSubmitting(true);
    try {
      await api.submitEnquiry({ ...formData, type: 'Discovery Call Booking' });
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
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
                <span>30-Min Strategy Session</span>
              </div>
              <h3 className="text-2xl font-bold font-display text-brand-navy">
                Book a Growth Discovery Call
              </h3>
              <p className="text-sm text-brand-muted mt-1.5 leading-relaxed">
                Connect with an Adlogix creative & performance strategist to uncover your biggest revenue growth opportunities.
              </p>

              <div className="mt-4 flex items-center gap-4 py-2 px-3.5 bg-brand-surface-soft rounded-xl text-xs text-brand-navy font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand-blue" />
                  30 mins
                </span>
                <span className="flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-brand-blue" />
                  Google Meet / Zoom
                </span>
                <span className="text-emerald-600 font-semibold ml-auto">100% Free</span>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-navy mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-brand-border focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-brand-navy mb-1">
                      Business Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="sarah@company.com"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-brand-border focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-navy mb-1">
                      Company / Brand Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Lumina Luxe"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-brand-border focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-navy mb-1">
                    Primary Objective
                  </label>
                  <select
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-brand-border focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none bg-white transition-all"
                  >
                    <option value="Scale Paid Ads & Creative">Scale Paid Ads & Creative (Meta/Google)</option>
                    <option value="High-Impact Video Reels & Shoots">High-Impact Video Reels & Shoots</option>
                    <option value="New React or Shopify Website">New React or Shopify Website</option>
                    <option value="Headless WordPress Development">Headless WordPress Development</option>
                    <option value="Full Digital Growth Overhaul">Full Digital Growth Overhaul</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-navy mb-1">
                    What's your current monthly ad spend or project budget?
                  </label>
                  <select
                    value={formData.budget || '₹30,000 – ₹1,00,000 / month'}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-brand-border focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none bg-white transition-all"
                  >
                    <option value="₹30,000 – ₹1,00,000 / mo">₹30,000 – ₹1,00,000 / month</option>
                    <option value="₹1,00,000 – ₹3,00,000 / mo">₹1,00,000 – ₹3,00,000 / month</option>
                    <option value="₹3,00,000 – ₹10,00,000+ / mo">₹3,00,000 – ₹10,00,000+ / month</option>
                    <option value="One-time project (₹50,000 – ₹5,00,000)">One-time project (₹50,000 – ₹5,00,000)</option>
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
                      <span>Confirm Discovery Call</span>
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
              <h3 className="text-2xl font-bold font-display text-brand-navy">
                Discovery Session Confirmed!
              </h3>
              <p className="text-sm text-brand-muted max-w-sm mx-auto leading-relaxed">
                We've reserved your slot and sent a calendar invite with Google Meet coordinates to <span className="font-semibold text-brand-navy">{formData.email}</span>.
              </p>
              <button
                onClick={resetAndClose}
                className="mt-4 px-6 py-2.5 rounded-full bg-brand-navy text-white text-xs font-semibold hover:bg-brand-navy-dark transition-all"
              >
                Close Window
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
