import Config from "../../config";

const apiUrl = Config.get("api.url");

/**
 * TODO: Implement pagination
 * @return {[type]} [description]
 */
async function listBuyerDataOrders(limit, offset) {

  const res = await fetch(
    `${apiUrl}/api/exchange/buyer/${currentAccount}/orders?limit=${limit}&offset=${offset}`
  );

  if (!res.ok) {
    throw new Error("Could get data orders");
  }

  const orders = await res.json();

  return orders;
}

async function createBuyerDataOrder(
  audience,
  requestedData,
  notarizeData,
  notaries,
  publicURL,
  conditions,
  maxPrice,
  buyerId
) {
  const res = await fetch(
    `${apiUrl}/api/exchange/buyer/${currentAccount}/orders/create`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        audience,
        requestedData,
        notaries,
        publicURL,
        conditions,
        maxPrice,
        buyerId
      })
    }
  );

  if (!res.ok) {
    throw new Error("Could create data order");
  }

  const orders = await res.json();

  return orders;
}

export { listBuyerDataOrders, createBuyerDataOrder };
