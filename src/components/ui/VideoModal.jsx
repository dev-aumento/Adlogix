import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, ExternalLink, Sparkles } from 'lucide-react';
import { useCMS } from '../../hooks/useCMS';
import { Link } from 'react-router-dom';

export const VideoModal = () => {
  const { activeVideo, closeVideoModal } = useCMS();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeVideoModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeVideoModal]);

  if (!activeVideo) return null;

  const isVertical = activeVideo.aspectRatio === '9:16' || activeVideo.isVertical;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    if (total > 0) {
      setProgress((current / total) * 100);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-brand-navy/90 backdrop-blur-xl"
        onClick={closeVideoModal}
      >
        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row ${
            isVertical ? 'max-w-4xl max-h-[90vh]' : 'max-w-5xl max-h-[85vh]'
          } w-full`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={closeVideoModal}
            aria-label="Close video player"
            className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 hover:bg-brand-blue text-white backdrop-blur-md transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Video Player Column */}
          <div
            className={`relative bg-black flex items-center justify-center overflow-hidden ${
              isVertical ? 'w-full md:w-[420px] aspect-[9/16] max-h-[75vh]' : 'w-full md:w-2/3 aspect-video'
            }`}
          >
            <video
              ref={videoRef}
              src={activeVideo.videoUrl}
              poster={activeVideo.thumbnail || activeVideo.videoThumbnail}
              autoPlay
              playsInline
              loop
              onTimeUpdate={handleTimeUpdate}
              onClick={togglePlay}
              className="w-full h-full object-cover cursor-pointer"
            />

            {/* Custom Control Overlay on Video */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between p-4">
              <div className="flex justify-between items-center pointer-events-auto">
                {activeVideo.category && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black/50 text-white backdrop-blur-md border border-white/10">
                    {activeVideo.category}
                  </span>
                )}
              </div>

              {/* Bottom Playback Controls */}
              <div className="space-x-3 pointer-events-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-full bg-white/20 hover:bg-brand-blue text-white backdrop-blur-md transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-full bg-white/20 hover:bg-brand-blue text-white backdrop-blur-md transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
                {activeVideo.duration && (
                  <span className="text-xs text-white/80 font-mono">{activeVideo.duration}</span>
                )}
              </div>
            </div>

            {/* Video Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <div
                className="h-full bg-brand-blue transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Details Column */}
          <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between bg-slate-900 text-white overflow-y-auto max-h-[75vh]">
            <div>
              {(activeVideo.client || activeVideo.company) && (
                <div className="flex items-center gap-2 text-xs font-semibold text-brand-blue uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{activeVideo.client || activeVideo.company}</span>
                </div>
              )}

              {(activeVideo.title || activeVideo.clientName) && (
                <h3 className="text-xl sm:text-2xl font-bold font-display leading-snug">
                  {activeVideo.title || activeVideo.clientName}
                </h3>
              )}

              {activeVideo.role && (
                <p className="text-xs text-slate-400 mt-1">
                  {[activeVideo.role, activeVideo.company].filter(Boolean).join(', ')}
                </p>
              )}

              {activeVideo.description && (
                <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                  {activeVideo.description}
                </p>
              )}

              {activeVideo.quote && (
                <blockquote className="mt-4 p-4 rounded-xl bg-white/5 border-l-2 border-brand-blue text-sm text-slate-200 italic">
                  "{activeVideo.quote}"
                </blockquote>
              )}

              {/* Metrics Badge */}
              {(activeVideo.views || activeVideo.result || activeVideo.ctr) && (
                <div className="grid grid-cols-2 gap-3 mt-6">
                  {activeVideo.views && (
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-xs text-slate-400">Total Views</div>
                      <div className="text-lg font-bold text-white font-display">{activeVideo.views}</div>
                    </div>
                  )}
                  {activeVideo.ctr && (
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-xs text-slate-400">Average CTR</div>
                      <div className="text-lg font-bold text-brand-blue font-display">{activeVideo.ctr}</div>
                    </div>
                  )}
                  {activeVideo.result && (
                    <div className="col-span-2 p-3 rounded-xl bg-brand-blue/15 border border-brand-blue/30">
                      <div className="text-xs text-brand-blue font-semibold">Verified Impact</div>
                      <div className="text-base font-bold text-white">{activeVideo.result}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              {activeVideo.tags && activeVideo.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-5">
                  {activeVideo.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs rounded-md bg-white/5 text-slate-300 border border-white/10"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Modal CTA */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
              <Link
                to="/contact"
                onClick={closeVideoModal}
                className="w-full sm:w-auto flex-1 text-center py-3 px-5 rounded-full bg-brand-blue hover:bg-brand-blue-hover text-white font-semibold text-sm transition-all shadow-lg shadow-brand-blue/30"
              >
                Create Similar Campaign
              </Link>
              {activeVideo.projectSlug && (
                <Link
                  to={`/work/${activeVideo.projectSlug}`}
                  onClick={closeVideoModal}
                  className="w-full sm:w-auto text-center py-3 px-5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <span>View Case Study</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
