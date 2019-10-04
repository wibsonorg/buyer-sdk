/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import '@babel/polyfill';
import glob from 'glob';
import loadEnv from '../utils/wibson-lib/loadEnv';

const getTaskName = (path, captureName) => path.replace(captureName, '$1').replace(/\//g, ':');

const getPathTasks = (path, captureName) => {
  const tasks = require(path).default;
  if (typeof tasks === 'object') {
    return tasks;
  }
  return {
    [getTaskName(path, captureName)]: tasks,
  };
};

const getTasks = () => {
  const paths = glob.sync(`${__dirname}/**/*.js`, { ignore: `${__dirname}/index.js` });
  const captureName = new RegExp(`${__dirname}/(.*).js`);

  return paths.reduce(
    (accumulator, path) => ({
      ...accumulator,
      ...getPathTasks(path, captureName),
    }),
    {},
  );
};

const init = async () => {
  let logger;
  try {
    await loadEnv();
    logger = require('../utils/logger');
    const tasks = getTasks();
    const [taskName, ...args] = process.argv.slice(2);
    const task = tasks[taskName];

    if (task) {
      logger.info(`Running task ${taskName}`);
      await task(...args);
      logger.info('Done');
    } else if (!taskName) {
      logger.info(`Available tasks:\n${Object.keys(tasks).join('\n')}`);
    } else {
      logger.info(`Task '${taskName}' does not exist.`);
    }
  } catch (error) {
    if (logger && logger.error) {
      logger.error(error);
    } else {
      console.error(error); // eslint-disable-line no-console
    }
  }

  process.exit();
};

init();
