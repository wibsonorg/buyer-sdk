import Cookies from 'universal-cookie';

const cookies = new Cookies();
const getCookie = (name) => (cookies.get(name));
const setCookie = (key, value, {options}) => (cookies.set(key, value, options));
const removeCookie = (name) => (cookies.remove(name));

export { getCookie, setCookie, removeCookie }
