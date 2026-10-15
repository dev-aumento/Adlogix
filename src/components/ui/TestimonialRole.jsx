import React from 'react';

/** "Role, **Company**", or whichever part exists. */
export const TestimonialRole = ({ role, company, className }) => {
  if (!role && !company) return null;
  return (
    <p className={className}>
      {role}
      {role && company && ', '}
      {company && <strong className="text-slate-700">{company}</strong>}
    </p>
  );
};

/** Video modal payload for a testimonial. */
export const testimonialVideo = (test) => ({
  title: [test.clientName, test.company].filter(Boolean).join(' - '),
  client: test.company,
  videoUrl: test.videoUrl,
  videoThumbnail: test.videoThumbnail,
  quote: test.quote,
  role: test.role,
  company: test.company,
  result: test.result,
  projectSlug: test.projectSlug
});
