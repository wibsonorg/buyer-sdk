# Wibson Buyer API

## Test

To run the test suite with coverage:

```
$ npm run test:coverage
```

The following files where excluded from the coverage report (see `package.json`'s `nyc` config):

* src/utils/logger.js: It holds winston configuration
* src/utils/storage.js: At the moment it has redis and levelDB clients configuration with no logic
