import bcrypt from 'bcrypt';
import { DateTime } from 'luxon';
import crypto from 'node:crypto';

import appConfig from '../config/app.js';
import { hasValidLicense } from '../helpers/license.ee.js';
import userAbility from '../helpers/user-ability.js';
import Base from './base.js';
import Connection from './connection.js';
import Execution from './execution.js';
import Flow from './flow.js';
import Identity from './identity.ee.js';
import Permission from './permission.js';
import Role from './role.js';
import Step from './step.js';
import Subscription from './subscription.ee.js';
import UsageData from './usage-data.ee.js';

class User extends Base {
  static tableName = 'users';

  static jsonSchema = {
    type: 'object',
    required: ['fullName', 'email'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      fullName: { type: 'string', minLength: 1 },
      email: { type: 'string', format: 'email', minLength: 1, maxLength: 255 },
      password: { type: 'string' },
      resetPasswordToken: { type: 'string' },
      resetPasswordTokenSentAt: { type: 'string' },
      trialExpiryDate: { type: 'string' },
      roleId: { type: 'string', format: 'uuid' },
      deletedAt: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static relationMappings = () => ({
    connections: {
      relation: Base.HasManyRelation,
      modelClass: Connection,
      join: {
        from: 'users.id',
        to: 'connections.user_id',
      },
    },
    flows: {
      relation: Base.HasManyRelation,
      modelClass: Flow,
      join: {
        from: 'users.id',
        to: 'flows.user_id',
      },
    },
    steps: {
      relation: Base.ManyToManyRelation,
      modelClass: Step,
      join: {
        from: 'users.id',
        through: {
          from: 'flows.user_id',
          to: 'flows.id',
        },
        to: 'steps.flow_id',
      },
    },
    executions: {
      relation: Base.ManyToManyRelation,
      modelClass: Execution,
      join: {
        from: 'users.id',
        through: {
          from: 'flows.user_id',
          to: 'flows.id',
        },
        to: 'executions.flow_id',
      },
    },
    usageData: {
      relation: Base.HasManyRelation,
      modelClass: UsageData,
      join: {
        from: 'usage_data.user_id',
        to: 'users.id',
      },
    },
    currentUsageData: {
      relation: Base.HasOneRelation,
      modelClass: UsageData,
      join: {
        from: 'usage_data.user_id',
        to: 'users.id',
      },
      filter(builder) {
        builder.orderBy('created_at', 'desc').limit(1).first();
      },
    },
    subscriptions: {
      relation: Base.HasManyRelation,
      modelClass: Subscription,
      join: {
        from: 'subscriptions.user_id',
        to: 'users.id',
      },
    },
    currentSubscription: {
      relation: Base.HasOneRelation,
      modelClass: Subscription,
      join: {
        from: 'subscriptions.user_id',
        to: 'users.id',
      },
      filter(builder) {
        builder.orderBy('created_at', 'desc').limit(1).first();
      },
    },
    role: {
      relation: Base.HasOneRelation,
      modelClass: Role,
      join: {
        from: 'roles.id',
        to: 'users.role_id',
      },
    },
    permissions: {
      relation: Base.HasManyRelation,
      modelClass: Permission,
      join: {
        from: 'users.role_id',
        to: 'permissions.role_id',
      },
    },
    identities: {
      relation: Base.HasManyRelation,
      modelClass: Identity,
      join: {
        from: 'identities.user_id',
        to: 'users.id',
      },
    },
  });

  login(password) {
    return bcrypt.compare(password, this.password);
  }

  async generateResetPasswordToken() {
    const resetPasswordToken = crypto.randomBytes(64).toString('hex');
    const resetPasswordTokenSentAt = new Date().toISOString();

    await this.$query().patch({ resetPasswordToken, resetPasswordTokenSentAt });
  }

  async resetPassword(password) {
    return await this.$query().patch({
      resetPasswordToken: null,
      resetPasswordTokenSentAt: null,
      password,
    });
  }

  async isResetPasswordTokenValid() {
    if (!this.resetPasswordTokenSentAt) {
      return false;
    }

    const sentAt = new Date(this.resetPasswordTokenSentAt);
    const now = new Date();
    const fourHoursInMilliseconds = 1000 * 60 * 60 * 4;

    return now.getTime() - sentAt.getTime() < fourHoursInMilliseconds;
  }

  async generateHash() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async startTrialPeriod() {
    this.trialExpiryDate = DateTime.now().plus({ days: 30 }).toISODate();
  }

  async isAllowedToRunFlows() {
    if (appConfig.isSelfHosted) {
      return true;
    }

    if (await this.inTrial()) {
      return true;
    }

    if ((await this.hasActiveSubscription()) && (await this.withinLimits())) {
      return true;
    }

    return false;
  }

  async inTrial() {
    if (appConfig.isSelfHosted) {
      return false;
    }

    if (!this.trialExpiryDate) {
      return false;
    }

    if (await this.hasActiveSubscription()) {
      return false;
    }

    const expiryDate = DateTime.fromJSDate(this.trialExpiryDate);
    const now = DateTime.now();

    return now < expiryDate;
  }

  async hasActiveSubscription() {
    if (!appConfig.isCloud) {
      return false;
    }

    const subscription = await this.$relatedQuery('currentSubscription');

    return subscription?.isValid;
  }

  async withinLimits() {
    const currentSubscription = await this.$relatedQuery('currentSubscription');
    const plan = currentSubscription.plan;
    const currentUsageData = await this.$relatedQuery('currentUsageData');

    return currentUsageData.consumedTaskCount < plan.quota;
  }

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);

    this.email = this.email.toLowerCase();
    await this.generateHash();

    if (appConfig.isCloud) {
      await this.startTrialPeriod();
    }
  }

  async $beforeUpdate(opt, queryContext) {
    await super.$beforeUpdate(opt, queryContext);

    if (this.email) {
      this.email = this.email.toLowerCase();
    }

    await this.generateHash();
  }

  async $afterInsert(queryContext) {
    await super.$afterInsert(queryContext);

    if (appConfig.isCloud) {
      await this.$relatedQuery('usageData').insert({
        userId: this.id,
        consumedTaskCount: 0,
        nextResetAt: DateTime.now().plus({ days: 30 }).toISODate(),
      });
    }
  }

  async $afterFind() {
    if (await hasValidLicense()) return this;

    if (Array.isArray(this.permissions)) {
      this.permissions = this.permissions.filter((permission) => {
        const restrictedSubjects = [
          'App',
          'Role',
          'SamlAuthProvider',
          'Config',
        ];

        return !restrictedSubjects.includes(permission.subject);
      });
    }

    return this;
  }

  get ability() {
    return userAbility(this);
  }

  can(action, subject) {
    const can = this.ability.can(action, subject);

    if (!can) throw new Error('Not authorized!');

    const relevantRule = this.ability.relevantRuleFor(action, subject);

    const conditions = relevantRule?.conditions || [];
    const conditionMap = Object.fromEntries(
      conditions.map((condition) => [condition, true])
    );

    return conditionMap;
  }

  cannot(action, subject) {
    const cannot = this.ability.cannot(action, subject);

    if (cannot) throw new Error('Not authorized!');

    return cannot;
  }
}

export default User;
