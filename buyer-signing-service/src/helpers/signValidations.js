const isPresent = obj => obj !== null && obj !== undefined;

/*
 * Checks that `nonce` and one of `params` or `payload` are
 * present.
 */
const validate = ({ nonce, params, payload }, validateParameters) => {
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

  if (isPresent(params)) {
    const paramsErrors = validateParameters ? validateParameters(params) : [];
    errors = [
      ...errors,
      ...paramsErrors,
    ];
  }

  return errors;
};

export { isPresent, validate };
