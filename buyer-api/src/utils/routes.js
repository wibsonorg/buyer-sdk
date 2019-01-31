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

/**
 * Middleware to check if an notarization result is valid or not.
 * @public
 */
const validateFields = () => (req, res, next) => {
  const notarizationResult = req.body;

  if (!notarizationResult.orderId) {
    res.status(422).json({
      statusCode: 422,
      statusText: 'Unprocessable Entity',
      message: 'Parameters missing',
      errors: ['Field "orderId" is required'],
    });
    return undefined;
  } else if (typeof notarizationResult.orderId !== 'number') {
    res.status(422).json({
      statusCode: 422,
      statusText: 'Unprocessable Entity',
      message: 'Parameters missing',
      errors: ['Field "orderId" is invalid'],
    });
    return undefined;
  }

  return next();
};

export { errorHandler, asyncError, validateAddress, validateFields };
