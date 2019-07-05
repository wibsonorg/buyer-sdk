import Config from "../../../config";
import authorization from "../../../utils/headers";

const apiUrl = Config.get("api.url");

const getData = async orderId => {
  const res = await fetch(`${apiUrl}/orders/${orderId}/data`, {
    headers: {
      Authorization: authorization()
    }
  });

  return res.ok ? res.text() : res.json();
};

export { getData };
