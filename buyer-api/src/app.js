import express from 'express';
import boom from 'express-boom';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import swagger from 'swagger-tools';
import cookieParser from 'cookie-parser';
import config from '../config';
import schema from './schema';
import { logger, errorHandler } from './utils';
import {
  auth,
  account,
  health,
  notaries,
  dataOrders,
  buyerInfos,
  notarizationResult,
  batchDataResponse,
} from './routes';
import checkAuthorization from './utils/checkAuthorization';

const app = express();
swagger.initializeMiddleware(schema, ({ swaggerMetadata, swaggerValidator, swaggerUi }) => {
  app.use(swaggerMetadata());
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
  app.use(swaggerValidator());
  // eslint-disable-next-line no-unused-vars
  app.use((error, req, res, next) => { throw error; });

  app.use('/authentication', auth);
  app.use('/health', health);
  app.get('/api-docs', swaggerUi());
  app.get('/api-docs.json', (_, res) => res.json(schema));
  app.use('/orders', dataOrders);
  app.use('/notarization-result', notarizationResult);
  app.use('/batch-data-responses', batchDataResponse);
  // This middleware MUST always go after of authentication or fail
  app.use(checkAuthorization);
  app.use('/account', account);
  app.use('/notaries', notaries);
  app.use('/infos', buyerInfos);

  app.use(errorHandler); // This MUST always go after any other app.use(...)
});

module.exports = app;
