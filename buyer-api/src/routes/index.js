/**
 * @swagger
 * securityDefinitions:
 *   ApiKeyAuth:
 *     type: apiKey
 *     in: header
 *     name: X-API-Key
 */

import health from './health';
import dataOrders from './dataOrders';
import notaries from './notaries';

export { health, notaries, dataOrders };
