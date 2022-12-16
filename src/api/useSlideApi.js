import useAxios from "../hooks/useAxios";

const useSlideApi = () => {
    const axios = useAxios();
    const getListSlide = (preId) => axios.get(`/api/v1/slide/${preId}`);
    const getSlideDetail = (slideId) => axios.get(`/api/v1/slide/detail/${slideId}`);
    const addNewSlide = (reqBody) => axios.post('/api/v1/slide/add', reqBody);
    const deleteSlide = (reqBody) =>  axios.post('/api/v1/slide/delete', reqBody);

    const slideApiObj = {};
    slideApiObj.getListSlide = getListSlide;
    slideApiObj.getSlideDetail = getSlideDetail;
    slideApiObj.addNewSlide = addNewSlide;
    slideApiObj.deleteSlide = deleteSlide;

    return slideApiObj;
}

export default useSlideApi;