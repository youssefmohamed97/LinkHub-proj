import defineAction from '../../../../helpers/define-action.js';
import postMessage from './post-message.js';

export default defineAction({
  name: 'Send a direct message',
  key: 'sendDirectMessage',
  description:
    'Sends a direct message to a user or yourself from the Slackbot.',
  arguments: [
    {
      label: 'To username',
      key: 'toUsername',
      type: 'dropdown',
      required: true,
      description: 'Pick a user to send the message to.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listUsers',
          },
        ],
      },
    },
    {
      label: 'Message text',
      key: 'message',
      type: 'string',
      required: true,
      description: 'The content of your new message.',
      variables: true,
    },
    {
      label: 'Send as a bot?',
      key: 'sendAsBot',
      type: 'dropdown',
      required: false,
      value: false,
      description:
        'If you choose no, this message will appear to come from you. Direct messages are always sent by bots.',
      variables: true,
      options: [
        {
          label: 'Yes',
          value: true,
        },
        {
          label: 'No',
          value: false,
        },
      ],
      additionalFields: {
        type: 'query',
        name: 'getDynamicFields',
        arguments: [
          {
            name: 'key',
            value: 'listFieldsAfterSendAsBot',
          },
          {
            name: 'parameters.sendAsBot',
            value: '{parameters.sendAsBot}',
          },
        ],
      },
    },
  ],

  async run($) {
    const message = await postMessage($);

    return message;
  },
});
