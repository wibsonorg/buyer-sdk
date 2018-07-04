require('dotenv').config();

const { env } = process;

export default {
  env: env.NODE_ENV,
  port: env.PORT,
  host: env.HOST,
};
