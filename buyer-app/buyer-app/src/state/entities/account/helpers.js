import Config from "../../../config";
import authorization from "../../../utils/headers";

const apiUrl = Config.get("api.url");

const getAccount = async () => {
  const res = await fetch(`${apiUrl}/account`, {
    headers: {
      Authorization: authorization()
    }
  });

  return res.ok ? res.json() : res;
};

export { getAccount };
