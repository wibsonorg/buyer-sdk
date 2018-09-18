import Config from "../../../config";

const apiUrl = Config.get("api.url");

const getAccount = async () => {
  const res = await fetch(`${apiUrl}/account`, { method: 'GET',
  credentials: 'include' });

  if (!res.ok) {
    throw new Error("Could get data orders");
  }

  return await res.json();
};

export { getAccount };
