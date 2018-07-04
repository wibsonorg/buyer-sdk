import winston from 'winston';
import config from '../../config';

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(info => `${info.level} ${info.message}`),
      ),
    }),
    new winston.transports.File({ filename: config.log.error, level: 'error' }),
    new winston.transports.File({ filename: config.log.combined }),
  ],
});

module.exports = logger;
module.exports.stream = {
  write(message) {
    logger.info(message);
  },
};
