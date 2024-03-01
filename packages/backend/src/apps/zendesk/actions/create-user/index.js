import defineAction from '../../../../helpers/define-action.js';
import { fields } from './fields.js';

export default defineAction({
  name: 'Create user',
  key: 'createUser',
  description: 'Creates a new user.',
  arguments: fields,

  async run($) {
    const {
      name,
      email,
      details,
      notes,
      phone,
      role,
      organizationId,
      externalId,
      verified,
    } = $.step.parameters;

    const tags = $.step.parameters.tags;
    const formattedTags = tags.split(',');

    const payload = {
      user: {
        name,
        email,
        details,
        notes,
        phone,
        organization_id: organizationId,
        external_id: externalId,
        verified: verified || 'false',
        tags: formattedTags,
      },
    };

    if (role) {
      payload.user.role = role;
    }

    const response = await $.http.post('/api/v2/users', payload);

    $.setActionItem({ raw: response.data });
  },
});
