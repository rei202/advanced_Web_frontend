import axios from 'axios';
import {ROOT_URL} from "../constant/common.const";

export default axios.create({
    baseURL : `${ROOT_URL}`,
    headers: { 'Content-Type': 'application/json' },
});
