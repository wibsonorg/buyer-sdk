import express from 'express';
import boom from 'express-boom';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import config from '../config';
import {
  logger,
  errorHandler,
  createRedisStore,
  createLevelStore,
  wibcoin,
  dataExchange,
  DataOrderContract,
} from './utils';

import { account, health, notaries } from './routes';

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

app.use(errorHandler); // This MUST always go after any other app.use(...)

module.exports = app;
