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

import { account, health, notaries, dataOrders } from './routes';

const app = express();
// TODO: To be removed
app.locals.stores = {
  redis: createRedisStore('sample'),
  level: createLevelStore('/tmp/sample_level'),
  buyerInfos: createLevelStore('/tmp/buyer_infos'),
  buyerInfoPerOrder: createLevelStore('/tmp/buyer_info_per_order'),
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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(schema));
app.get('/api-docs.json', (_req, res) => res.json(schema));

app.use(errorHandler); // This MUST always go after any other app.use(...)

module.exports = app;
