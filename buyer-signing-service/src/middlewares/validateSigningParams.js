import { isPresent } from '../utils/wibson-lib';

/**
 * Checks that `account`, `nonce`, `gasPrice` and `params` are present.
 */
const validate = ({
  account, nonce, gasPrice, params,
}) => {
  let errors = [];

  if (!isPresent(account)) {
    errors = ['Field \'account\' is required'];
  }

  if (!isPresent(nonce)) {
    errors = [...errors, 'Field \'nonce\' is required'];
  }

  if (!isPresent(gasPrice)) {
    errors = [...errors, 'Field \'gasPrice\' is required'];
  }

  if (!isPresent(params)) {
    errors = [...errors, 'Field \'params\' is required'];
  }

  return errors;
};

const validateSigningParams = (req, res, next) => {
  const errors = validate(req.body);

  if (errors.length > 0) {
    res.boom.badData('Parameters missing', { validation: errors });
  } else {
    next();
  }
};

export default validateSigningParams;
