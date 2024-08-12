import defineTrigger from '../../../../helpers/define-trigger.js';
import newItemsInFeed from './new-items-in-feed.js';

export default defineTrigger({
  name: 'New items in feed',
  key: 'newItemsInFeed',
  description: 'Triggers on new upwork  feed item.',
  pollInterval: 2,
  arguments: [
    {
      label: 'Feed URL',
      key: 'feedUrl',
      type: 'string',
      required: true,
      description: 'Paste your publicly accessible upwork  URL here.',
      variables: false,
    },
  ],

  async run($) {
    await newItemsInFeed($);
  },
});
