import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from './Header';
import { Footer } from './Footer';
import { VideoModal } from '../ui/VideoModal';
import { DiscoveryModal } from '../ui/DiscoveryModal';
import { PageLoader } from '../ui/PageLoader';

export const Layout = ({ children }) => {
  const { pathname } = useLocation();
  // The full-screen loader is the homepage's intro, so it runs only when the homepage is the
  // page being entered. Deep links to any other page, and every route change, go straight in.
  const [isInitialLoading, setIsInitialLoading] = useState(() => pathname === '/');
  const [isPageNavigating, setIsPageNavigating] = useState(false);
  const prevPathRef = useRef(pathname);
  const isFirstMount = useRef(true);

  // Handle route navigation loader
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      setIsPageNavigating(true);
      window.scrollTo(0, 0);

      const timer = setTimeout(() => {
        setIsPageNavigating(false);
      }, 850);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const isHome = pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-white text-brand-dark selection:bg-brand-blue selection:text-white relative">
      {/* Top Glowing Laser Route Progress Bar */}
      <AnimatePresence>
        {isPageNavigating && (
          <motion.div
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-blue via-[#00E5FF] to-brand-blue z-[999999] origin-left shadow-[0_0_14px_#00E5FF]"
          />
        )}
      </AnimatePresence>

      {/* Cinematic fullscreen loader: the homepage intro only */}
      <AnimatePresence mode="wait">
        {isInitialLoading && (
          <PageLoader
            key="initial-loader"
            isInitial={true}
            onComplete={() => setIsInitialLoading(false)}
          />
        )}
        {/* No full-screen loader between pages: the progress bar above is the navigation cue. */}
      </AnimatePresence>

      <Header />
      
      {/* Main Page Content with smooth entry reveal */}
      <motion.main 
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className={`flex-1 ${isHome ? '' : 'pt-20'}`}
      >
        {children}
      </motion.main>
      
      <Footer />

      {/* Global Modals */}
      <VideoModal />
      <DiscoveryModal />
    </div>
  );
};

