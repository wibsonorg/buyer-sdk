/**
 * @swagger
 * securityDefinitions:
 *   ApiKeyAuth:
 *     type: apiKey
 *     in: header
 *     name: X-API-Key
 */

import account from './account';
import health from './health';
import notaries from './notaries';

export { account, health, notaries };
