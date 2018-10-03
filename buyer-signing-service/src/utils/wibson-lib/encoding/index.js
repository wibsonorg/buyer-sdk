const encodeJSON = (json) => {
  try {
    const jsonStr = JSON.stringify(json);
    return Buffer.from(jsonStr).toString('base64');
  } catch (error) {
    throw new Error('Unable to encode the json');
  }
};

const decodeJSON = (encoded) => {
  if (encoded) {
    const jsonStr = Buffer.from(encoded, 'base64').toString();
    return JSON.parse(jsonStr);
  }
  return undefined;
};

const encodeHashAndSalt = (hash, salt) => {
  const hexSalt = Buffer.from(salt).toString('hex');
  return `${hexSalt}${hash}`;
};

const decodeHashAndSalt = (originalHashAndSalt, saltBytesSize) => {
  const saltHexSize = 2 * saltBytesSize;
  const hexSalt = originalHashAndSalt.slice(0, saltHexSize);
  const hash = originalHashAndSalt.slice(saltHexSize);
  return {
    salt: Buffer.from(hexSalt, 'hex').toString(),
    hash,
  };
};

export { encodeJSON, decodeJSON, encodeHashAndSalt, decodeHashAndSalt };
