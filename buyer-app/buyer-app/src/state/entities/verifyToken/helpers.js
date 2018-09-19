import Config from "../../../config";
import authorization from "../../../utils/headers"

const apiUrl = Config.get("api.url");

async function veriToken() {
  const res = await fetch(`${apiUrl}/verifyToken`, {
    headers: {
      Authorization: authorization()
    }
  });
  if (!res.ok) {
    throw new Error("failed authentication");
  }

  return res.json();
};

export { veriToken };
