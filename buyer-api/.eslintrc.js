module.exports = {
  "extends": "airbnb-base",
  "env": {
    "node": true,
    "jest": true
  },
  "rules": {
    "import/prefer-default-export": false,
    "import/no-extraneous-dependencies": ["error", {
      "devDependencies": [
        "**/*.mock.js", "**/*.fixture.js",
        "test/**/*", "**/*.test.js",
        "e2e/**/*", "**/*.e2e.js"
      ]
    }]
  }
};
