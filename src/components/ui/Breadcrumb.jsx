import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb = ({ items = [] }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-brand-muted py-3">
      <Link to="/" className="flex items-center gap-1 hover:text-brand-blue transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          {item.href ? (
            <Link to={item.href} className="hover:text-brand-blue transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-brand-navy truncate max-w-[200px] sm:max-w-xs">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
