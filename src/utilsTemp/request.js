import axios from 'axios';
const request = axios.create({
    // baseURL: 'http://localhost:8080/api/v1/'
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    },
});

export const get = async (path, option = '') => {
    console.log(option);
    let response = null;
    const req = axios.create({
        baseURL: 'http://localhost:8080/api/v1',
        headers: {
            Authorization: 'Bearer ' + option,
        },
    });
    if (option !== '') {
        response = await req.get(path, {});
    } else {
        response = await request.get(path, {});
    }
    return response.data;
};

export const getAudio = async (path) => {
    let response = null;
    const req = axios.create({
        baseURL: 'http://localhost:8080/api/v1',
    });

    response = await req.get(path, {});

    return response;
};

export const post = async (path, data) => {
    const response = await request.post(path, data);

    return response;
};

export const dele = async (path) => {
    return await request.delete(path);
};

export const multiDelete = async (path, data) => {
    return await request.delete(path, data);
};

export const put = (path, data) => {
    const response = request.put(path, data);
};

export default request;
