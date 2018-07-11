import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import config from '../config';
import { logger, createRedisStore, createLevelStore } from './utils';
import schema from './schema';

import { health, notaries, dataOrders } from './routes';

const app = express();
// TODO: To be removed
app.locals.stores = {
  redis: createRedisStore('sample'),
  level: createLevelStore('/tmp/sample_level'),
};

app.use(helmet());
app.use(bodyParser.json());
app.use(morgan(config.logType || 'combined', {
  stream: logger.stream,
  skip: () => config.env === 'test',
}));
app.use(cors());

app.use('/health', health);
app.use('/notaries', notaries);
app.use('/data-orders', dataOrders);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(schema));
app.get('/api-docs.json', (_req, res) => res.json(schema));

module.exports = app;
