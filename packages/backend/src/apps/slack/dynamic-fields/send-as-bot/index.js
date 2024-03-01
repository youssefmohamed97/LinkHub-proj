export default {
  name: 'List fields after send as bot',
  key: 'listFieldsAfterSendAsBot',

  async run($) {
    if ($.step.parameters.sendAsBot) {
      return [
        {
          label: 'Bot name',
          key: 'botName',
          type: 'string',
          required: true,
          value: 'Automatisch',
          description:
            'Specify the bot name which appears as a bold username above the message inside Slack. Defaults to Automatisch.',
          variables: true,
        },
        {
          label: 'Bot icon',
          key: 'botIcon',
          type: 'string',
          required: false,
          description:
            'Either an image url or an emoji available to your team (surrounded by :). For example, https://example.com/icon_256.png or :robot_face:',
          variables: true,
        },
      ];
    }
  },
};
