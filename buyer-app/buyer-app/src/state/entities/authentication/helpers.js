import Config from "../../../config";
import authorization from "../../../utils/headers"

const apiUrl = Config.get("api.url");

async function loginUser(data) {
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

async function veriToken() {
  const res = await fetch(`${apiUrl}/authentication/verify-token`, {
    headers: {
      Authorization: authorization()
    }
  });
  if (!res.ok) {
    return res.json()
  }
  return
};

export { loginUser, veriToken };
