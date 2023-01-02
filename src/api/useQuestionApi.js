import useAxios from '../hooks/useAxios';

const useQuestionApi = () => {
    const axios = useAxios();
    const questionApi = {};
    questionApi.postQuestion = (preSessionId, reqBody) => axios.post(`api/v1/question/create-question/${preSessionId}`, reqBody);
    questionApi.loadOldQuesiton = (preSessionId) => axios.get(`api/v1/question/load-old-question/${preSessionId}`);
    questionApi.upVote =  (preSessionId, questionId) => axios.post(`api/v1/question/upvote-question/${preSessionId}/${questionId}`);
    questionApi.answerQuestion = (preSessionId, questionId) => axios.post(`api/v1/question/answer-question/${preSessionId}/${questionId}`);

    return questionApi;
};

export default useQuestionApi;
