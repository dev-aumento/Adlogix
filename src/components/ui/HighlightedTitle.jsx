import React from 'react';

/** Render `text` with the first occurrence of `highlight` wrapped in a styled span. */
export const HighlightedTitle = ({ text, highlight, highlightClassName }) => {
  if (!text) return null;
  if (!highlight || !text.includes(highlight)) return text;

  const index = text.indexOf(highlight);
  return (
    <>
      {text.slice(0, index)}
      <span className={highlightClassName}>{highlight}</span>
      {text.slice(index + highlight.length)}
    </>
  );
};
