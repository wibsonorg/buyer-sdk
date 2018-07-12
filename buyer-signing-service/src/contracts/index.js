import dxDefinition from './definitions/DataExchange.json';

const dxFunctionDefinitions = dxDefinition.abi
  .filter(({ type }) => type === 'function');

const getDataExchangeMethodSignature = (methodName) => {
  const { inputs } = dxFunctionDefinitions.find(({ name }) => name === methodName);
  const types = inputs.reduce((accumulator, { type }) => [...accumulator, type], []);
  const names = inputs.reduce((accumulator, { name }) => [...accumulator, name], []);

  return {
    functionSignature: `${methodName}(${types.join(',')})`,
    parameterNames: names,
    schema: inputs,
  };
};


export default getDataExchangeMethodSignature;
