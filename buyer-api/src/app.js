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
} from './utils';

import { account, health, notaries, dataOrders, dataResponses, buyerInfos } from './routes';

const app = express();
app.locals.stores = {
  redis: createRedisStore('sample'),
  level: createLevelStore(`${config.levelDirectory}/sample_level`),
  ordersCache: createRedisStore('orders.cache'),
  notariesCache: createRedisStore('notaries.cache'),
  buyerInfos: createLevelStore(`${config.levelDirectory}/buyer_infos`),
  buyerInfoPerOrder: createLevelStore(`${config.levelDirectory}/buyer_info_per_order`),
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
app.use('/data-responses', dataResponses);
app.use('/infos', buyerInfos);
app.use('/orders', dataOrders);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(schema));
app.get('/api-docs.json', (_req, res) => res.json(schema));

app.use(errorHandler); // This MUST always go after any other app.use(...)

module.exports = app;
