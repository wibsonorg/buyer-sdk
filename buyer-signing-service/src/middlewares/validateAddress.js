import web3Utils from 'web3-utils';

/**
 * Middleware to check if an ethereum address is valid or not.
 * @param {String} paramName the field where the address is.
 * @public
 */
const validateAddress = paramName => async (req, res, next) => {
  const address = req.params[paramName] || req.body[paramName];

  if (web3Utils.isAddress(address)) {
    next();
  } else {
    res.boom.badData('Invalid or malformed address', {
      validation: {
        field: paramName,
      },
    });
  }
};

export default validateAddress;
