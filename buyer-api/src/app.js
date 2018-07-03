import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import config from '../config';
import { health } from './routes';

const ls = dir =>
  fs.readdirSync(dir)
    .reduce((accumulator, file) => [...accumulator, `src/routes/${file}`], []);

const app = express();

app.use(helmet());
app.use(bodyParser.json());
if (config.env !== 'test') {
  app.use(morgan(config.env === 'development' ? 'dev' : 'combined'));
}
app.use(cors());

app.use('/health', health);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc({
  swaggerDefinition: {
    info: {
      title: 'Buyer API',
      version: '1.0.0',
    },
  },
  apis: ls('src/routes'),
})));

export default app;
