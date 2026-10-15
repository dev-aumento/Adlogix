import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Play } from 'lucide-react';
import { useCMS } from '../../hooks/useCMS';

/** Inner content of a project card; the caller provides the card container. */
export const ProjectCard = ({ project, videoLabel, linkLabel, metricValueClassName }) => {
  const { openVideoModal } = useCMS();
  const results = project.results?.filter((res) => res.value || res.label) ?? [];
  const services = project.servicesDelivered?.slice(0, 2) ?? [];

  return (
    <>
      {/* Visual Media Header */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        {project.heroImage && (
          <img
            src={project.heroImage}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Badges */}
        {(project.categoryLabel || project.industry) && (
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            {project.categoryLabel && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md border border-white/20">
                {project.categoryLabel}
              </span>
            )}
            {project.industry && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/50 text-white backdrop-blur-md ml-auto">
                {project.industry}
              </span>
            )}
          </div>
        )}

        {project.videoReelUrl && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openVideoModal({
                title: project.title,
                client: project.client,
                videoUrl: project.videoReelUrl,
                thumbnail: project.heroImage,
                description: project.overview,
                category: project.categoryLabel,
                aspectRatio: '9:16',
                projectSlug: project.slug
              });
            }}
            className="absolute bottom-4 right-4 z-10 p-3 rounded-full bg-brand-blue/90 hover:bg-brand-blue text-white backdrop-blur-md shadow-lg shadow-brand-blue/40 border border-white/20 flex items-center gap-1.5 text-xs font-bold transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{videoLabel}</span>
          </button>
        )}
      </div>

      {/* Content Body */}
      <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
        <div>
          {project.client && (
            <div className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-1.5">
              {project.client}
            </div>
          )}

          <Link to={`/work/${project.slug}`}>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-brand-navy group-hover:text-brand-blue transition-colors leading-snug">
              {project.title}
            </h3>
          </Link>

          {project.overview && (
            <p className="mt-3 text-sm text-brand-muted leading-relaxed line-clamp-2">
              {project.overview}
            </p>
          )}

          {/* Results / Key Metrics Grid */}
          {results.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 p-4 rounded-2xl bg-brand-surface-soft border border-brand-border/60">
              {results.map((res, rIdx) => (
                <div key={rIdx}>
                  {res.value && (
                    <div className={`${metricValueClassName} font-extrabold font-display text-brand-navy`}>
                      {res.value}
                    </div>
                  )}
                  {res.label && (
                    <div className="text-[10px] text-brand-muted font-medium mt-0.5">
                      {res.label}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card Bottom: Services and Link */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
          {services.length > 0 && (
            <div className="flex flex-wrap gap-1.5 shrink min-w-0">
              {services.map((srv, sIdx) => (
                <span
                  key={sIdx}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 text-slate-600 font-medium whitespace-nowrap"
                >
                  {srv}
                </span>
              ))}
            </div>
          )}

          <Link
            to={`/work/${project.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-blue hover:text-brand-blue-hover transition-colors whitespace-nowrap shrink-0 ml-auto group/link"
          >
            <span>{linkLabel}</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </>
  );
};
