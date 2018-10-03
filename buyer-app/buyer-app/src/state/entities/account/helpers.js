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
    return res.json();
  }

  return await res.json();
};

export { getAccount };
