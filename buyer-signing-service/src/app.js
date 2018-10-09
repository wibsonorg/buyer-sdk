import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import boom from 'express-boom';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import config from '../config';
import logger from './utils/logger';
import schema from './schema';
import { data, health, accounts, sign } from './routes';
import { errorHandler, fourOhFourHandler } from './middlewares';
import { dataExchange, wibcoin } from './contracts';

const app = express();
app.locals.contracts = {
  wibcoin,
  token: wibcoin,
  dataExchange,
};

app.use(helmet());
app.use(bodyParser.json());
app.use(morgan(config.logType || 'combined', {
  stream: logger.stream,
  skip: () => config.env === 'test',
}));
app.use(cors());
app.use(boom());

app.use('/health', health);
app.use('/data', data);
app.use('/accounts', accounts);
app.use('/sign', sign);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(schema));
app.get('/api-docs.json', (_req, res) => res.json(schema));

// This MUST always go at the end.
app.use(fourOhFourHandler);
app.use(errorHandler);

export default app;
