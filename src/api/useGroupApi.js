import useAxios from '../hooks/useAxios';
const useGroupApi = () => {
    const axios = useAxios();
    const groupApiObj = {};

    groupApiObj.deleteGroup = (reqBody) => axios.post('/api/group/delete-group', reqBody);
    groupApiObj.getMyGroup = () => axios.get('/api/group/1');
    groupApiObj.checkUserInGroup = (username, groupId) => axios.get(`/api/group/check-user-group/${username}/${groupId}`);

    return groupApiObj;
};
export default useGroupApi;
