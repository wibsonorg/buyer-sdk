import Config from '../../config';
import authorization from '../../utils/headers';

const apiUrl = Config.get('api.url');

/**
 * TODO: Implement pagination
 * @return {[type]} [description]
 */
async function listBuyerDataOrders() {
  const res = await fetch(`${apiUrl}/orders`,
  {
    headers: {
      Authorization: authorization()
    }
  });
  if (!res.ok) {
    throw new Error('Could not get data orders');
  }

  const orders = await res.json();

  return {orders};
}

async function getBuyerInfos(){
  const res = await fetch(`${apiUrl}/infos`, {
    headers: { Authorization: authorization() }
  });
  return await res.json();
}

async function getBuyerDataOrdersAmount() {
  const res = await fetch(`${apiUrl}/orders/total`,
  {
    headers: {
      Authorization: authorization()
    }
  });
  if (!res.ok) {
    throw new Error('Could not get data orders');
  }

  const ordersAmount = await res.json();

  return ordersAmount;
}

async function createBuyerDataOrder(
  audience,
  requestedData,
  buyerUrl,
  price,
  notariesAddresses,
  buyerInfoId,
) {
  const res = await fetch(`${apiUrl}/orders`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: authorization()
    },
    method: 'POST',
    body: JSON.stringify({
      audience,
      price,
      requestedData,
      buyerInfoId,
      buyerUrl,
      notariesAddresses,
    }),
  });

  if (!res.ok) {
    throw new Error('Could create data order');
  }

  return res.json();
}

const addNotariesToOrder = async (orderAddress, notariesAddresses) => {
  const res = await fetch(`${apiUrl}/orders/${orderAddress}/notaries`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: authorization()
    },
    method: 'POST',
    body: JSON.stringify({ notariesAddresses }),
  });
  if (!res.ok) {
    throw new Error('Could not add notaries to order');
  }
  return res.json();
};

const closeOrder = async orderAddress => {
  const res = await fetch(`${apiUrl}/orders/${orderAddress}/end`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: authorization()
    },
    method: 'POST',
  });
  if (!res.ok) {
    throw new Error('Could close data order');
  }
  return res.json();
};

export {
  listBuyerDataOrders,
  createBuyerDataOrder,
  getBuyerDataOrdersAmount,
  addNotariesToOrder,
  closeOrder,
  getBuyerInfos,
};
