import Cookies from 'universal-cookie';

const cookies = new Cookies();

const removeCookie = (name) => (cookies.remove(name))

export default removeCookie;