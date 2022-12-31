import './question-box.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

import Message from './Question';
import { over } from 'stompjs';
import { useEffect, useRef, useState } from 'react';
import useChatApi from '../../api/useChatApi';
import Question from './Question';
import useQuestionApi from '../../api/useQuestionApi';

const QuestionBox = ({ questionList, questionEndRef }) => {
    const [dataInput, setDataInput] = useState('');
    const quesitionApi = useQuestionApi();
    const preId = 8;
    const submitMessage = () => {
        quesitionApi.postQuestion(preId, {
            question: dataInput,
            createdTime: Date.now(),
        });
        setDataInput('');
    };

    console.log(5, questionList);
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') submitMessage();
    };

    return (
        <>
            <div className='chat-pane'>
                <div className='chat-container'>
                    <div>
                        <FontAwesomeIcon icon={faFilter} style={{ height: '20px' }}></FontAwesomeIcon>
                        Filter
                    </div>
                    {questionList.map((value, index) => (
                        <Question
                            key={index}
                            username={value.presentation.user.username}
                            content={value.question}
                            datetime={value.createdTime}
                            upVoteNum={value.numberVote}
                            isAnswer={value.isAnswered}
                            questionId={value.id}
                            preId={preId}
                        />
                    ))}
                    <Question isAnswer={true} username={'nhatks147'} content={'how many animal '} datetime={'19/12/2001 04:30'}></Question>

                    <div ref={questionEndRef} />
                </div>
                <div className={'input-chat-box'}>
                    <input value={dataInput} onKeyDown={(e) => handleKeyDown(e)} onChange={(e) => setDataInput(e.target.value)} type='text'></input>
                    <div onClick={() => submitMessage()} className='send-btn-wapper'>
                        <FontAwesomeIcon className='send-btn' icon={faPaperPlane}></FontAwesomeIcon>
                    </div>
                </div>
            </div>
        </>
    );
};
export default QuestionBox;
