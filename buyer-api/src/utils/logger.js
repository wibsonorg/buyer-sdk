import SlackTransport from 'winston-slack-webhook-transport';
import winston from 'winston';
import config from '../../config';

const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
});
const buildFormatter = () =>
  winston.format.combine(
    winston.format.simple(),
    winston.format.timestamp(),
    winston.format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`),
  );
function addSlack() {
  logger.add(new SlackTransport({
    level: 'crit',
    webhookUrl: config.log.slack,
    formatter({ message }) {
      const { env, app: { name, version, repositoryUrl } } = config;
      return {
        attachments: [{
          text: message,
          color: 'danger',
          fields: [
            { short: true, title: 'App', value: name },
            {
              short: true,
              title: 'Version',
              value: `<${repositoryUrl}/tree/v${version}|${version}>`,
            },
            { short: true, title: 'Environment', value: env },
          ],
        }],
      };
    },
  }));
}

switch (config.env) {
  case 'production':
    logger.add(new winston.transports.Console({ handleExceptions: true }));
    logger.add(new winston.transports.File({
      filename: config.log.combined,
      handleExceptions: true,
      format: buildFormatter(),
    }));
    logger.add(new winston.transports.File({
      filename: config.log.error,
      handleExceptions: true,
      level: 'error',
      format: buildFormatter(),
    }));
    addSlack();
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
    addSlack();
    break;
  case 'test':
  default:
    logger.add(new winston.transports.Console({ silent: true }));
    break;
}

export const stream = {
  write(message) {
    logger.info(message);
  },
};

export default logger;
