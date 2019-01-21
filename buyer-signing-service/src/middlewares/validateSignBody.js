import { isPresent } from '../utils/wibson-lib';

/**
 * Middleware to check sign body has all needed parameters.
 */
const validateSignBody = async (req, res, next) => {
  const { nonce, gasPrice, params } = req.body;
  let errors = [];

  if (!isPresent(nonce)) {
    errors = [...errors, 'Field \'nonce\' is required'];
  }

  if (!isPresent(gasPrice)) {
    errors = [...errors, 'Field \'gasPrice\' is required'];
  }

  if (!isPresent(params)) {
    errors = [...errors, 'Field \'params\' is required'];
  }

  if (errors.length === 0) {
    next();
  } else {
    res.boom.badData('Missing parameters', {
      errors,
    });
  }
};

export default validateSignBody;
