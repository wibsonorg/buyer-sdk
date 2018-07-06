/* eslint-disable */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
require('dotenv').config();

var _process = process,
    env = _process.env;


var config = {
  env: env.NODE_ENV,
  port: env.PORT,
  host: env.HOST,
  logType: env.LOG_TYPE,
  log: {
    error: env.ERROR_LOG,
    combined: env.COMBINED_LOG
  },
};

exports.default = config;
