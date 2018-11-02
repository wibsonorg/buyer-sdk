import express from 'express';
import boom from 'express-boom';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import config from '../config';
import schema from './schema';
import {
  logger,
  errorHandler,
  createRedisStore,
  createLevelStore,
} from './utils';
import {
  dataOrderQueue,
  dataResponseQueue,
} from './queues';
import {
  auth,
  account,
  health,
  notaries,
  dataOrders,
  dataResponses,
  buyerInfos,
} from './routes';
import checkAuthorization from './utils/checkAuthorization';

const app = express();
app.locals.stores = {
  redis: createRedisStore('sample'),
  level: createLevelStore('sample_level'),
  ordersCache: createRedisStore('orders.cache'),
  undead: createRedisStore('undead::'),
};

app.locals.queues = {
  dataOrder: dataOrderQueue,
  dataResponse: dataResponseQueue,
};

app.use(helmet());
app.use(bodyParser.json());
app.use(morgan(config.logType || 'combined', {
  stream: logger.stream,
  skip: () => config.env === 'test',
}));
app.use(cors());
app.use(boom());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(cookieParser());

app.use('/authentication', auth);
app.use('/health', health);
app.use('/data-responses', dataResponses);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(schema));
app.get('/api-docs.json', (_req, res) => res.json(schema));
app.use('/orders', dataOrders);
// This middleware MUST always go after of authentication or fail
app.use(checkAuthorization);
app.use('/account', account);
app.use('/notaries', notaries);
app.use('/infos', buyerInfos);

app.use(errorHandler); // This MUST always go after any other app.use(...)

module.exports = app;
