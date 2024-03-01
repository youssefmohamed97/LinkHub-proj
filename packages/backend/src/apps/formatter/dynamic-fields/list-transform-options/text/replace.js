const replace = [
  {
    label: 'Input',
    key: 'input',
    type: 'string',
    required: true,
    description: 'Text that you want to search for and replace values.',
    variables: true,
  },
  {
    label: 'Find',
    key: 'find',
    type: 'string',
    required: true,
    description: 'Text that will be searched for.',
    variables: true,
  },
  {
    label: 'Replace',
    key: 'replace',
    type: 'string',
    required: false,
    description: 'Text that will replace the found text.',
    variables: true,
  },
];

export default replace;
