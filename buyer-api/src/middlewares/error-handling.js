import { logger } from '../utils';

export const asyncError = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const errorHandler = (err, req, res) => {
  logger.error(err.message, err.fileName, err.lineNumber);
  res.boom.badImplementation('Problems on our side', err);
};

export default errorHandler;
