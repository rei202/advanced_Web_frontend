import useAxios from "../hooks/useAxios";

const UseAccountApi = () => {
    const axios = useAxios();
    const accountApiObj = {};
    accountApiObj.forgotPassword = (reqBody) =>  axios.post('/auth/forgot-password-event', reqBody);
    accountApiObj.resetPassword = (reqBody) =>  axios.post('/auth/reset-password', reqBody);
    return accountApiObj;
}

export default UseAccountApi;