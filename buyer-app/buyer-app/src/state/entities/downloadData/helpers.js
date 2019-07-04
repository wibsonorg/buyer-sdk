import Config from "../../../config";
import authorization from "../../../utils/headers";

const apiUrl = Config.get("api.url");

const getData = async orderId => {
  const res = await fetch(`${apiUrl}/download-data/${orderId}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: authorization()
    },
    method: "POST"
  });

  if (!res.ok) {
    throw new Error("Could not get data");
  }

  return res.json();
};

export { getData };
