import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from '../config';
import { health } from './routes';

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(morgan(config.env === 'dev' ? 'dev' : 'combined'));
app.use(cors());

app.use('/health', health);

export default app;
