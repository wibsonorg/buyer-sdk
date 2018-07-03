const env = process.env.NODE_ENV;
const validEnvs = ['test', 'dev', 'prod'];

if (!validEnvs.includes(env)) { throw new Error(`Invalid environment: ${env}`); }

const defConf = require('./default.json');

const envConf = require(`./${env}.json`);

const config = { env, ...defConf, ...envConf };

export default config;