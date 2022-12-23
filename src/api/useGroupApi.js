import useAxios from '../hooks/useAxios';
const useGroupApi = () => {
    const axios = useAxios();
    const groupApiObj = {};

    groupApiObj.deleteGroup = (reqBody) => axios.post('/api/group/delete-group', reqBody);

    return groupApiObj;
};
export default useGroupApi;
