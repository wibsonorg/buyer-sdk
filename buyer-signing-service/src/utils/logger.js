import winston from 'winston';
import config from '../../config';

const logger = winston.createLogger();

if (config.env === 'production') {
  logger.add(new winston.transports.Console());
  logger.add(new winston.transports.File({ filename: config.log.combined }));
  logger.add(new winston.transports.File({ filename: config.log.error, level: 'error' }));
} else if (config.env === 'development') {
  logger.add(new winston.transports.Console({ format: winston.format.simple() }));
} else {
  logger.add(new winston.transports.Console({ silent: true }));
}

module.exports = logger;
module.exports.stream = {
  write(message) {
    logger.info(message);
  },
};
