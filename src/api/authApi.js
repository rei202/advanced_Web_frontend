import * as authRequest from '../utils/authRequest';

export const login = async (data) => {
    try {
        const res = await authRequest.post('/login', data);

        return res;
    } catch (error) {
        console.log(error);
    }
};
