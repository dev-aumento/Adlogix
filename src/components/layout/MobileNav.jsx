import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ArrowRight, Phone } from 'lucide-react';
import { useCMS } from '../../hooks/useCMS';
import { siteInitial } from '../../content/layout';
import { Button } from '../ui/Button';
import { SmartLink } from '../ui/SmartLink';
import { toAppPath } from '../../services/normalizers';

const pathOf = (href) => toAppPath(href) || href || '';

export const MobileNav = ({ isOpen, onClose }) => {
  const { settings, header, footer, siteName, openDiscoveryModal } = useCMS();
  const [expanded, setExpanded] = useState(null);
  const location = useLocation();
  const navigation = settings.navigation || [];

  if (!isOpen) return null;

  const logo = header.logo;
  const hasPrimaryCta = Boolean(header.primaryCtaLabel && header.primaryCtaLink);
  const hasBookCall = Boolean(header.bookCallLabel);

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
          <div className="p-5 border-b border-brand-border flex items-center justify-between">
            <Link to="/" onClick={onClose} className="flex items-center gap-2.5">
              {logo ? (
                <img
                  src={logo.url}
                  alt={logo.alt || siteName}
                  className="h-9 w-auto object-contain"
                />
              ) : (
                <>
                  <div className="w-8 h-8 aspect-square rounded-xl bg-gradient-to-tr from-brand-blue to-indigo-600 flex items-center justify-center text-white font-black text-base shadow-sm shrink-0">
                    {siteInitial(siteName)}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xl font-black font-display text-brand-navy tracking-tight leading-none">
                      {siteName}
                    </span>
                    {header.tagline && (
                      <span className="text-[9px] font-semibold text-slate-500 tracking-wider uppercase mt-1 leading-none">
                        {header.tagline.split(/(Aumento)/i).map((part, i) =>
                          /^aumento$/i.test(part) ? (
                            <span key={i} className="text-brand-blue font-bold">{part}</span>
                          ) : (
                            <span key={i}>{part}</span>
                          )
                        )}
                      </span>
                    )}
                  </div>
                </>
              )}
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
              aria-label="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-2 flex-1">
            {navigation.map((item) => {
              const href = pathOf(item.href);
              const isActive =
                href === '/'
                  ? location.pathname === '/'
                  : href && location.pathname.startsWith(href);

              if (item.hasDropdown && item.subcategories?.length) {
                const open = expanded === item.name;
                return (
                  <div key={item.name}>
                    <button
                      onClick={() => setExpanded(open ? null : item.name)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-base font-bold text-brand-navy hover:bg-slate-50 transition-colors"
                    >
                      <span className="inline-flex items-center gap-2">
                        {item.name}
                        {item.badge && (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-brand-blue text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          open ? 'rotate-180 text-brand-blue' : 'text-slate-400'
                        }`}
                      />
                    </button>

                    {open && (
                      <div className="pl-4 pr-2 py-2 space-y-1 bg-brand-surface-soft/60 rounded-2xl my-1">
                        {href && (
                          <SmartLink
                            href={item.href}
                            onClick={onClose}
                            className="block px-3 py-2 text-xs font-bold text-brand-blue uppercase tracking-wider"
                          >
                            View all →
                          </SmartLink>
                        )}
                        {item.subcategories.map((col) => (
                          <div key={col.title}>
                            {col.title && (
                              <div className="text-[11px] font-bold text-slate-400 px-3 pt-2 uppercase">
                                {col.title}
                              </div>
                            )}
                            {col.items.map((link) => (
                              <SmartLink
                                key={`${link.name}-${link.href}`}
                                href={link.href}
                                onClick={onClose}
                                className="block px-3 py-1.5 text-xs text-brand-navy hover:text-brand-blue"
                              >
                                • {link.name}
                              </SmartLink>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <SmartLink
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-base font-bold transition-colors ${
                    isActive ? 'bg-brand-blue-light text-brand-blue' : 'text-brand-navy hover:bg-slate-50'
                  }`}
                >
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-brand-blue text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </SmartLink>
              );
            })}
          </div>

          <div className="p-6 border-t border-brand-border bg-brand-surface-soft/60 space-y-3">
            {hasPrimaryCta && (
              <Button
                to={pathOf(header.primaryCtaLink).startsWith('/') ? pathOf(header.primaryCtaLink) : undefined}
                href={pathOf(header.primaryCtaLink).startsWith('/') ? undefined : header.primaryCtaLink}
                onClick={onClose}
                variant="primary"
                size="md"
                className="w-full justify-center"
                icon={ArrowRight}
              >
                {header.primaryCtaLabel}
              </Button>
            )}

            {hasBookCall && header.bookCallAction === 'link' && header.bookCallLink && (
              <SmartLink
                href={header.bookCallLink}
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-full border border-brand-border bg-white text-xs font-bold text-brand-navy hover:text-brand-blue hover:border-brand-blue/30 transition-all text-center inline-flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                {header.bookCallLabel}
              </SmartLink>
            )}
            {hasBookCall && header.bookCallAction !== 'link' && (
              <button
                onClick={() => {
                  onClose();
                  openDiscoveryModal();
                }}
                className="w-full py-2.5 px-4 rounded-full border border-brand-border bg-white text-xs font-bold text-brand-navy hover:text-brand-blue hover:border-brand-blue/30 transition-all text-center"
              >
                {header.bookCallLabel}
              </button>
            )}

            {footer.partnerName && (
              <div className="pt-2 text-center text-[11px] text-brand-muted">
                Powered by{' '}
                {footer.partnerUrl ? (
                  <a
                    href={footer.partnerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-brand-navy hover:text-brand-blue underline"
                  >
                    {footer.partnerName}
                  </a>
                ) : (
                  <span className="font-semibold text-brand-navy">{footer.partnerName}</span>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
