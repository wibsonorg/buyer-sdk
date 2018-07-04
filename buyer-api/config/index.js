require('dotenv').config();

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  buyerSigningServiceUrl: process.env.BUYER_SIGNING_SERVICE_URL,
  log: {
    error: process.env.ERROR_LOG,
    combined: process.env.COMBINED_LOG,
  },
};
