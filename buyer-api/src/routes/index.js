/**
 * @swagger
 * securityDefinitions:
 *   ApiKeyAuth:
 *     type: apiKey
 *     in: header
 *     name: X-API-Key
 */

import auth from './auth';
import account from './account';
import buyerInfos from './buyerInfos';
import health from './health';
import notaries from './notaries';
import dataOrders from './dataOrders';
import dataResponses from './dataResponses';

export { auth, account, buyerInfos, health, notaries, dataOrders, dataResponses };

