import useAxios from '../hooks/useAxios';

const useNotificationApi = () => {
    const axios = useAxios();
    const notificationApi = {};
    notificationApi.checkPresenting = (groupId) => axios.get(`api/v1/notification/check-presenting/${groupId}`);

    return notificationApi;
};

export default useNotificationApi;