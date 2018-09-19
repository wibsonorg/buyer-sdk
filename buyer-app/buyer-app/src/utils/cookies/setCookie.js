import Cookies from 'universal-cookie';

const cookies = new Cookies();

const setCookie = (key, value, {options}) => {
    cookies.set(key, value, options);
}

export default setCookie;