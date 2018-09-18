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
  createDataOrderQueue,
  createDataResponseQueue,
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
  level: createLevelStore(`${config.levelDirectory}/sample_level`),
  ordersCache: createRedisStore('orders.cache'),
  notariesCache: createRedisStore('notaries.cache'),
};

app.locals.queues = {
  dataOrder: createDataOrderQueue(app.locals.stores),
  dataResponse: createDataResponseQueue(app.locals.stores),
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
/* If you want to allow credentials then your Access-Control-Allow-Origin must not use *. 
  You will have to specify the exact protocol + domain + port */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, X-Prototype-Version, Origin, Allow, *');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,HEAD');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Max-Age', 1728000);
  next();
});

app.use('/authentication', auth);
app.use('/account', account);
app.use('/health', health);
app.use('/notaries', notaries);
app.use('/data-responses', dataResponses);
app.use('/infos', buyerInfos);
app.use('/orders', dataOrders);
app.use('/api-docs', checkAuthorization, swaggerUi.serve, swaggerUi.setup(schema));
app.get('/api-docs.json', checkAuthorization, (_req, res) => res.json(schema));

app.use(errorHandler); // This MUST always go after any other app.use(...)

module.exports = app;
