import { ref } from 'objection';
import ExecutionStep from '../../models/execution-step.js';
import Step from '../../models/step.js';

const getStepWithTestExecutions = async (_parent, params, context) => {
  const conditions = context.currentUser.can('update', 'Flow');
  const userSteps = context.currentUser.$relatedQuery('steps');
  const allSteps = Step.query();
  const stepBaseQuery = conditions.isCreator ? userSteps : allSteps;

  const step = await stepBaseQuery
    .clone()
    .findOne({ 'steps.id': params.stepId })
    .throwIfNotFound();

  const previousStepsWithCurrentStep = await stepBaseQuery
    .clone()
    .withGraphJoined('executionSteps')
    .where('flow_id', '=', step.flowId)
    .andWhere('position', '<', step.position)
    .andWhere(
      'executionSteps.created_at',
      '=',
      ExecutionStep.query()
        .max('created_at')
        .where('step_id', '=', ref('steps.id'))
        .andWhere('status', 'success')
    )
    .orderBy('steps.position', 'asc');

  return previousStepsWithCurrentStep;
};

export default getStepWithTestExecutions;
