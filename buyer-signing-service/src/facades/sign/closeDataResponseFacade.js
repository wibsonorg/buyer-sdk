import EthTx from 'ethereumjs-tx';
import { Buffer } from 'safe-buffer';
import Response from '../Response';
import { buyer, encodeFunctionCall } from '../../helpers';
import { getDataExchangeMethodDefinition } from '../../contracts';
import config from '../../../config';

const {
  jsonInterface,
  parameterNames,
  inputSchema,
} = getDataExchangeMethodDefinition('closeDataResponse');

const {
  getAddress,
  getPrivateKey,
} = buyer;

const isPresent = obj => obj !== null && obj !== undefined;

const validateParameters = parameters =>
  inputSchema.reduce((accumulator, { name }) => {
    // TODO: type validation/coercion should also be done
    const value = parameters[name];

    if (value === null || value === undefined) {
      return [...accumulator, `Field '${name}' is required`];
    }

    return accumulator;
  }, []);

const validatePresence = (nonce, params, payload) => {
  let errors = [];

  if (!isPresent(nonce)) {
    errors = ['Field \'nonce\' is required'];
  }

  if (!isPresent(params) && !isPresent(payload)) {
    errors = [
      ...errors,
      'Field \'params\' or \'payload\' must be provided',
    ];
  }

  return errors;
};

const buildData = (params, payload) => {
  if (isPresent(params)) {
    return encodeFunctionCall(
      jsonInterface,
      parameterNames.map(name => params[name]),
    );
  }

  return payload;
};

const closeDataResponseFacade = (nonce, params, payload) => {
  let errors = validatePresence(nonce, params, payload);
  if (isPresent(params)) {
    errors = [...errors, ...validateParameters(params)];
  }

  if (errors.length > 0) {
    return new Response(null, errors);
  }

  const data = buildData(params, null);

  const rawTransaction = {
    from: getAddress(),
    to: config.contracts.dataExchange.address,
    value: '0x00',
    nonce: `0x${nonce.toString(16)}`,
    gasLimit: `0x${parseInt(config.contracts.dataExchange.addDataResponseToOrder.gasLimit, 10).toString(16)}`,
    data,
  };

  const tx = new EthTx(rawTransaction);
  tx.sign(Buffer.from(getPrivateKey(), 'hex'));

  const result = tx.serialize().toString('hex');

  return new Response(result);
};

export default closeDataResponseFacade;
