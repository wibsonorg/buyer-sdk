import web3 from './web3';
import logger from './logger';

const asyncError = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  logger.error(err.message, err.fileName, err.lineNumber);
  res.boom.badImplementation();
};

/**
 * Middleware to check if an ethereum address is valid or not.
 * @param {String} paramName the field where the address is.
 * @public
 */
const validateAddress = paramName => async (req, res, next) => {
  const address = req.params[paramName];

  if (web3.utils.isAddress(address)) {
    return next();
  }
  res.status(400).send({
    error: {
      message: 'Invalid or malformed address',
      field: paramName,
    },
  });
  return undefined;
};

const validateFields = (req) => {
  let errors = []
  if(!req.orderId) errors.push("Field 'orderId' is required");
  else if(typeof(req.orderId) !== 'number') errors.push("Field 'orderId' is invalid");

  return errors;
}

export { errorHandler, asyncError, validateAddress, validateFields };
