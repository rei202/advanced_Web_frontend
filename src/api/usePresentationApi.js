import useAxios from "../hooks/useAxios";

const usePresentationApi = () => {
    const axios = useAxios();

    const presentationApiObj = {};
    presentationApiObj.getListPresentation = () => axios.get('/api/v1/presentation');
    presentationApiObj.addNewPresentation = (reqBody) =>  axios.post('/api/v1/presentation/add', reqBody);
    presentationApiObj.editPresentation = (presentationId, reqBody) => axios.post(`/api/v1/presentation/edit/${presentationId}`, reqBody);
    presentationApiObj.deletePresentation = (reqBody) => axios.post('/api/v1/presentation/delete', reqBody);

    return presentationApiObj;
}

export default usePresentationApi;