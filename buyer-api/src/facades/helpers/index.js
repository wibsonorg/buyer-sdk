import SolidityEvent from 'web3/lib/web3/event';

export const parseLogs = (logs, abi) => {
  const decoders = abi
    .filter(({ type }) => type === 'event')
    .map(json => new SolidityEvent(null, json, null));

  return logs.reduce((accumulator, log) => {
    const found = decoders
      .find(decoder => decoder.signature() === log.topics[0].replace('0x', ''));

    if (found) {
      return [...accumulator, found.decode(log)];
    }

    return accumulator;
  }, []);
};

export const extractEventArguments = (eventName, logs, contract) => {
  const parsedLogs = parseLogs(logs, contract.abi);

  const { args } = parsedLogs.find(({ event }) => event === eventName);
  return args;
};
