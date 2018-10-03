import logger from '../utils/logger';

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  logger.error(err.message, err.fileName, err.lineNumber);
  res.boom.badImplementation();
};

export default errorHandler;
