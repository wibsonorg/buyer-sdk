import {getCookie} from "../cookies"

const authorization = () => (`Bearer ${getCookie('token')}`);

export default authorization;