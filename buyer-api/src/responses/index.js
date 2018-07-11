const errorResponse = (message, field) => {
  const err = {
    error: {
      message,
    },
  };

  if (typeof field !== 'undefined' && field !== '' && field !== null) {
    err.error.field = field;
  }

  return err;
};

const invalidAddressResponse = field => errorResponse('invalid or malformed address', field);

export { errorResponse, invalidAddressResponse };
