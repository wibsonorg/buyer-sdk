import Config from "../../../config";
import authorization from "../../../utils/headers"
//import axios from 'axios';

const apiUrl = Config.get("api.url");

const getNotariesFromContract = async () => {
  //const res = axios.get(`${apiUrl}/notaries`, {withCredentials: true})
  const res = await fetch(`${apiUrl}/notaries`,
  {
    headers: {
      Authorization: authorization()
    }
  });

  if (!res.ok) {
    throw new Error("Could get data orders");
  }

  const { notaries } = await res.json();

  return notaries.map(notary => ({
    value: notary.notary,
    label: notary.name
  }));
};

export { getNotariesFromContract };
