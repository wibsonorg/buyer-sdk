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
import { data, health, account, sign } from './routes';
import errorHandler from './middlewares/errorHandler';

const app = express();

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
app.use('/account', account);
app.use('/sign', sign.newOrder);
app.use('/sign', sign.addDataResponse);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(schema));
app.get('/api-docs.json', (_req, res) => res.json(schema));

app.use(errorHandler); // This MUST always go after any other app.use(...)

export default app;
