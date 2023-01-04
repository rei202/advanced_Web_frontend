import upVote from '../../assets/images/up-arrow.png';
import './question.scss';
import { Button } from 'react-bootstrap';
import useQuestionApi from '../../api/useQuestionApi';
import handleConvertTime from '../../utils/time-converter';
const Question = ({ currentRole, preId, questionId, username, content, isAnswer, upVoteNum, datetime }) => {
    const questionApi = useQuestionApi();
    const handleAnswerQuestion = () => {
        questionApi.answerQuestion(preId, questionId);
    };
    const handleUpVoteQuestion = () => {
        questionApi.upVote(preId, questionId);
    };
    // const handleConvertTime = (timeStamp) => {
    //     const date = new Date(Number(timeStamp));
    //     const dd = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    //     const mm = date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    //     const h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    //     const m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    //     return dd + '/' + mm + '/' + date.getFullYear() + ' ' + h + ':' + m;
    // };
    return (
        <>
            <div>
                <div className='question-main-content answer'>
                    <div className='question-avatar'>
                        <div onClick={() => handleUpVoteQuestion()} className='upvote-wapper'>
                            <img src={upVote}></img>
                        </div>
                        <div>{upVoteNum}</div>
                    </div>
                    <div className='question-content'>
                        <div className='question-info'>
                            <div className='user-name'>{username}</div>
                            <label className='post-time'>{handleConvertTime(datetime)}</label>
                        </div>
                        <p>{content}</p>
                        {currentRole || isAnswer ? (
                            <Button onClick={() => handleAnswerQuestion()} disabled={isAnswer} variant='primary' className='anwser-question-btn'>
                                {isAnswer ? 'answered' : 'answer'}
                            </Button>
                        ) : (
                            <div />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
export default Question;
