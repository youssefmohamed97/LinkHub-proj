import defineTrigger from '../../../../helpers/define-trigger.js';
import newFilesInFolder from './new-files-in-folder.js';

export default defineTrigger({
  name: 'New files in folder',
  key: 'newFilesInFolder',
  pollInterval: 1,
  description:
    'Triggers when a new file is added directly to a specific folder (but not its subfolder).',
  arguments: [
    {
      label: 'Drive',
      key: 'driveId',
      type: 'dropdown',
      required: false,
      description:
        'The Google Drive where your file resides. If nothing is selected, then your personal Google Drive will be used.',
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
      label: 'Folder',
      key: 'folderId',
      type: 'dropdown',
      required: false,
      dependsOn: ['parameters.driveId'],
      description:
        'Check a specific folder for new files. Please note: new files added to subfolders inside the folder you choose here will NOT trigger this flow. Defaults to the top-level folder if none is picked.',
      variables: false,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listFolders',
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
    await newFilesInFolder($);
  },
});
