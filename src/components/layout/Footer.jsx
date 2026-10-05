import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, Phone, MapPin, Instagram, Linkedin, Twitter, ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import { useCMS } from '../../hooks/useCMS';

export const Footer = () => {
  const { settings, openDiscoveryModal } = useCMS();

  return (
    <footer className="bg-brand-navy text-white relative overflow-hidden border-t border-slate-800">
      {/* Subtle Ambient Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-white/10">
          
          {/* Column 1: Brand & Credibility */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-brand-blue/40">
                A
              </div>
              <span className="text-2xl font-black font-display tracking-tight text-white">
                Adlogix
              </span>
            </Link>

            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              Adlogix is a full-service creative digital marketing, performance advertising, and technology agency. We combine scroll-stopping creative with high-converting web engineering.
            </p>

            {/* Powered by Aumento Infoway Credibility Box */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm max-w-sm">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-semibold uppercase tracking-wider text-slate-300">
                  Technology Partner
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <p className="text-xs text-slate-300">
                Digital execution & technology infrastructure powered by{' '}
                <a
                  href={settings.poweredBy?.url || 'https://aumentoinfoway.com/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-white hover:text-brand-blue underline inline-flex items-center gap-0.5"
                >
                  <span>Aumento Infoway</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings.socials?.instagram || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand-blue text-slate-300 hover:text-white flex items-center justify-center transition-all border border-white/10"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings.socials?.linkedin || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand-blue text-slate-300 hover:text-white flex items-center justify-center transition-all border border-white/10"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={settings.socials?.twitter || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand-blue text-slate-300 hover:text-white flex items-center justify-center transition-all border border-white/10"
                aria-label="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Digital Marketing & Creative */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-4">
              Marketing & Creative
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link to="/services/performance-marketing" className="hover:text-white transition-colors">
                  Performance Marketing
                </Link>
              </li>
              <li>
                <Link to="/services/meta-google-ads" className="hover:text-white transition-colors">
                  Meta & Google Ads
                </Link>
              </li>
              <li>
                <Link to="/services/video-production-reels" className="hover:text-white transition-colors">
                  Video Reels & Shoots
                </Link>
              </li>
              <li>
                <Link to="/services/seo-optimization" className="hover:text-white transition-colors">
                  SEO & Search Authority
                </Link>
              </li>
              <li>
                <Link to="/services/social-media-management" className="hover:text-white transition-colors">
                  Social Media Strategy
                </Link>
              </li>
              <li>
                <Link to="/services/creative-strategy" className="hover:text-white transition-colors">
                  Creative Ad Campaigns
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Web & IT Solutions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-4">
              Web & IT Solutions
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link to="/services/react-web-development" className="hover:text-white transition-colors">
                  React & Next.js Websites
                </Link>
              </li>
              <li>
                <Link to="/services/shopify-ecommerce" className="hover:text-white transition-colors">
                  Shopify & D2C Stores
                </Link>
              </li>
              <li>
                <Link to="/services/headless-wordpress" className="hover:text-white transition-colors">
                  Headless WordPress CMS
                </Link>
              </li>
              <li>
                <Link to="/services/ui-ux-design" className="hover:text-white transition-colors">
                  UI/UX & Brand Design
                </Link>
              </li>
              <li>
                <Link to="/services/api-integrations-automation" className="hover:text-white transition-colors">
                  API Integrations & CRM
                </Link>
              </li>
              <li>
                <Link to="/services/website-maintenance" className="hover:text-white transition-colors">
                  Maintenance & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Links & Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
              Company & Contact
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300 mb-6">
              <li>
                <Link to="/work" className="hover:text-white transition-colors">
                  Our Work / Portfolio
                </Link>
              </li>
              <li>
                <Link to="/reels" className="hover:text-white transition-colors">
                  Reels & Video Showcase
                </Link>
              </li>
              <li>
                <Link to="/industries" className="hover:text-white transition-colors">
                  Industries We Serve
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Adlogix
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="hover:text-white transition-colors">
                  Client Testimonials
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">
                  Insights & Resources
                </Link>
              </li>
            </ul>

            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-blue" />
                <a href={`mailto:${settings.contact?.email}`} className="hover:text-white transition-colors">
                  {settings.contact?.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-blue" />
                <a href={`tel:${settings.contact?.phone}`} className="hover:text-white transition-colors">
                  {settings.contact?.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Legal, Partner link, and Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Adlogix Agency. All rights reserved. Technology partner{' '}
            <a
              href={settings.poweredBy?.url || 'https://aumentoinfoway.com/'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white underline font-semibold"
            >
              Aumento Infoway
            </a>.
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/contact" className="hover:text-white transition-colors">
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
