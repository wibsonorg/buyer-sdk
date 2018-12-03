import winston from 'winston';
import config from '../../config';

const logger = winston.createLogger();

switch (config.env) {
  case 'production':
    logger.add(new winston.transports.Console());
    logger.add(new winston.transports.File({ filename: config.log.combined }));
    logger.add(new winston.transports.File({ filename: config.log.error, level: 'error' }));
    break;
  case 'development':
    logger.add(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.simple(),
        winston.format.colorize(),
        winston.format.timestamp({ format: 'HH:mm:ss.SSS' }),
        winston.format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`),
      ),
      level: 'debug',
    }));
    break;
  default:
    logger.add(new winston.transports.File({
      format: winston.format.simple(),
      filename: config.log.combined,
    }));
    break;
}

module.exports = logger;
module.exports.stream = {
  write(message) {
    logger.info(message);
  },
};
