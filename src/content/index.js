import { homeDefaults, mapHomeFields } from './home';
import { aboutDefaults, mapAboutFields } from './about';

/**
 * Content models per WordPress page slug. Pages without a model still get their
 * section order from WordPress; their content stays in the React components.
 */
export const pageModels = {
  home: { defaults: homeDefaults, mapFields: mapHomeFields },
  about: { defaults: aboutDefaults, mapFields: mapAboutFields },
};
