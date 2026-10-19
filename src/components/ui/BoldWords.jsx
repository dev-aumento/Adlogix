import React from 'react';

/**
 * Show `text` with `highlight` in bold. WordPress stores the words to bold as their own
 * field, so an editor can move or clear the emphasis. Without an exact match the text
 * renders unchanged, same rule as the highlighted word in `SectionHeading`.
 */
export const BoldWords = ({ text, highlight, className = 'text-brand-navy' }) => {
  if (!text) return null;
  if (!highlight || !text.includes(highlight)) return <>{text}</>;

  const [before, ...rest] = text.split(highlight);
  return (
    <>
      {before}
      <strong className={className}>{highlight}</strong>
      {rest.join(highlight)}
    </>
  );
};
