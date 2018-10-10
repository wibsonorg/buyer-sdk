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
} from './utils';
import {
  createDataOrderQueue,
  createDataResponseQueue,
  fundingQueue,
} from './queues';
import {
  account,
  health,
  notaries,
  dataOrders,
  dataResponses,
  buyerInfos,
} from './routes';

const app = express();

app.locals.stores = {
  ordersCache: createRedisStore('orders.cache'),
  batchesCache: createRedisStore('batches.cache'),
  notariesCache: createRedisStore('notaries.cache'),
};

app.locals.queues = {
  dataOrder: createDataOrderQueue(app.locals.stores),
  dataResponse: createDataResponseQueue(app.locals.stores),
  funding: fundingQueue,
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
