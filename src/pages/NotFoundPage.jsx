import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Sparkles, FolderKanban, Phone } from 'lucide-react';
import { SEOHead } from '../components/ui/SEOHead';
import { Button } from '../components/ui/Button';

export const NotFoundPage = () => {
  return (
    <>
      <SEOHead
        title="404 - Page Not Found | Adlogix"
        description="The page you are looking for doesn't exist or has been moved."
      />

      <div className="min-h-[70vh] flex items-center justify-center bg-white px-4 py-20">
        <div className="max-w-lg text-center space-y-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-3xl bg-brand-blue-light text-brand-blue flex items-center justify-center mx-auto text-4xl font-black font-display shadow-lg shadow-brand-blue/20"
          >
            404
          </motion.div>

          <h1 className="editorial-heading text-3xl sm:text-4xl font-black text-brand-navy">
            Page Not Found
          </h1>

          <p className="text-sm text-brand-muted leading-relaxed">
            The page you are looking for might have been moved, renamed, or is temporarily unavailable. Let's get you back on track.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Button to="/" variant="primary" size="md" icon={Home} iconPosition="left">
              Back to Home
            </Button>
            <Button to="/services" variant="secondary" size="md">
              Explore Services
            </Button>
            <Button to="/work" variant="outline" size="md">
              View Portfolio
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
