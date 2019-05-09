import { lookup } from 'geoip-lite';
import config from '../../config';
import logger from '../utils/logger';

const getUserIp = req =>
  (req.headers['X-Forwarded-For'] || req.headers['x-forwarded-for'] || '').split(',')[0] ||
  req.connection.remoteAddress ||
  req.socket.remoteAddress ||
  (req.connection.socket ? req.connection.socket.remoteAddress : null);

function getCountryByIp(ip) {
  const infoGeoIp = lookup(ip);
  return infoGeoIp && infoGeoIp.country;
}

function restrictCountryByIp(req, res, next) {
  if (config.env === 'development') {
    return next();
  }
  const userIp = getUserIp(req);

  const infoGeoIp = lookup(userIp);
  if (infoGeoIp) {
    const { country, city } = infoGeoIp;

    const allowedCountries = config.allowedCountries ? JSON.parse(config.allowedCountries) : [];
    if (allowedCountries.includes(country)) {
      return next();
    }
    logger.error(`IP ${userIp} from ${city}, ${country} is not allowed`);
  } else {
    logger.error(`Unknown location for IP ${userIp}. Headers are: ${JSON.stringify(req.headers)}`);
  }
  return res.boom.forbidden('IP Address and Domain Name restrictions');
}

export { restrictCountryByIp, getCountryByIp, getUserIp };
