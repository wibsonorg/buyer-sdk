import swaggerJSDoc from 'swagger-jsdoc';
import glob from 'glob';

const ls = dir => glob.sync(dir);

const schema = swaggerJSDoc({
  swaggerDefinition: {
    info: {
      title: 'Buyer Signing Service',
      version: '1.0.0',
    },
  },
  apis: ls(`${__dirname}/routes/**/*.js`),
});

export default schema;
