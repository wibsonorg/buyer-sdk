import Config from "base-app-src/lib/config";

import defaultConf from "../../configuration/default.json";

let baseConf;
if (process.env.DEPLOY_ENVIRONMENT === "development") {
  baseConf = { ...defaultConf, ...require("../../configuration/development.json") };
} else if (process.env.DEPLOY_ENVIRONMENT === "staging") {
  baseConf = { ...defaultConf, ...require("../../configuration/staging.json")  };
} else if (process.env.DEPLOY_ENVIRONMENT === "production") {
  baseConf = { ...defaultConf, ...require("../../configuration/production.json")  };
} else if (!process.env.DEPLOY_ENVIRONMENT) {
  console.error("DEPLOY_ENVIRONMENT is not set")
}

const config = new Config(baseConf);
export default config;
