import './slide-present.scss';
import { Button, Col, ListGroup, Row, Toast } from 'react-bootstrap';
import { Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Cell, LabelList } from 'recharts';
import { useEffect, useRef, useState } from 'react';
import useAxios from '../../../hooks/useAxios';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import { connect } from 'net';
import { useParams } from 'react-router';
import useSlideApi from '../../../api/useSlideApi';
import UseContentApi from '../../../api/useContentApi';
import useContentApi from '../../../api/useContentApi';
import { BACKEND_URL, ROOT_URL } from '../../../constant/common.const';

import Chat from '../../../component/Chat/Chat.js';
import AutohideToast from '../../../component/view/Toast';
import useSound from 'use-sound';
import boopSfx from '../../../assets/audio/ring.mp3';
import useChatApi from '../../../api/useChatApi';
import Nav from 'react-bootstrap/Nav';
import QuestionBox from '../../../component/Question/QuestionBox';
import useQuestionApi from '../../../api/useQuestionApi';

var stompClient = null;
var chatArr = [];
var questionPayload = null;

var count = 0;
const SlidePresent = () => {
    const messagesEndRef = useRef();
    const questionEndRef = useRef();

    const [playRingTone] = useSound(boopSfx);
    const params = useParams();
    const slideApi = useSlideApi();
    const contentApi = useContentApi();
    const axios = useAxios();
    const [slide, setSlide] = useState();
    const [optionVote, setOptionVote] = useState([]);
    const [maxValue, setMaxValue] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const [chatList, setChatList] = useState([]);
    const [questionList, setQuestionList] = useState([]);
    const [isChoosingChatBox, setIsChoosingChatBox] = useState(true);
    const [chatFlagRerender, setChatFlagRerender] = useState(0); //each receiving a message from socket, +1 then setChatlist
    const chatApi = useChatApi();
    const [quesFlagRerender, setQuesFlagRerender] = useState(0); //each receiving a question from socket, +1 then setQuestionlist
    const quesitionApi = useQuestionApi();
    const preId = params.id;
    const slideId = 18;

    console.log(slideId);
    const reloadOptionVote = () => {
        slideApi
            .getSlideDetail(slideId)
            .then((resp) => {
                setSlide(resp.data);
                return resp.data;
            })
            .then((resp) => {
                return UseContentApi.getContentDetail(slide?.content?.id);
            })
            .then((resp) => {
                const optionList = resp.data.map((data) => {
                    if (data.option.numberVote + 6 > maxValue) setMaxValue(data.option.numberVote + 6);
                    return data.option;
                });
                setOptionVote(optionList);
                console.log(optionList);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const scrollToBottomChat = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    const scrollToBottomQuestion = () => {
        questionEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        connect();
        loadOldMessage();
        reloadOptionVote();
        loadOldQuestion();
        return () => {
            stompClient.unsubscribe(`/topic/slide/${slide?.id}`);
            stompClient.unsubscribe(`/topic/chatroom/${preId}`);
            stompClient.unsubscribe(`/topic/question/${preId}`);

            stompClient.disconnect();
        };
    }, []);
    const loadOldMessage = () => {
        chatApi.loadOldMessage(preId).then((res) => {
            chatArr = res.data;
            setChatList(chatArr);
            setTimeout(function () {
                scrollToBottomChat();
            }, 1000);
        });
    };
    const loadOldQuestion = () => {
        quesitionApi.loadOldQuesiton(preId).then((res) => {
            // questionArr = res.data;
            setQuestionList(res.data);
            setTimeout(function () {
                scrollToBottomQuestion();
            }, 1000);
        });
    };

    const connect = () => {
        let Sock = new SockJS(`${BACKEND_URL}/ws`);
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    };
    const onConnected = () => {
        stompClient.subscribe(`/topic/slide/${slide?.id}`, onPrivateMessage);
        stompClient.subscribe(`/topic/chatroom/${preId}`, onChatMessage);
        stompClient.subscribe(`/topic/question/${preId}`, onQuestion);
    };

    const onPrivateMessage = (payload) => {
        console.log(payload);
        var payloadData = JSON.parse(payload.body);
        if (payloadData) {
            const optionList = payloadData.map((data) => {
                if (data.option.numberVote + 6 > maxValue) setMaxValue(data.option.numberVote + 6);
                return data.option;
            });
            setOptionVote(optionList);
        }
    };

    // useEffect(() => {
    //     setChatList(chatArr);
    //     scrollToBottom();
    //     console.log(chatList);
    // }, [socketRerender]);

    useEffect(() => {
        setChatList(chatArr);
        if (chatArr.length !== 0)
            if (chatArr[chatArr.length - 1].username !== localStorage.getItem('username')) {
                playRingTone();
                setShowToast(true);
            }

        scrollToBottomChat();
        console.log(chatList);
    }, [chatFlagRerender]);

    const onChatMessage = (payload) => {
        var payloadData = JSON.parse(payload.body);
        chatArr.push(payloadData);
        count = count + 1;
        setChatFlagRerender(count);
    };
    useEffect(() => {
        if (questionPayload !== null) {
            const index = questionList.findIndex((value) => value.id === questionPayload.id);
            var questionArr = [...questionList];
            if (index === -1) {
                questionArr.push(questionPayload);
                setTimeout(function () {
                    scrollToBottomQuestion();
                }, 500);
            } else {
                questionArr[index] = questionPayload;
            }
            setQuestionList(questionArr);
        }
    }, [quesFlagRerender]);

    const onQuestion = (payload) => {
        var payloadData = JSON.parse(payload.body);
        questionPayload = payloadData;

        count = count + 1;
        setQuesFlagRerender(count);
    };

    const onError = (err) => {
        console.log(err);
    };

    const maxCount = 200;

    return (
        <>
            <Row style={{ padding: '32px 32px 70px 32px', height: '100vh', width: '100%' }}>
                <Col md={9} style={{ height: '100%' }}>
                    <div className='container-slide'>
                        <p>
                            Go to <b>http://localhost:3000/presentation-voting</b> and use the code <b>{slide?.id}</b>
                        </p>

                        <h1 className='text-start'>{slide?.content?.title}</h1>

                        <ResponsiveContainer width='60%' aspect={2} className='d-flex align-items-center center-h'>
                            <BarChart data={optionVote} width={200} height={200}>
                                <XAxis dataKey={'name'} />
                                <YAxis type='number' domain={[0, maxValue]} hide />
                                <Bar dataKey='numberVote' fill='#196cff' barSize={70}>
                                    <LabelList dataKey='numberVote' position='top' />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Col>
                <Col md={3} style={{ height: '100%' }}>
                    <div className='option-leftside-container'>
                        <div
                            className={isChoosingChatBox ? 'chatbox-option chosen' : 'chatbox-option'}
                            onClick={() => {
                                if (!isChoosingChatBox) setIsChoosingChatBox(true);
                            }}
                        >
                            Chat box
                        </div>
                        <div
                            className={!isChoosingChatBox ? 'questionbox-option chosen' : 'questionbox-option'}
                            onClick={() => {
                                if (isChoosingChatBox) setIsChoosingChatBox(false);
                            }}
                        >
                            Question Box
                        </div>
                    </div>
                    {isChoosingChatBox ? (
                        <Chat preId={preId} messagesEndRef={messagesEndRef} chatList={chatList} className={'chat-pane'}>
                            {' '}
                        </Chat>
                    ) : (
                        <QuestionBox preId={preId} setQuestionList={setQuestionList} questionEndRef={questionEndRef} questionList={questionList}></QuestionBox>
                    )}
                </Col>
                <AutohideToast show={showToast} setShow={setShowToast}></AutohideToast>
            </Row>
        </>
    );
};

export default SlidePresent;
