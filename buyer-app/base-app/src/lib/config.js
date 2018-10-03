import defaultConf from "../configuration/default.json";

import devConf from "../configuration/development.json";
import productionConf from "../configuration/production.json";
import stagingConf from "../configuration/staging.json";

let baseConf = {};

if (process.env.DEPLOY_ENVIRONMENT === "development") {
  baseConf = { ...defaultConf, ...devConf };
} else if (process.env.DEPLOY_ENVIRONMENT === "staging") {
  baseConf = { ...defaultConf, ...stagingConf };
} else if (process.env.DEPLOY_ENVIRONMENT === "production") {
  baseConf = { ...defaultConf, ...productionConf };
} else if (!process.env.DEPLOY_ENVIRONMENT) {
  console.error("DEPLOY_ENVIRONMENT is not set")
}

/**
 * Merges base config (based on environment) with new config
 */
class Config {
  /**
   * Constructor. 
   * @param  {Object} newConfig show be set according to environment.
   * @return {[type]}           [description]
   */
  constructor(newConfig = {}) {
    this.config = Object.assign({}, baseConf, newConfig);
  }

  get(conf) {
    if (this.has(conf)) {
      return this.config[conf];
    }
    return undefined;
  }

  has(conf) {
    const { config } = this;
    if (typeof config[conf] !== "undefined" && config[conf] !== null) {
      return true;
    }
    return false;
  }
}

// const config = new Config(newConfig);

export default Config;
