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
  app.use(boom());
  app.use(swaggerMetadata());
  app.use(helmet());
  app.use(morgan(config.logType || 'combined', {
    stream: logger.stream,
    skip: () => config.env === 'test',
  }));
  app.use(cors());
  app.use(cookieParser());
  app.use(swaggerValidator());
  app.use(swaggerUi({ swaggerUi: '/api-docs', apiDocs: '/api-docs.json' }));
  app.use(bodyParser.json({ limit: config.bodySizeLimit }));
  // eslint-disable-next-line no-unused-vars
  app.use((error, req, res, next) => { throw error; });

  app.use('/authentication', auth);
  app.use('/health', health);
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
