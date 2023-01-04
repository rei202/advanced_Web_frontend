import './question-box.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from 'react-bootstrap';
import Message from './Question';
import { over } from 'stompjs';
import { useEffect, useRef, useState } from 'react';
import useChatApi from '../../api/useChatApi';
import Question from './Question';
import useQuestionApi from '../../api/useQuestionApi';

const QuestionBox = ({ currentRole, questionList, questionEndRef, setQuestionList, preId }) => {
    const [dataInput, setDataInput] = useState('');
    const [isDescendingVoteSort, setIsDescendingVoteSort] = useState(false);
    const [isRecentTimeFirstSort, setIsRecentTimeFirstSort] = useState(false);
    const [isAnsweredSort, setIsAnsweredSort] = useState(false);

    const quesitionApi = useQuestionApi();
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

    const handleVoteSort = () => {
        if (!isDescendingVoteSort) {
            setQuestionList([...questionList].sort((a, b) => b.numberVote - a.numberVote));
            setIsDescendingVoteSort(true);
        } else {
            setQuestionList([...questionList].sort((a, b) => a.numberVote - b.numberVote));
            setIsDescendingVoteSort(false);
        }
    };

    const handleTimeSort = () => {
        if (!isRecentTimeFirstSort) {
            setQuestionList([...questionList].sort((a, b) => Number(b.createdTime) - Number(a.createdTime)));
            setIsRecentTimeFirstSort(true);
        } else {
            setQuestionList([...questionList].sort((a, b) => Number(a.createdTime) - Number(b.createdTime)));
            setIsRecentTimeFirstSort(false);
        }
    };
    const handleAnsweredSort = () => {
        if (!isAnsweredSort) {
            console.log(Number(questionList[1].datetime));
            setQuestionList([...questionList].sort((a, b) => b.isAnswered - a.isAnswered));
            setIsAnsweredSort(true);
        } else {
            setQuestionList([...questionList].sort((a, b) => a.isAnswered - b.isAnswered));
            setIsAnsweredSort(false);
        }
    };
    console.log(6, currentRole);

    return (
        <>
            <div className='chat-pane'>
                <div className='chat-container'>
                    <div style={{ marginBottom: '10px' }}>
                        {/* <FontAwesomeIcon icon={faFilter} style={{ height: '20px' }}></FontAwesomeIcon> */}
                        <Dropdown align={'end'} style={{ textAlign: 'end' }}>
                            <Dropdown.Toggle id='dropdown-basic' className='icon-button' style={{ color: 'black' }}>
                                filter
                                <FontAwesomeIcon style={{ marginLeft: '5px' }} color='black' icon={faFilter}></FontAwesomeIcon>
                            </Dropdown.Toggle>

                            <Dropdown.Menu style={{ fontSize: '14px' }}>
                                <Dropdown.Item
                                    onClick={() => {
                                        handleAnsweredSort();
                                    }}
                                >
                                    {' '}
                                    {isAnsweredSort ? 'Unanswered' : 'Answered'}
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => {
                                        handleVoteSort();
                                    }}
                                >
                                    {isDescendingVoteSort ? 'Ascending vote' : 'Descending vote'}
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => {
                                        handleTimeSort();
                                    }}
                                >
                                    {' '}
                                    {isRecentTimeFirstSort ? 'Old time' : 'Recent time'}
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    {questionList.map((value, index) => (
                        <Question
                            key={index}
                            username={value.fullName}
                            content={value.question}
                            datetime={value.createdTime}
                            upVoteNum={value.numberVote}
                            isAnswer={value.isAnswered}
                            questionId={value.id}
                            preId={preId}
                            currentRole={currentRole}
                        />
                    ))}
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
