import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, RefreshCw, Mail } from 'lucide-react';
import { SEOHead } from '../components/ui/SEOHead';
import { Button } from '../components/ui/Button';

const float = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
};

/**
 * Shown by ErrorBoundary when a React render throws.
 * Layout (header/footer) may or may not wrap this depending on where the boundary sits.
 */
export const ErrorPage = ({ error, onReset }) => {
  const isDev = import.meta.env.DEV;
  const message = error?.message || 'An unexpected error occurred.';

  return (
    <>
      <SEOHead
        title="Something Went Wrong | Adlogix"
        description="We hit an unexpected error. Please try again or head back home."
      />

      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden bg-brand-surface-soft/50 border-b border-brand-border px-4 py-20">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <motion.div
            className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl"
            animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.08, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 right-1/5 h-80 w-80 rounded-full bg-brand-blue/10 blur-3xl"
            animate={{ opacity: [0.25, 0.5, 0.25] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-xl text-center">
          <motion.div
            variants={float}
            animate="animate"
            className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-amber-400/30 bg-amber-50 text-amber-600 shadow-lg shadow-amber-500/10"
          >
            <AlertTriangle className="h-9 w-9" strokeWidth={2.25} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-50 px-3.5 py-1.5 text-xs font-bold text-amber-700"
          >
            Unexpected error
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="editorial-heading text-3xl font-black leading-tight text-brand-navy sm:text-4xl lg:text-5xl"
          >
            Something went{' '}
            <span className="gradient-text-blue">off script.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-brand-muted sm:text-base"
          >
            Our page hit a snag while loading. Try again, or jump back to a safe page while we keep things moving.
          </motion.p>

          {isDev && message && (
            <motion.pre
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto mt-6 max-h-32 max-w-lg overflow-auto rounded-2xl border border-brand-border bg-white px-4 py-3 text-left text-[11px] leading-relaxed text-brand-muted"
            >
              {message}
            </motion.pre>
          )}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            {onReset && (
              <Button
                variant="primary"
                size="md"
                icon={RefreshCw}
                iconPosition="left"
                onClick={onReset}
              >
                Try Again
              </Button>
            )}
            <Button to="/" variant="secondary" size="md" icon={Home} iconPosition="left">
              Back to Home
            </Button>
            <Button to="/contact" variant="outline" size="md" icon={Mail} iconPosition="left">
              Contact Us
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28 }}
            className="mt-10 text-xs text-brand-muted"
          >
            Prefer a human?{' '}
            <Link to="/contact" className="font-semibold text-brand-blue hover:text-brand-blue-hover">
              Start a project enquiry
            </Link>
          </motion.p>
        </div>
      </section>
    </>
  );
};
