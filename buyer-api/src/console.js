const repl = require('repl');
const { loadEnv } = require('./utils/wibson-lib');

loadEnv();

const context = repl.start('bapi(1.0.0)> ').context; //eslint-disable-line
context.hello = 'hello';
