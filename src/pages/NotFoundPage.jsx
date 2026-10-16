import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Layers,
  FolderKanban,
  Clapperboard,
  Mail,
  ArrowUpRight,
  Compass,
} from 'lucide-react';
import { SEOHead } from '../components/ui/SEOHead';
import { Button } from '../components/ui/Button';

const shortcuts = [
  {
    to: '/services',
    label: 'Services',
    description: 'Marketing, creative & web capabilities',
    icon: Layers,
  },
  {
    to: '/work',
    label: 'Work',
    description: 'Case studies with measurable results',
    icon: FolderKanban,
  },
  {
    to: '/reels',
    label: 'Reels',
    description: '9:16 creative built to stop the scroll',
    icon: Clapperboard,
  },
  {
    to: '/contact',
    label: 'Contact',
    description: 'Start a growth conversation',
    icon: Mail,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 320, damping: 28 },
  },
};

export const NotFoundPage = () => {
  return (
    <>
      <SEOHead
        title="404 - Page Not Found | Adlogix"
        description="The page you are looking for doesn't exist or has been moved."
      />

      <section className="relative min-h-[80vh] overflow-hidden bg-brand-surface-soft/40 border-b border-brand-border">
        {/* Ambient motion plane — opacity/transform only */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <motion.div
            className="absolute -top-32 -left-16 h-80 w-80 rounded-full bg-brand-blue/10 blur-3xl"
            animate={{ x: [0, 28, 0], y: [0, 18, 0], opacity: [0.35, 0.55, 0.35] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-24 -right-10 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl"
            animate={{ x: [0, -22, 0], y: [0, -16, 0], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 h-40 w-40 rounded-full border border-brand-blue/15"
            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.45, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          {/* Giant 404 mark */}
          <div className="relative mb-2 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="editorial-heading text-[7.5rem] font-black leading-none tracking-tighter text-brand-navy/5 sm:text-[10rem] lg:text-[12rem]"
              aria-hidden="true"
            >
              404
            </motion.div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-blue/20 bg-white/90 px-4 py-2 text-xs font-bold text-brand-blue shadow-lg shadow-brand-blue/15 backdrop-blur-md">
                <Compass className="h-3.5 w-3.5" />
                Lost in the feed
              </span>
            </motion.div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="editorial-heading mt-4 text-center text-3xl font-black leading-tight text-brand-navy sm:text-4xl lg:text-5xl"
          >
            This page missed the{' '}
            <span className="gradient-text-blue">cut.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mx-auto mt-5 max-w-lg text-center text-sm leading-relaxed text-brand-muted sm:text-base"
          >
            The link may be outdated, mistyped, or the page has moved. Pick a destination below — or head home and start fresh.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Button to="/" variant="primary" size="lg" icon={Home} iconPosition="left">
              Back to Home
            </Button>
            <Button to="/contact" variant="secondary" size="lg" icon={Mail} iconPosition="left">
              Talk to Us
            </Button>
          </motion.div>

          {/* Shortcut cards */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mt-14 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {shortcuts.map(({ to, label, description, icon: Icon }) => (
              <motion.div key={to} variants={item}>
                <Link
                  to={to}
                  className="group flex items-start gap-3.5 rounded-2xl border border-brand-border bg-white p-4 shadow-card-subtle transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-blue/40 hover:shadow-md"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-blue-light text-brand-blue transition-colors group-hover:bg-brand-blue group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1 text-left">
                    <span className="flex items-center gap-1 text-sm font-bold text-brand-navy group-hover:text-brand-blue">
                      {label}
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-brand-muted">
                      {description}
                    </span>
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};
