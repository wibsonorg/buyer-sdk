import { logger } from '../utils';

const errorHandler = (err, req, res) => {
  logger.error(err.message, err.fileName, err.lineNumber);
  res.boom.badImplementation('Problems on our side', err);
};

export default errorHandler;
