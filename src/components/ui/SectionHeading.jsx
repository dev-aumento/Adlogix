import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from './Badge';

export const SectionHeading = ({
  badge,
  badgeIcon,
  badgeVariant = 'blue',
  title,
  highlightWord,
  subtitle,
  align = 'center', // 'left' | 'center' | 'right'
  className = '',
  light = false
}) => {
  const alignClass = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  }[align];

  // If highlightWord is provided, split title and style highlight
  const renderTitle = () => {
    if (!highlightWord || !title.includes(highlightWord)) {
      return title;
    }
    const parts = title.split(highlightWord);
    return (
      <>
        {parts[0]}
        <span className="gradient-text-blue">{highlightWord}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <div className={`flex flex-col max-w-3xl ${alignClass} ${className}`}>
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-3.5"
        >
          <Badge variant={badgeVariant} icon={badgeIcon}>
            {badge}
          </Badge>
        </motion.div>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`editorial-heading text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.15] ${
          light ? 'text-white' : 'text-brand-navy'
        }`}
      >
        {renderTitle()}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`mt-4 text-base sm:text-lg leading-relaxed font-normal ${
            light ? 'text-slate-300' : 'text-brand-muted'
          }`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};
