import defineTrigger from '../../../../helpers/define-trigger.js';
import newPullRequests from './new-pull-requests.js';

export default defineTrigger({
  name: 'New pull requests',
  key: 'newPullRequests',
  pollInterval: 1,
  description: 'Triggers when a new pull request is created',
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
    await newPullRequests($);
  },
});
