import useAxios from '../hooks/useAxios';

const useChatApi = () => {
    const axios = useAxios();
    const chatApi = {};
    chatApi.sendMessage = (preSessionId, reqBody) => {
        axios.post(`api/v1/chat/send-message/${preSessionId}`, reqBody);
    };
    const loadOldMessage = (preSessionId) => axios.get(`api/v1/chat/load-old-message/${preSessionId}`);

    chatApi.loadOldMessage = loadOldMessage;
    return chatApi;
};

export default useChatApi;
