/**
 * @swagger
 * securityDefinitions:
 *   ApiKeyAuth:
 *     type: apiKey
 *     in: header
 *     name: X-API-Key
 */

import account from './account';
import buyerInfo from './buyerInfo';
import health from './health';
import notaries from './notaries';
import dataOrders from './dataOrders';

export { account, buyerInfo, health, notaries, dataOrders };
