import { raw } from 'objection';
import Base from './base.js';
import User from './user.js';
import Subscription from './subscription.ee.js';

class UsageData extends Base {
  static tableName = 'usage_data';

  static jsonSchema = {
    type: 'object',
    required: ['userId', 'consumedTaskCount', 'nextResetAt'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      userId: { type: 'string', format: 'uuid' },
      subscriptionId: { type: 'string', format: 'uuid' },
      consumedTaskCount: { type: 'integer' },
      nextResetAt: { type: 'string' },
      deletedAt: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static relationMappings = () => ({
    user: {
      relation: Base.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'usage_data.user_id',
        to: 'users.id',
      },
    },
    subscription: {
      relation: Base.BelongsToOneRelation,
      modelClass: Subscription,
      join: {
        from: 'usage_data.subscription_id',
        to: 'subscriptions.id',
      },
    },
  });

  async increaseConsumedTaskCountByOne() {
    return await this.$query().patch({
      consumedTaskCount: raw('consumed_task_count + 1'),
    });
  }
}

export default UsageData;
