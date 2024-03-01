import defineTrigger from '../../../../helpers/define-trigger.js';
import newWatchers from './new-watchers.js';

export default defineTrigger({
  name: 'New watchers',
  key: 'newWatchers',
  pollInterval: 1,
  description: 'Triggers when a user watches a repository',
  arguments: [
    {
      label: 'Repo',
      key: 'repo',
      type: 'dropdown',
      required: true,
      variables: false,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listRepos',
          },
        ],
      },
    },
  ],

  async run($) {
    await newWatchers($);
  },
});
