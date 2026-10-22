import { homeDefaults, mapHomeFields } from './home';
import { aboutDefaults, mapAboutFields } from './about';
import { servicesDefaults, mapServicesFields } from './services';
import { reelsDefaults, mapReelsFields } from './reels';
import { workDefaults, mapWorkFields } from './work';
import { industriesDefaults, mapIndustriesFields } from './industries';
import { blogDefaults, mapBlogFields } from './blog';
import { testimonialsDefaults, mapTestimonialsFields } from './testimonials';
import { contactDefaults, mapContactFields } from './contact';

/**
 * Content models per WordPress page slug. Pages without a model still get their
 * section order from WordPress; their content stays in the React components.
 */
export const pageModels = {
  home: { defaults: homeDefaults, mapFields: mapHomeFields },
  about: { defaults: aboutDefaults, mapFields: mapAboutFields },
  services: { defaults: servicesDefaults, mapFields: mapServicesFields },
  reels: { defaults: reelsDefaults, mapFields: mapReelsFields },
  work: { defaults: workDefaults, mapFields: mapWorkFields },
  industries: { defaults: industriesDefaults, mapFields: mapIndustriesFields },
  blog: { defaults: blogDefaults, mapFields: mapBlogFields },
  testimonials: { defaults: testimonialsDefaults, mapFields: mapTestimonialsFields },
  contact: { defaults: contactDefaults, mapFields: mapContactFields },
};
