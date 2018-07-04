import app from './app';
import config from '../config';

const { env, port } = config;

app.listen(port, () =>
  console.log(`Buyer SS listening on port ${port} in ${env} mode`));
