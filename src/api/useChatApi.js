import useAxios from "../hooks/useAxios"

const useChatApi = () => {
    const axios = useAxios()
    const chatApi = {}
    chatApi.sendMessage = (preSessionId, reqBody) => { axios.post(`api/v1/chat/send-message/${preSessionId}`, reqBody) }
    return chatApi
}

export default useChatApi