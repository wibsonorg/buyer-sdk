/**
 * @swagger
 * securityDefinitions:
 *   ApiKeyAuth:
 *     type: apiKey
 *     in: header
 *     name: X-API-Key
 */

import health from './health';

export { health }; // eslint-disable-line import/prefer-default-export
