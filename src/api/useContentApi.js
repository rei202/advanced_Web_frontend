import useAxios from "../hooks/useAxios";

const UseContentApi = () => {
    const axios = useAxios();

    const slideApiObj = {};
    slideApiObj.getContentDetail = (contentId) => axios.get(`/api/v1/slide-type/${contentId}`);
    slideApiObj.createMultipleChoiceOption = (reqBody) =>  axios.post('/api/v1/slide-type/create-multiple-choice', reqBody);
    slideApiObj.deleteOption = (reqBody) => axios.post('/api/v1/slide-type/delete-multiple-choice', reqBody);
    slideApiObj.editTitleSlide = (reqBody) => axios.post('/api/v1/slide-type/edit', reqBody);

    return slideApiObj;
}

export default UseContentApi;