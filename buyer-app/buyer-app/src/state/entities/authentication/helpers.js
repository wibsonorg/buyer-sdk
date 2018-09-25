import Config from "../../../config";
import authorization from "../../../utils/headers"

const apiUrl = Config.get("api.url");

async function logInUser(data) {
  const res = await fetch(`${apiUrl}/authentication`, {
    method: 'POST',
    headers:{
      "Content-Type": "application/json",
      'Accept': 'application/json',
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    return res.json();
  }

  return res.json();
};

async function verifyToken() {
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

export { logInUser, verifyToken };
