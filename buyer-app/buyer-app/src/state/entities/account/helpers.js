import Config from "../../../config";
import authorization from "../../../utils/headers"

const apiUrl = Config.get("api.url");

const getAccount = async () => {
  const res = await fetch(`${apiUrl}/account`,
  {
    headers: {
      Authorization: authorization()
    }
  });

  if (!res.ok) {
    throw new Error("Could get data orders");
  }

  return await res.json();
};

export { getAccount };
