import defineTrigger from '../../../../helpers/define-trigger.js';
import newSpreadsheets from './new-spreadsheets.js';

export default defineTrigger({
  name: 'New spreadsheets',
  key: 'newSpreadsheets',
  pollInterval: 1,
  description: 'Triggers when you create a new spreadsheet.',
  arguments: [
    {
      label: 'Drive',
      key: 'driveId',
      type: 'dropdown',
      required: false,
      description:
        'The Google Drive where your spreadsheet resides. If nothing is selected, then your personal Google Drive will be used.',
      variables: false,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listDrives',
          },
        ],
      },
    },
  ],

  async run($) {
    await newSpreadsheets($);
  },
});
