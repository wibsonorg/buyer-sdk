const isPresent = obj => obj !== null && obj !== undefined;

/*
 * Checks that `nonce` and one of `params` or `payload` are
 * present.
 */
const validatePresence = ({ nonce, params, payload }, validateParameters) => {
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

  if (isPresent(params) && validateParameters) {
    errors = [
      ...errors,
      ...validateParameters(params),
    ];
  }

  return errors;
};

export { isPresent, validatePresence };
