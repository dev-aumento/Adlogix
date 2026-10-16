import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, ArrowRight, Phone } from 'lucide-react';
import { useCMS } from '../../hooks/useCMS';
import { MegaMenu } from './MegaMenu';
import { MobileNav } from './MobileNav';
import { SmartLink } from '../ui/SmartLink';
import { toAppPath } from '../../services/normalizers';

const Tagline = ({ text }) => {
  if (!text) return null;
  const parts = text.split(/(Aumento)/i);
  return (
    <span className="text-[8.5px] sm:text-[9.5px] font-semibold text-slate-500 tracking-wider uppercase mt-1 leading-none">
      {parts.map((part, i) =>
        /^aumento$/i.test(part) ? (
          <span key={i} className="text-brand-blue font-bold">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

const pathOf = (href) => toAppPath(href) || href || '';

export const Header = () => {
  const { settings, header, openDiscoveryModal } = useCMS();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const location = useLocation();
  const navigation = settings.navigation || [];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMegaMenuOpen(false);
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  const brandMark = header.brandMark || 'A';
  const brandName = header.brandName || 'Adlogix';
  const hasPrimaryCta = Boolean(header.primaryCtaLabel && header.primaryCtaLink);
  const hasBookCall = Boolean(header.bookCallLabel);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-brand-border/90 shadow-sm py-3'
            : 'bg-white/75 backdrop-blur-lg border-b border-brand-border/60 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-3 shrink-0">
              <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group select-none">
                <div className="w-8 h-8 sm:w-9 sm:h-9 aspect-square rounded-xl bg-gradient-to-tr from-brand-blue to-indigo-600 flex items-center justify-center text-white font-black text-base sm:text-lg shadow-sm shadow-brand-blue/20 group-hover:scale-105 transition-transform shrink-0">
                  {brandMark}
                </div>
                <div className="flex flex-col justify-center text-left">
                  {brandName && (
                    <span className="text-lg sm:text-xl font-black font-display text-brand-navy tracking-tight leading-none group-hover:text-brand-blue transition-colors">
                      {brandName}
                    </span>
                  )}
                  <Tagline text={header.tagline} />
                </div>
              </Link>
            </div>

            <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 shrink-0 flex-nowrap whitespace-nowrap">
              {navigation.map((item) => {
                const href = pathOf(item.href);
                const isActive =
                  href === '/'
                    ? location.pathname === '/'
                    : href && location.pathname.startsWith(href);

                if (item.hasDropdown) {
                  return (
                    <div
                      key={item.name}
                      className="relative shrink-0"
                      onMouseEnter={() => setIsMegaMenuOpen(true)}
                    >
                      <button
                        onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                        className={`h-9 xl:h-10 inline-flex items-center justify-center gap-1.5 px-2.5 xl:px-3.5 rounded-full text-xs xl:text-sm font-bold whitespace-nowrap shrink-0 transition-all leading-none select-none ${
                          isActive || isMegaMenuOpen
                            ? 'text-brand-blue bg-brand-blue-light/75 border border-brand-blue/25 shadow-xs'
                            : 'text-brand-navy hover:text-brand-blue hover:bg-slate-50 border border-transparent'
                        }`}
                      >
                        <span className="whitespace-nowrap">{item.name}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                            isMegaMenuOpen ? 'rotate-180 text-brand-blue' : 'text-slate-400'
                          }`}
                        />
                      </button>

                      <MegaMenu
                        isOpen={isMegaMenuOpen}
                        onClose={() => setIsMegaMenuOpen(false)}
                        subcategories={item.subcategories}
                        footerText={header.megaFooterText}
                        footerLabel={header.megaFooterLabel}
                        footerLink={header.megaFooterLink}
                      />
                    </div>
                  );
                }

                return (
                  <SmartLink
                    key={item.name}
                    href={item.href}
                    className={`h-9 xl:h-10 relative px-2.5 xl:px-3.5 rounded-full text-xs xl:text-sm font-bold whitespace-nowrap shrink-0 transition-all inline-flex items-center justify-center gap-1.5 leading-none select-none ${
                      isActive
                        ? 'text-brand-blue bg-brand-blue-light/75 border border-brand-blue/25 shadow-xs'
                        : 'text-brand-navy hover:text-brand-blue hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <span className="whitespace-nowrap">{item.name}</span>
                    {item.badge && (
                      <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-black uppercase bg-brand-blue text-white rounded-full leading-none shrink-0 shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </SmartLink>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {hasBookCall && header.bookCallAction === 'link' && header.bookCallLink && (
                <SmartLink
                  href={header.bookCallLink}
                  className="hidden xl:inline-flex h-9 xl:h-10 items-center justify-center gap-1.5 px-3.5 xl:px-4 rounded-full text-xs font-bold text-brand-navy bg-brand-surface-soft hover:bg-slate-100 border border-brand-border hover:border-brand-blue/40 transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0 leading-none select-none"
                >
                  <Phone className="w-3.5 h-3.5 text-brand-blue" />
                  <span className="whitespace-nowrap">{header.bookCallLabel}</span>
                </SmartLink>
              )}
              {hasBookCall && header.bookCallAction !== 'link' && (
                <button
                  onClick={openDiscoveryModal}
                  className="hidden xl:inline-flex h-9 xl:h-10 items-center justify-center gap-1.5 px-3.5 xl:px-4 rounded-full text-xs font-bold text-brand-navy bg-brand-surface-soft hover:bg-slate-100 border border-brand-border hover:border-brand-blue/40 transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0 leading-none select-none"
                >
                  <Phone className="w-3.5 h-3.5 text-brand-blue" />
                  <span className="whitespace-nowrap">{header.bookCallLabel}</span>
                </button>
              )}

              {hasPrimaryCta && (
                <SmartLink
                  href={header.primaryCtaLink}
                  className="h-8 sm:h-9 xl:h-10 px-3.5 sm:px-4.5 xl:px-5 text-xs font-bold rounded-full bg-brand-blue hover:bg-brand-blue-hover text-white shadow-sm shadow-brand-blue/25 hover:shadow-brand-blue/40 whitespace-nowrap shrink-0 inline-flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>{header.primaryCtaLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </SmartLink>
              )}

              <button
                onClick={() => setIsMobileNavOpen(true)}
                className="lg:hidden h-8 w-8 sm:h-9 sm:w-9 aspect-square rounded-xl bg-brand-surface-soft border border-brand-border text-brand-navy flex items-center justify-center hover:bg-slate-100 transition-colors shrink-0"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-4 h-4 text-brand-navy" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
    </>
  );
};
