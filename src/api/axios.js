import axios from 'axios';
import {ROOT_URL} from "../constant/common.const";

export default axios.create({
    // baseURL: 'https://advancedwebbackend-production-1b23.up.railway.app/',
    baseURL : `${ROOT_URL}`,
    headers: { 'Content-Type': 'application/json' },
});
