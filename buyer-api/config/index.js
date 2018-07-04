require('dotenv').config();

const { env } = process;

export default {
  env: env.NODE_ENV,
  port: env.PORT,
  host: env.HOST,
  buyerSigningServiceUrl: env.BUYER_SIGNING_SERVICE_URL,
  log: {
    error: env.ERROR_LOG,
    combined: env.COMBINED_LOG,
  },
};
