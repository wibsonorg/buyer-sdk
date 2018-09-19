import Cookies from 'universal-cookie';

const cookies = new Cookies();

const getCookie = (name) => (cookies.get(name))

export default getCookie;