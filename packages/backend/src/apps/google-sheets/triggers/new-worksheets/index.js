import defineTrigger from '../../../../helpers/define-trigger.js';
import newWorksheets from './new-worksheets.js';

export default defineTrigger({
  name: 'New worksheets',
  key: 'newWorksheets',
  pollInterval: 1,
  description: 'Triggers when you create a new worksheet in a spreadsheet.',
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
    {
      label: 'Spreadsheet',
      key: 'spreadsheetId',
      type: 'dropdown',
      required: true,
      dependsOn: ['parameters.driveId'],
      description: 'The spreadsheets in your Google Drive.',
      variables: false,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listSpreadsheets',
          },
          {
            name: 'parameters.driveId',
            value: '{parameters.driveId}',
          },
        ],
      },
    },
  ],

  async run($) {
    await newWorksheets($);
  },
});
