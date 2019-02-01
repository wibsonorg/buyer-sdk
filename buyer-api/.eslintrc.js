module.exports = {
  "extends": "airbnb-base",
  "env": {
    "node": true,
    "jest": true
  },
  "rules": {
    "import/prefer-default-export": false,
    "import/no-extraneous-dependencies": ["error", {"devDependencies": ["**/*.test.js", "**/*.e2e.js"]}]
  }
};
