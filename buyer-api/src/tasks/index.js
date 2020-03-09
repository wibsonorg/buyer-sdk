/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import '@babel/polyfill';
import glob from 'glob';
import path from 'path';
import loadEnv from '../utils/wibson-lib/loadEnv';

const taskPathReplacer = new RegExp(`^${__dirname}${path.sep}(.*)\\.js$`);
const taskSepReplacer = new RegExp(`\\${path.sep}`, 'g');
const getTasksList = () => glob
  .sync(`${__dirname}/**/*.js`, { ignore: '**/index.js' })
  .map(p => p
    .replace(taskPathReplacer, '$1')
    .replace(taskSepReplacer, ':'));

function tryRequire(modulePath) {
  try {
    return require(modulePath);
  } catch (_) {
    return {};
  }
}

async function execTask() {
  let logger;
  try {
    await loadEnv();
    logger = require('../utils/logger');
    const [taskPath, ...args] = process.argv.slice(2);
    if (!taskPath) {
      logger.info(`Available tasks:\n${getTasksList().join('\n')}`);
      return;
    }
    const taskDir = taskPath.split(':');
    taskDir.unshift('.');
    const taskName = taskDir.pop();
    const modulePath = taskDir.join(path.sep);
    const task =
      tryRequire(modulePath + path.sep + taskName).default ||
      tryRequire(modulePath)[taskName];
    if (!task) {
      logger.info(`Task '${taskPath}' does not exist.`);
      return;
    }
    logger.info(`Running task ${taskPath}...`);
    await task(...args);
    logger.info('Done');
  } catch (error) {
    if (logger && logger.error) {
      logger.error(error);
    } else {
      console.error(error); // eslint-disable-line no-console
    }
  }
}

execTask().finally(() => process.exit());
