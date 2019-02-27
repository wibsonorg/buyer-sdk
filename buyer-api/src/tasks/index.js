/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import '@babel/polyfill';
import glob from 'glob';
import loadEnv from '../utils/wibson-lib/loadEnv';

const init = async () => {
  await loadEnv();
  const logger = require('../utils/logger');

  const [taskName, ...args] = process.argv.slice(2);
  const paths = glob.sync(`${__dirname}/*.js`, { ignore: `${__dirname}/index.js` });
  const tasks = paths.reduce((accumulator, path) => ({
    ...accumulator,
    ...require(path).default,
  }), {});

  if (!taskName) {
    logger.info(`Available tasks:\n${Object.keys(tasks).join('\n')}`);
  } else {
    const task = tasks[taskName];
    if (!task) {
      logger.info(`Task does not exist '${taskName}'`);
    } else {
      logger.info(`Running task ${taskName}`);
      await task(...args);
    }
  }

  process.exit();
};

init();
