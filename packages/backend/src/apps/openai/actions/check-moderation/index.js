import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Check moderation',
  key: 'checkModeration',
  description:
    'Checks for hate, hate/threatening, self-harm, sexual, sexual/minors, violence, or violence/graphic content in the given text.',
  arguments: [
    {
      label: 'Input',
      key: 'input',
      type: 'string',
      required: true,
      variables: true,
      description: 'The text to analyze.',
    },
  ],

  async run($) {
    const { data } = await $.http.post('/v1/moderations', {
      input: $.step.parameters.input,
    });

    const result = data?.results[0];

    $.setActionItem({
      raw: result,
    });
  },
});
