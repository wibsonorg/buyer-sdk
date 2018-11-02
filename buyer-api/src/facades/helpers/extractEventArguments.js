import web3 from '../../utils/web3';

export const extractEventArguments = (eventName, logs, contract) => {
  const {
    inputs,
    signature,
  } = contract.options.jsonInterface.find(({ name, type }) =>
    name === eventName && type === 'event');

  const eventLog = logs.find(log => log.topics[0] === signature);

  if (!eventLog) return null;

  return web3.eth.abi.decodeLog(inputs, eventLog.data, eventLog.topics.slice(1));
};
