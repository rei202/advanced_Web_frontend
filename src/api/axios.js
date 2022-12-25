import axios from 'axios';
import {BACKEND_URL, ROOT_URL} from "../constant/common.const";

export default axios.create({
    baseURL : `${BACKEND_URL}`,
    headers: { 'Content-Type': 'application/json' },
});
