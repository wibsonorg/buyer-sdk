# Wibson Buyer Signing Service

## Test

To run the test suite with coverage:

```
$ npm run test:coverage
```

The following files where excluded from the coverage report (see `package.json` `nyc` config):

* src/utils/logger.js: It holds winston configuration
