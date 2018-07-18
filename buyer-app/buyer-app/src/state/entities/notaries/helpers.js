import Config from "../../../config";

const apiUrl = Config.get("api.url");

const getNotariesFromContract = async () => {
  const res = await fetch(`${apiUrl}/notaries`);

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
