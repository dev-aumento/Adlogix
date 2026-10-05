import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Code2, TrendingUp, ShoppingBag, ShieldCheck, Zap } from 'lucide-react';
import { DynamicIcon } from '../ui/DynamicIcon';

export const MegaMenu = ({ isOpen, onClose, subcategories = [] }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.2 }}
        onMouseLeave={onClose}
        className="absolute top-full left-1/2 -translate-x-1/2 w-[820px] bg-white/95 backdrop-blur-xl border border-brand-border/90 rounded-3xl shadow-2xl p-6 z-50 overflow-hidden"
      >
        <div className="grid grid-cols-2 gap-6 divide-x divide-slate-100">
          {subcategories.map((col, idx) => (
            <div key={idx} className={idx > 0 ? "pl-6" : ""}>
              <div className="flex items-center gap-2 mb-4">
                <span className="p-1.5 rounded-lg bg-brand-blue-light text-brand-blue">
                  {idx === 0 ? <TrendingUp className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
                </span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy">
                  {col.title}
                </h4>
              </div>

              <div className="space-y-1.5">
                {col.items.map((item, itemIdx) => (
                  <Link
                    key={itemIdx}
                    to={item.href}
                    onClick={onClose}
                    className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-brand-surface-soft transition-all duration-200"
                  >
                    <div className="mt-0.5 w-2 h-2 rounded-full bg-brand-blue/30 group-hover:bg-brand-blue group-hover:scale-125 transition-all" />
                    <div>
                      <div className="text-sm font-bold text-brand-navy group-hover:text-brand-blue transition-colors flex items-center gap-1.5">
                        <span>{item.name}</span>
                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-blue" />
                      </div>
                      <p className="text-xs text-brand-muted mt-0.5 leading-snug">
                        {item.desc}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Mega Menu Bottom Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between bg-brand-surface-soft/60 -mx-6 -mb-6 px-6 py-3 text-xs">
          <div className="flex items-center gap-2 text-brand-muted">
            <Sparkles className="w-3.5 h-3.5 text-brand-blue" />
            <span>Need a custom growth & technology solution?</span>
          </div>
          <Link
            to="/services"
            onClick={onClose}
            className="font-bold text-brand-blue hover:text-brand-blue-hover flex items-center gap-1 group"
          >
            <span>View All Capabilities</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
