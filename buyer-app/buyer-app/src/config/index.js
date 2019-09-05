import Config from "base-app-src/lib/config";

import defaultConf from "../../configuration/default.json";

let baseConf;
if (process.env.DEPLOY_ENVIRONMENT === "development") {
  baseConf = { ...defaultConf, ...require("../../configuration/development.json") };
} else if (process.env.DEPLOY_ENVIRONMENT === "staging") {
  baseConf = { ...defaultConf, ...require("../../configuration/staging.json")  };
} else if (process.env.DEPLOY_ENVIRONMENT === "production-bda") {
  baseConf = { ...defaultConf, ...require("../../configuration/production-bda.json")  };
} else if (process.env.DEPLOY_ENVIRONMENT === "production-jampp") {
  baseConf = { ...defaultConf, ...require("../../configuration/production-jampp.json")  };
} else {
  console.error("DEPLOY_ENVIRONMENT not recognized");
}

baseConf.env = process.env.DEPLOY_ENVIRONMENT;

const config = new Config(baseConf);
export default config;
