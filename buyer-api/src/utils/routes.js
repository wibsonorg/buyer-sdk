import web3 from './web3';
import logger from './logger';

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err.failedValidation) {
    res.boom.badData('Validation error', err.results);
    logger.error(`${err.message
    }\nerrors\n${err.results.errors.map(e => `  ${e.message}`)
    }\nwarnings\n${err.results.warnings.map(e => `  ${e.message}`)
    }`);
  } else {
    res.boom.badImplementation();
    logger.error(err.stack);
  }
}

export const isValidAddress = address => web3.utils.isAddress(address) && (
  !/[A-F]/.test(address) ||
  web3.utils.checkAddressChecksum(address)
);

/**
 * Middleware to check if an ethereum address is valid or not.
 * @param {String} paramName the field where the address is.
 * @public
 */
export function validateAddress(fieldPath) {
  const fieldProps = typeof fieldPath === 'string' ? fieldPath.split('.') : fieldPath;
  return async (req, res, next) => {
    const address = fieldProps.reduce((r, c) => r && r[c], req);
    const fieldIsValid = (
      typeof address === 'string' && isValidAddress(address)
    ) || (
      address.every && address.every(isValidAddress)
    );

    if (fieldIsValid) {
      next();
    } else {
      const fieldName = fieldProps.slice(-1)[0];
      throw Object.assign(new Error('Validation error', fieldName), {
        failedValidation: true,
        results: {
          errors: [{
            message: 'Invalid or malformed address',
            fieldName,
            fieldPath,
          }],
        },
      });
    }
  };
}

/**
 * Middleware to check if an Authorization Bearer token is valid or not.
 * @param {String} token token to check agaisnt.
 * @public
 */
export function validateAuthorizationToken(token) {
  return async (req, res, next) => {
    if (req.headers.authorization === `Bearer ${token}`) {
      next();
    } else {
      res.boom.unauthorized('Token invalid');
    }
  };
}
