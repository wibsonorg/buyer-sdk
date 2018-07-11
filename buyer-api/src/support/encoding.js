import { Buffer } from 'buffer';

export const encodeJSON = (json) => {
  if (!json) return null;

  const jsonStr = JSON.stringify(json);
  return Buffer.from(jsonStr).toString('base64');
};

export const decodeJSON = (encoded) => {
  if (!encoded) return null;

  const jsonStr = Buffer.from(encoded, 'base64').toString();
  return JSON.parse(jsonStr);
};
