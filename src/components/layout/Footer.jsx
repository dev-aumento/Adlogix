import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Instagram, Linkedin, Twitter, ExternalLink } from 'lucide-react';
import { useCMS } from '../../hooks/useCMS';
import { SmartLink } from '../ui/SmartLink';

const FooterColumn = ({ title, links, titleClassName }) => {
  if (!title && (!links || links.length === 0)) return null;
  return (
    <div>
      {title && (
        <h4 className={`text-xs font-bold uppercase tracking-wider mb-4 ${titleClassName}`}>
          {title}
        </h4>
      )}
      {links?.length > 0 && (
        <ul className="space-y-2.5 text-sm text-slate-300">
          {links.map((item) => (
            <li key={`${item.name}-${item.href}`}>
              <SmartLink href={item.href} className="hover:text-white transition-colors">
                {item.name}
              </SmartLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const Footer = () => {
  const { footer, footerMenus } = useCMS();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-navy text-white relative overflow-hidden border-t border-slate-800">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-white/10">
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-brand-blue/40">
                {footer.brandMark || 'A'}
              </div>
              {footer.brandName && (
                <span className="text-2xl font-black font-display tracking-tight text-white">
                  {footer.brandName}
                </span>
              )}
            </Link>

            {footer.description && (
              <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
                {footer.description}
              </p>
            )}

            {(footer.partnerLabel || footer.partnerName) && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm max-w-sm">
                {footer.partnerLabel && (
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold uppercase tracking-wider text-slate-300">
                      {footer.partnerLabel}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                )}
                {(footer.partnerText || footer.partnerName) && (
                  <p className="text-xs text-slate-300">
                    {footer.partnerText}{' '}
                    {footer.partnerName && (
                      footer.partnerUrl ? (
                        <a
                          href={footer.partnerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-white hover:text-brand-blue underline inline-flex items-center gap-0.5"
                        >
                          <span>{footer.partnerName}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="font-bold text-white">{footer.partnerName}</span>
                      )
                    )}
                  </p>
                )}
              </div>
            )}

            {(footer.instagram || footer.linkedin || footer.twitter) && (
              <div className="flex items-center gap-3 pt-2">
                {footer.instagram && (
                  <a
                    href={footer.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand-blue text-slate-300 hover:text-white flex items-center justify-center transition-all border border-white/10"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {footer.linkedin && (
                  <a
                    href={footer.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand-blue text-slate-300 hover:text-white flex items-center justify-center transition-all border border-white/10"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {footer.twitter && (
                  <a
                    href={footer.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand-blue text-slate-300 hover:text-white flex items-center justify-center transition-all border border-white/10"
                    aria-label="Twitter / X"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          <FooterColumn
            title={footer.colMarketingTitle}
            links={footerMenus.marketing}
            titleClassName="text-brand-blue"
          />
          <FooterColumn
            title={footer.colWebTitle}
            links={footerMenus.web}
            titleClassName="text-cyan-400"
          />

          <div>
            <FooterColumn
              title={footer.colCompanyTitle}
              links={footerMenus.company}
              titleClassName="text-slate-300"
            />
            {(footer.email || footer.phone) && (
              <div className="space-y-2 text-xs text-slate-400 mt-6">
                {footer.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-brand-blue" />
                    <a href={`mailto:${footer.email}`} className="hover:text-white transition-colors">
                      {footer.email}
                    </a>
                  </div>
                )}
                {footer.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-brand-blue" />
                    <a href={`tel:${footer.phone}`} className="hover:text-white transition-colors">
                      {footer.phone}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {year} {footer.copyright || 'Adlogix Agency. All rights reserved.'}
            {footer.partnerName && (
              <>
                {' '}
                {footer.partnerUrl ? (
                  <a
                    href={footer.partnerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-white underline font-semibold"
                  >
                    {footer.partnerName}
                  </a>
                ) : (
                  <span className="text-slate-300 font-semibold">{footer.partnerName}</span>
                )}
                .
              </>
            )}
          </div>

          {footerMenus.legal?.length > 0 && (
            <div className="flex items-center space-x-6">
              {footerMenus.legal.map((item) => (
                <SmartLink
                  key={`${item.name}-${item.href}`}
                  href={item.href}
                  className="hover:text-white transition-colors"
                >
                  {item.name}
                </SmartLink>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};
