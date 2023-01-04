import axios from 'axios';
const authRequest = axios.create({
    // baseURL: 'http://localhost:8080/api/v1/'
    baseURL: 'http://localhost:8080/api/v1',
});

export const post = async (path, data) => {
    const response = await authRequest.post(path, data);

    return response;
};

export default authRequest;
