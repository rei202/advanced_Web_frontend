import * as request from '../utils/request';

export const getAll = async (page, token = {}) => {
    try {
        const res = await request.get('/Song/page/' + page, token);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getSong = async (id, token) => {
    try {
        const res = await request.get('/Song/1/' + id, token);
        return res;
    } catch (error) {
        console.log(error);
    }
};
export const postSong = async (data) => {
    try {
        const res = await request.post('/FileUpLoad', data);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const deleteSong = async (id) => {
    try {
        const res = await request.dele('/Song/2/' + id);
    } catch (error) {
        console.log(error);
    }
};

export const multiDeleteSongs = async (data) => {
    try {
        const res = await request.post('/Song/4', data);
    } catch (error) {
        console.log(error);
    }
};

export const updateSong = (data) => {
    try {
        const res = request.put('/Song/3', data);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getAudio = async (id) => {
    try {
        const res = await request.getAudio('/FileUpLoad/files/' + id, {});
        console.log(res);

        return res;
    } catch (error) {
        console.log(error);
    }
};

export const searchSong = async (value, token) => {
    try {
        const res = await request.get('/Song/search?q=' + value, token);
        console.log(res);

        return res;
    } catch (error) {
        console.log(error);
    }
};
