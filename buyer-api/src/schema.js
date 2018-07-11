import fs from 'fs';
import swaggerJSDoc from 'swagger-jsdoc';

const ls = dir =>
  fs.readdirSync(dir)
    .reduce((accumulator, file) => [...accumulator, `${dir}/${file}`], []);

const schema = swaggerJSDoc({
  swaggerDefinition: {
    info: {
      title: 'Buyer API',
      version: '1.0.0',
    },
  },
  apis: ls(`${__dirname}/routes`),
});

export default schema;
