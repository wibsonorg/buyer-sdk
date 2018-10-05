import winston from 'winston';
import SlackTransport from 'winston-slack-webhook-transport';
import config from '../../config';

const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
});

if (config.env === 'production') {
  logger.add(new winston.transports.Console());
  logger.add(new winston.transports.File({ filename: config.log.combined }));
  logger.add(new winston.transports.File({ filename: config.log.error, level: 'error' }));
  logger.add(new SlackTransport({ level: 'crit', webhookUrl: config.log.slack }));
} else if (config.env === 'development') {
  logger.add(new winston.transports.Console({ format: winston.format.simple(), level: 'debug' }));
} else {
  logger.add(new winston.transports.Console({ silent: true }));
}

module.exports = logger;
module.exports.stream = {
  write(message) {
    logger.info(message);
  },
};
