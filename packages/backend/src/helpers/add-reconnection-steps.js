import cloneDeep from 'lodash/cloneDeep.js';

const connectionIdArgument = {
  name: 'id',
  value: '{connection.id}',
};

const resetConnectionStep = {
  type: 'mutation',
  name: 'resetConnection',
  arguments: [connectionIdArgument],
};

function replaceCreateConnection(string) {
  return string.replace('{createConnection.id}', '{connection.id}');
}

function removeAppKeyArgument(args) {
  return args.filter((argument) => argument.name !== 'key');
}

function addConnectionId(step) {
  step.arguments = step.arguments.map((argument) => {
    if (typeof argument.value === 'string') {
      argument.value = replaceCreateConnection(argument.value);
    }

    if (argument.properties) {
      argument.properties = argument.properties.map((property) => {
        return {
          name: property.name,
          value: replaceCreateConnection(property.value),
        };
      });
    }

    return argument;
  });

  return step;
}

function replaceCreateConnectionsWithUpdate(steps) {
  const updatedSteps = cloneDeep(steps);
  return updatedSteps.map((step) => {
    const updatedStep = addConnectionId(step);

    if (step.name === 'createConnection') {
      updatedStep.name = 'updateConnection';
      updatedStep.arguments = removeAppKeyArgument(updatedStep.arguments);
      updatedStep.arguments.unshift(connectionIdArgument);

      return updatedStep;
    }

    return step;
  });
}

function addReconnectionSteps(app) {
  const hasReconnectionSteps = app.auth.reconnectionSteps;

  if (hasReconnectionSteps) return app;

  if (app.auth.authenticationSteps) {
    const updatedSteps = replaceCreateConnectionsWithUpdate(
      app.auth.authenticationSteps
    );

    app.auth.reconnectionSteps = [resetConnectionStep, ...updatedSteps];
  }

  if (app.auth.sharedAuthenticationSteps) {
    const updatedStepsWithEmbeddedDefaults = replaceCreateConnectionsWithUpdate(
      app.auth.sharedAuthenticationSteps
    );

    app.auth.sharedReconnectionSteps = [
      resetConnectionStep,
      ...updatedStepsWithEmbeddedDefaults,
    ];
  }

  return app;
}

export default addReconnectionSteps;
