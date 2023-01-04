import useAxios from "../hooks/useAxios";

const usePresentationApi = () => {
    const axios = useAxios();

    const presentingApi = {};
    presentingApi.presentForGroup = (reqBody) => axios.post('/api/v1/presenting/present-for-group', reqBody);
    presentingApi.getPresentingData = (presentingId) => axios.get(`/api/v1/presenting/${presentingId}`);
    presentingApi.stopPresentingData = (reqBody) => axios.post(`/api/v1/presenting/stop-present-for-group`, reqBody)
    presentingApi.moveToAnotherSlide = (reqBody) => axios.post(`/api/v1/presenting/move-to-slide`, reqBody);
    presentingApi.getPresentingGroup = (groupId) => axios.get(`/api/v1/presenting/presenting-group/${groupId}`)

    return presentingApi;
}

export default usePresentationApi;