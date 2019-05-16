import winston from 'winston';
import config from '../../config';

const logger = winston.createLogger();

switch (config.env) {
  case 'production':
    const format = winston.format.combine(
      winston.format.simple(),
      winston.format.timestamp(),
      winston.format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`),
    );
    logger.add(new winston.transports.Console({ handleExceptions: true }));
    logger.add(new winston.transports.File({
      filename: config.log.combined,
      handleExceptions: true,
      format,
    }));
    logger.add(new winston.transports.File({
      filename: config.log.error,
      handleExceptions: true,
      level: 'error',
      format,
    }));
    break;
  case 'development':
    logger.add(new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.simple(),
        winston.format.colorize(),
        winston.format.timestamp({ format: 'HH:mm:ss.SSS' }),
        winston.format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`),
      ),
    }));
    break;
  case 'test':
  default:
    logger.add(new winston.transports.Console({ silent: true }));
    break;
}

module.exports = logger;
module.exports.stream = {
  write(message) {
    logger.info(message);
  },
};
