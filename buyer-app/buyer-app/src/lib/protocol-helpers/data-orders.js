import Config from "../../config";

const apiUrl = Config.get("api.url");

/**
 * TODO: Implement pagination
 * @return {[type]} [description]
 */
async function listBuyerDataOrders(limit, offset) {
  const res = await fetch(`${apiUrl}/orders?limit=${limit}&offset=${offset}`);

  if (!res.ok) {
    throw new Error("Could get data orders");
  }

  const orders = await res.json();

  return orders;
}

async function createBuyerDataOrder(
  filters,
  dataRequest,
  buyerURL,
  termsAndConditions,
  price,
  initialBudgetForAudits
) {
  const res = await fetch(
    `${apiUrl}/orders`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        dataOrder: {
          filters,
          dataRequest,
          buyerURL,
          termsAndConditions,
          price,
          initialBudgetForAudits
        }
      })
    }
  );

  if (!res.ok) {
    throw new Error("Could create data order");
  }

  return res.json();
}

const associateBuyerInfoToOrder = async (orderAddress, buyerInfoId) => {
  const res = await fetch(
    `${apiUrl}/orders/${orderAddress}/info`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ buyerInfoId })
    }
  );
  if (!res.ok) {
    throw new Error("Could associate the buyer info ID");
  }
  return res.json();
}

const addNotariesToOrder = async (orderAddress, notaries) => {
  return true;
};

export { listBuyerDataOrders, createBuyerDataOrder, associateBuyerInfoToOrder, addNotariesToOrder };
