import axios from 'axios';

export default axios.create({
    baseURL: 'https://advancedwebbackend-production-1b23.up.railway.app/',
    headers: { 'Content-Type': 'application/json' },
});
