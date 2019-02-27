import '@babel/polyfill';
import loadEnv from './utils/wibson-lib/loadEnv';

const init = async () => {
  await loadEnv();
  // eslint-disable-next-line global-require
  const server = require('./server').default;
  server();
};

init();
