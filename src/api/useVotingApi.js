import useAxios from "../hooks/useAxios";

const useVotingApi = () => {
    const axios = useAxios();

    const votingApi = {};
    votingApi.getListVoting = (slideId) => axios.get(`/api/v1/vote/load-voting-list/${slideId}`);
    return votingApi;
}

export default useVotingApi;