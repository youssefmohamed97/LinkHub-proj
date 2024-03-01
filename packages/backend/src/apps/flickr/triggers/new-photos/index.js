import defineTrigger from '../../../../helpers/define-trigger.js';
import newPhotos from './new-photos.js';

export default defineTrigger({
  name: 'New photos',
  pollInterval: 1,
  key: 'newPhotos',
  description: 'Triggers when you add a new photo.',

  async run($) {
    await newPhotos($);
  },
});
