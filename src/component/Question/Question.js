import upVote from '../../assets/images/up-arrow.png';
import './question.scss';
import { Button } from 'react-bootstrap';
import useQuestionApi from '../../api/useQuestionApi';
const Question = ({ preId, questionId, username, content, isAnswer, upVoteNum, datetime }) => {
    const questionApi = useQuestionApi();
    const handleAnswerQuestion = () => {
        questionApi.answerQuestion(preId, questionId);
    };
    return (
        <>
            <div>
                <div className='question-main-content answer'>
                    <div className='question-avatar'>
                        <div className='upvote-wapper'>
                            <img src={upVote}></img>
                        </div>
                        <div>{upVoteNum}</div>
                    </div>
                    <div className='question-content'>
                        <div className='question-info'>
                            <div className='user-name'>{username}</div>
                            <label className='post-time'>{datetime}</label>
                        </div>
                        <p>{content}</p>
                        <Button onClick={() => handleAnswerQuestion()} disabled={isAnswer} variant='primary' className='anwser-question-btn'>
                            {isAnswer ? 'answered' : 'answer'}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Question;
