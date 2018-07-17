import express from 'express';
import boom from 'express-boom';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import config from '../config';
import schema from './schema';
import {
  logger,
  errorHandler,
  createRedisStore,
  createLevelStore,
  wibcoin,
  dataExchange,
  DataOrderContract,
} from './utils';

import { account, health, notaries, dataOrders, dataResponses } from './routes';

const app = express();
// TODO: To be removed
app.locals.stores = {
  redis: createRedisStore('sample'),
  level: createLevelStore('/tmp/sample_level'),
};

app.locals.contracts = {
  wibcoin,
  dataExchange,
  DataOrderContract,
};

app.use(helmet());
app.use(bodyParser.json());
app.use(morgan(config.logType || 'combined', {
  stream: logger.stream,
  skip: () => config.env === 'test',
}));
app.use(cors());
app.use(boom());

app.use('/account', account);
app.use('/health', health);
app.use('/notaries', notaries);
app.use('/data-orders', dataOrders);
app.use('/data-responses', dataResponses);

// Documentation
const ls = dir =>
  fs.readdirSync(dir).reduce((accumulator, file) => [...accumulator, `${dir}/${file}`], []);

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition: {
    info: {
      title: 'Buyer API',
      version: '1.0.0',
    },
  },
  apis: ls(`${__dirname}/routes`),
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (_req, res) => res.json(swaggerSpec));
>>>>>>> Buyer API: POST /data_responses endpoint

app.use(errorHandler); // This MUST always go after any other app.use(...)

module.exports = app;
