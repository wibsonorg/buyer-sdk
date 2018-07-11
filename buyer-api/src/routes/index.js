/**
 * @swagger
 * securityDefinitions:
 *   ApiKeyAuth:
 *     type: apiKey
 *     in: header
 *     name: X-API-Key
 */

import health from './health';
import notaries from './notaries';
import dataOrders from './dataOrders';

export { health, notaries, dataOrders };
