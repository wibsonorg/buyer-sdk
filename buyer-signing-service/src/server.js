import app from './app';
import config from '../config';

const { port, host, env } = config;
app.listen({ port, host }, () =>
  console.log(`Buyer Signing Service listening on port ${port} and host ${host} in ${env} mode`));
