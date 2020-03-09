const repl = require('repl');
const loadEnv = require('./utils/wibson-lib/loadEnv').default;

loadEnv();

repl.start('$> ');
