import './slide-present.scss';
import {Button, Col, Row} from 'react-bootstrap';
import { Bar, ResponsiveContainer, XAxis, YAxis, BarChart, LabelList } from 'recharts';
import { useEffect, useRef, useState } from 'react';
import useAxios from '../../../hooks/useAxios';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import { useParams } from 'react-router';
import useSlideApi from '../../../api/useSlideApi';
import UseContentApi from '../../../api/useContentApi';
import useContentApi from '../../../api/useContentApi';
import { BACKEND_URL} from '../../../constant/common.const';

import Chat from '../../../component/Chat/Chat.js';
import AutohideToast from '../../../component/view/Toast';
import useSound from 'use-sound';
import boopSfx from '../../../assets/audio/ring.mp3';
import useChatApi from '../../../api/useChatApi';
import QuestionBox from '../../../component/Question/QuestionBox';
import useQuestionApi from '../../../api/useQuestionApi';
import Container from "react-bootstrap/Container";
import {Fonts} from "react-bootstrap-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight} from "@fortawesome/free-solid-svg-icons";

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
    const chatApi = useChatApi();
    const questionApi = useQuestionApi();
    const contentApi = useContentApi();

    const axios = useAxios();
    const [listSlide, setListSlide] = useState([]);
    const [slide, setSlide] = useState();
    const [listOptionVote, setListOptionVote] = useState([]);
    const [maxValue, setMaxValue] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const [chatList, setChatList] = useState([]);
    const [content, setContent] = useState();
    const [questionList, setQuestionList] = useState([]);
    const [isChoosingChatBox, setIsChoosingChatBox] = useState(true);
    const [chatFlagRerender, setChatFlagRerender] = useState(0); //each receiving a message from socket, +1 then setChatlist
    const [heading, setHeading] = useState("");
    const [paragraph, setParagraph] = useState("");
    const [subheading, setSubheading] = useState("");
    const [quesFlagRerender, setQuesFlagRerender] = useState(0); //each receiving a question from socket, +1 then setQuestionlist
    const preId = params.id;
    const [currentSlideId, setCurrentSlideId] = useState(0);

    const reloadContentDetail = (slideId) => {
        return slideApi.getSlideDetail(slideId)
            .then((resp) => {
                setSlide(resp.data);
                return resp.data;
            })
            .then((resp) => {
                return contentApi.getContentDetail(resp?.id);
            })
            .then((resp) => {
                const contentTmp = resp?.data?.content;
                setContent(contentTmp);
                if (contentTmp.slideType == 1) {
                    const optionList = resp?.data?.listContentMultipleChoice.map((data) => {
                        if (data.option.numberVote + 6 > maxValue) setMaxValue(data.option.numberVote + 6);
                        return data.option;
                    });
                    setListOptionVote(optionList);
                } else if (contentTmp.slideType == 2) {
                    setHeading(resp?.data?.heading);
                    setParagraph(resp?.data?.paragraph);
                } else {
                    setHeading(resp?.data?.heading);
                    setSubheading(resp?.data?.subheading);
                }
            })
    }

    const reloadData = () => {
        slideApi
            .getListSlide(preId)
            .then((resp) => {
                const listSlideTmp = resp.data;
                setListSlide(resp.data);
                return reloadContentDetail(listSlideTmp[currentSlideId].id);
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
        reloadData();
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
        questionApi.loadOldQuesiton(preId).then((res) => {
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
            setListOptionVote(optionList);
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

    const slideShowMultipleChoiceUI = () => {
        return (
            <>
                <h2>{slide?.content?.title}</h2>
                <ResponsiveContainer width='60%' aspect={2} className='d-flex align-items-center center-h'>
                    <BarChart data={listOptionVote} width={200} height={200}>
                        <XAxis dataKey={'name'} />
                        <YAxis type='number' domain={[0, maxValue]} hide />
                        <Bar dataKey='numberVote' fill='#196cff' barSize={70}>
                            <LabelList dataKey='numberVote' position='top' />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </>
        )
    }

    const slideShowParagraphUI = () => {
        return (
            <Container className={'h-75 d-flex flex-column align-items-center justify-content-center'}>
                <h1>{heading}</h1>
                <p>{paragraph}</p>
            </Container>
        )
    }

    const slideShowHeadingUI = () => {
        return (
            <Container className={'h-75 d-flex flex-column align-items-center justify-content-center'}>
                <h1>{heading}</h1>
                <p>{subheading}</p>
            </Container>
        )
    }

    const slidePresentUi = () => {
        if (content?.slideType == 1) {
            return slideShowMultipleChoiceUI();
        } else if (content?.slideType == 2) {
            return slideShowParagraphUI();
        } else {
            return slideShowHeadingUI();
        }
    }

    const onLeftArrowBtnClick = () => {
        reloadContentDetail(listSlide[currentSlideId - 1].id)
        setCurrentSlideId(currentSlideId - 1);
    }

    const onRightArrowBtnClick = () => {
        reloadContentDetail(listSlide[currentSlideId + 1].id)
        setCurrentSlideId(currentSlideId + 1);
    }
    return (
        <>
            <Row style={{ padding: '32px 32px 70px 32px', height: '100vh', width: '100%' }}>
                <Col md={9} style={{ height: '100%', position: 'relative' }}>
                    <div className='container-slide'>
                        <p>
                            Go to <b>http://localhost:3000/presentation-voting</b> and use the code <b>{slide?.id}</b>
                        </p>
                        {slidePresentUi()}
                    </div>
                    <div style={{position : 'absolute', bottom : '5%', left : '5%'}}
                         className='utils-container d-flex justify-content-between p-3'>
                        <Button  onClick={() => onLeftArrowBtnClick()} disabled={currentSlideId == 0}>
                            <FontAwesomeIcon icon={faArrowLeft} size={"1x"} className='text-white me-4'/>
                        </Button>

                        <Button onClick={() => onRightArrowBtnClick()} disabled={currentSlideId == listSlide.length - 1}>
                            <FontAwesomeIcon icon={faArrowRight} size={"1x"} className='text-white'/>
                        </Button>
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
