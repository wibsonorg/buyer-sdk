/**
 * @swagger
 * securityDefinitions:
 *   ApiKeyAuth:
 *     type: apiKey
 *     in: header
 *     name: X-API-Key
 */

import account from './account';
import buyerInfos from './buyerInfos';
import health from './health';
import notaries from './notaries';
import * as dataOrders from './dataOrders';
import dataResponses from './dataResponses';

export { account, buyerInfos, health, notaries, dataOrders, dataResponses };
