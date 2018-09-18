import Config from "../../../config";

const apiUrl = Config.get("api.url");

async function fetchAuth(data) {
  const res = await fetch(`${apiUrl}/authentication`, {
    method: 'POST',
    headers:{
      "Content-Type": "application/json",
      'Accept': 'application/json',
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw new Error("failed authentication");
  }

  return res.json();
};

export { fetchAuth };
