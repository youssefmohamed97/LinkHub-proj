import get from 'lodash.get';

const variableRegExp = /({{step\.[\da-zA-Z-]+(?:\.[^.}{]+)+}})/g;

export default function computeParameters(parameters, executionSteps) {
  const entries = Object.entries(parameters);
  return entries.reduce((result, [key, value]) => {
    if (typeof value === 'string') {
      const parts = value.split(variableRegExp);

      const computedValue = parts
        .map((part) => {
          const isVariable = part.match(variableRegExp);
          if (isVariable) {
            const stepIdAndKeyPath = part.replace(/{{step.|}}/g, '');
            const [stepId, ...keyPaths] = stepIdAndKeyPath.split('.');
            const keyPath = keyPaths.join('.');
            const executionStep = executionSteps.find((executionStep) => {
              return executionStep.stepId === stepId;
            });
            const data = executionStep?.dataOut;
            const dataValue = get(data, keyPath);
            return dataValue;
          }

          return part;
        })
        .join('');

      return {
        ...result,
        [key]: computedValue,
      };
    }

    if (Array.isArray(value)) {
      return {
        ...result,
        [key]: value.map((item) => computeParameters(item, executionSteps)),
      };
    }

    return {
      ...result,
      [key]: value,
    };
  }, {});
}
