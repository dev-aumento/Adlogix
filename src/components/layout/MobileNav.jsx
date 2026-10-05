import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronRight, Phone, Mail, Sparkles, ArrowRight } from 'lucide-react';
import { useCMS } from '../../hooks/useCMS';
import { Button } from '../ui/Button';

export const MobileNav = ({ isOpen, onClose }) => {
  const { settings, openDiscoveryModal } = useCMS();
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-brand-navy/60 backdrop-blur-md lg:hidden"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col justify-between overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 border-b border-brand-border flex items-center justify-between">
            <Link to="/" onClick={onClose} className="flex items-center gap-2.5">
              <div className="w-8 h-8 aspect-square rounded-xl bg-gradient-to-tr from-brand-blue to-indigo-600 flex items-center justify-center text-white font-black text-base shadow-sm shrink-0">
                A
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xl font-black font-display text-brand-navy tracking-tight leading-none">
                  Adlogix
                </span>
                <span className="text-[9px] font-semibold text-slate-500 tracking-wider uppercase mt-1 leading-none">
                  Powered by <span className="text-brand-blue font-bold">Aumento</span>
                </span>
              </div>
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
              aria-label="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav List */}
          <div className="p-6 space-y-2 flex-1">
            <Link
              to="/"
              onClick={onClose}
              className={`block px-4 py-3 rounded-2xl text-base font-bold transition-colors ${
                location.pathname === '/' ? 'bg-brand-blue-light text-brand-blue' : 'text-brand-navy hover:bg-slate-50'
              }`}
            >
              Home
            </Link>

            {/* Services with Accordion */}
            <div>
              <button
                onClick={() => setServicesExpanded(!servicesExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-base font-bold text-brand-navy hover:bg-slate-50 transition-colors"
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    servicesExpanded ? 'rotate-180 text-brand-blue' : 'text-slate-400'
                  }`}
                />
              </button>

              {servicesExpanded && (
                <div className="pl-4 pr-2 py-2 space-y-1 bg-brand-surface-soft/60 rounded-2xl my-1">
                  <Link
                    to="/services"
                    onClick={onClose}
                    className="block px-3 py-2 text-xs font-bold text-brand-blue uppercase tracking-wider"
                  >
                    View All Services Overview →
                  </Link>
                  <div className="text-[11px] font-bold text-slate-400 px-3 pt-2 uppercase">
                    Marketing & Creative
                  </div>
                  <Link to="/services/performance-marketing" onClick={onClose} className="block px-3 py-1.5 text-xs text-brand-navy hover:text-brand-blue">
                    • Performance Marketing
                  </Link>
                  <Link to="/services/meta-google-ads" onClick={onClose} className="block px-3 py-1.5 text-xs text-brand-navy hover:text-brand-blue">
                    • Meta & Google Ads
                  </Link>
                  <Link to="/services/video-production-reels" onClick={onClose} className="block px-3 py-1.5 text-xs text-brand-navy hover:text-brand-blue">
                    • Video Reels & Shoots
                  </Link>
                  <div className="text-[11px] font-bold text-slate-400 px-3 pt-2 uppercase">
                    Web & Technology
                  </div>
                  <Link to="/services/react-web-development" onClick={onClose} className="block px-3 py-1.5 text-xs text-brand-navy hover:text-brand-blue">
                    • React & Next.js Development
                  </Link>
                  <Link to="/services/shopify-ecommerce" onClick={onClose} className="block px-3 py-1.5 text-xs text-brand-navy hover:text-brand-blue">
                    • Shopify & D2C Commerce
                  </Link>
                  <Link to="/services/headless-wordpress" onClick={onClose} className="block px-3 py-1.5 text-xs text-brand-navy hover:text-brand-blue">
                    • Headless WordPress CMS
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/work"
              onClick={onClose}
              className={`block px-4 py-3 rounded-2xl text-base font-bold transition-colors ${
                location.pathname.startsWith('/work') ? 'bg-brand-blue-light text-brand-blue' : 'text-brand-navy hover:bg-slate-50'
              }`}
            >
              Work
            </Link>

            <Link
              to="/reels"
              onClick={onClose}
              className="flex items-center justify-between px-4 py-3 rounded-2xl text-base font-bold text-brand-navy hover:bg-slate-50 transition-colors"
            >
              <span>Reels</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-brand-blue text-white rounded-full">
                HOT
              </span>
            </Link>

            <Link
              to="/industries"
              onClick={onClose}
              className={`block px-4 py-3 rounded-2xl text-base font-bold transition-colors ${
                location.pathname.startsWith('/industries') ? 'bg-brand-blue-light text-brand-blue' : 'text-brand-navy hover:bg-slate-50'
              }`}
            >
              Industries
            </Link>

            <Link
              to="/about"
              onClick={onClose}
              className={`block px-4 py-3 rounded-2xl text-base font-bold transition-colors ${
                location.pathname === '/about' ? 'bg-brand-blue-light text-brand-blue' : 'text-brand-navy hover:bg-slate-50'
              }`}
            >
              About
            </Link>

            <Link
              to="/blog"
              onClick={onClose}
              className={`block px-4 py-3 rounded-2xl text-base font-bold transition-colors ${
                location.pathname.startsWith('/blog') ? 'bg-brand-blue-light text-brand-blue' : 'text-brand-navy hover:bg-slate-50'
              }`}
            >
              Insights
            </Link>

            <Link
              to="/contact"
              onClick={onClose}
              className={`block px-4 py-3 rounded-2xl text-base font-bold transition-colors ${
                location.pathname === '/contact' ? 'bg-brand-blue-light text-brand-blue' : 'text-brand-navy hover:bg-slate-50'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Footer Bottom CTAs */}
          <div className="p-6 border-t border-brand-border bg-brand-surface-soft/60 space-y-3">
            <Button
              to="/contact"
              onClick={onClose}
              variant="primary"
              size="md"
              className="w-full justify-center"
              icon={ArrowRight}
            >
              Start a Project
            </Button>

            <button
              onClick={() => {
                onClose();
                openDiscoveryModal();
              }}
              className="w-full py-2.5 px-4 rounded-full border border-brand-border bg-white text-xs font-bold text-brand-navy hover:text-brand-blue hover:border-brand-blue/30 transition-all text-center"
            >
              Book Discovery Call
            </button>

            <div className="pt-2 text-center text-[11px] text-brand-muted">
              Powered by{' '}
              <a
                href={settings.poweredBy?.url || 'https://aumentoinfoway.com/'}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-navy hover:text-brand-blue underline"
              >
                Aumento Infoway
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
