export default {
  name: 'List clients',
  key: 'listClients',

  async run($) {
    const clients = {
      data: [],
    };

    const params = {
      sort: 'created_at|desc',
    };

    const {
      data: { data },
    } = await $.http.get('/v1/clients', { params });

    if (!data?.length) {
      return;
    }

    for (const client of data) {
      clients.data.push({
        value: client.id,
        name: client.name,
      });
    }

    return clients;
  },
};
