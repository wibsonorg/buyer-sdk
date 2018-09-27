const fetchToken = (request) => {
  const authorizationInHeaders = request && request.headers && request.headers.authorization;
  const authorizationInCookies = request && request.cookies;
  const token = authorizationInHeaders ? authorizationInHeaders.replace('Bearer ', '') : authorizationInCookies && authorizationInCookies.accessJwt;
  return token;
};

export default fetchToken;

