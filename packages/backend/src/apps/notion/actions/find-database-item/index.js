import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Find database item',
  key: 'findDatabaseItem',
  description: 'Searches for an item in a database by property.',
  arguments: [
    {
      label: 'Database',
      key: 'databaseId',
      type: 'dropdown',
      required: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listDatabases',
          },
        ],
      },
    },
    {
      label: 'Name',
      key: 'name',
      type: 'string',
      required: false,
      description:
        'This field has a 2000 character limit. Any characters beyond 2000 will not be included.',
      variables: true,
    },
  ],

  async run($) {
    const databaseId = $.step.parameters.databaseId;
    const name = $.step.parameters.name;
    const truncatedName = name.slice(0, 2000);

    const body = {
      filter: {
        property: 'Name',
        rich_text: {
          equals: truncatedName,
        },
      },
      sorts: [
        {
          timestamp: 'last_edited_time',
          direction: 'descending',
        },
      ],
    };

    const { data } = await $.http.post(
      `/v1/databases/${databaseId}/query`,
      body
    );

    $.setActionItem({
      raw: data.results[0],
    });
  },
});
