import './slide-present-guest.scss';
import { Button, Col, Row } from 'react-bootstrap';
import { Bar, ResponsiveContainer, XAxis, YAxis, BarChart, LabelList } from 'recharts';
import { useEffect, useRef, useState, useContext } from 'react';
import useAxios from '../../../hooks/useAxios';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import { useNavigate, useParams } from 'react-router';
import useSlideApi from '../../../api/useSlideApi';
import useContentApi from '../../../api/useContentApi';
import SocketContext from '../../../store/Context';
import Chat from '../../../component/Chat/Chat.js';
import AutohideToast from '../../../component/view/Toast';
import useSound from 'use-sound';
import boopSfx from '../../../assets/audio/ring.mp3';
import useChatApi from '../../../api/useChatApi';
import QuestionBox from '../../../component/Question/QuestionBox';
import useQuestionApi from '../../../api/useQuestionApi';
import Container from 'react-bootstrap/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faXmark } from '@fortawesome/free-solid-svg-icons';
import usePresentationApi from '../../../api/usePresentationApi';
import usePresentingApi from '../../../api/usePresentingApi';
import { ROOT_URL } from '../../../constant/common.const';
import useGroupApi from '../../../api/useGroupApi';

var stompClient = null;
var chatArr = [];
var questionPayload = null;

var count = 0;
const SlidePresentGuest = () => {
    const messagesEndRef = useRef();
    const questionEndRef = useRef();

    const [playRingTone] = useSound(boopSfx);
    const params = useParams();
    const slideApi = useSlideApi();
    const chatApi = useChatApi();
    const questionApi = useQuestionApi();
    const contentApi = useContentApi();
    const presentationApi = usePresentationApi();
    const presentingApi = usePresentingApi();

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
    const [heading, setHeading] = useState('');
    const [paragraph, setParagraph] = useState('');
    const [subheading, setSubheading] = useState('');
    const [quesFlagRerender, setQuesFlagRerender] = useState(0); //each receiving a question from socket, +1 then setQuestionlist
    const [preId, setPreId] = useState();
    const [groupId, setGroupId] = useState();
    const [currentSlideId, setCurrentSlideId] = useState(0);
    const [currentRole, setCurrentRole] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const presentingId = params.id;

    const stompClient = useContext(SocketContext);

    const reloadContentDetail = (slideId) => {
        return slideApi
            .getSlideDetail(slideId)
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
            });
    };

    const [currentSlideIndex, setCurrentSlideIndex] = useState();
    let currentSlideInitTmp = 0;

    useEffect(() => {
        console.log('chek listSlide');
        console.log(listSlide);
    }, [listSlide])

    const reloadData = () => {
        presentingApi
            .getPresentingData(presentingId)
            .then((resp) => {
                setGroupId(resp?.data?.groupId);
                const username = localStorage.getItem('username');
                groupApi.checkUserInGroup(username, resp?.data?.groupId).then((resp) => {
                    if (!resp?.data) navigate('/');
                });
                setPreId(resp?.data?.presentation?.id);
                setCurrentSlideIndex(resp?.data?.currentSlideIndex);
                currentSlideInitTmp = resp?.data?.currentSlideIndex;
                return slideApi.getListSlide(resp?.data?.presentation?.id, true);
            })
            .then((resp) => {
                const listSlideTmp = resp.data;
                setListSlide(listSlideTmp);
                return reloadContentDetail(listSlideTmp[currentSlideInitTmp].id);
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

    const groupApi = useGroupApi();
    useEffect(() => {
        if (stompClient.isConnected) reloadData();
    }, [stompClient.isConnected]);

    const [isSetSocket, setIsSetSocket] = useState(false);
    useEffect(() => {
        if (stompClient.isConnected && listSlide && listSlide.length > 0 && !isSetSocket) {
            setIsSetSocket(true);
            for (const slide of listSlide) if (slide?.content?.slideType == 1) connect(slide.id);
            stompClient.client.subscribe(`/topic/presenting/${presentingId}`, onSlideChangeMessage);
            stompClient.client.subscribe(`/topic/chatroom/${presentingId}`, onChatMessage);
            stompClient.client.subscribe(`/topic/question/${presentingId}`, onQuestion);
            setIsLoading(false);
            loadOldMessage();
            loadOldQuestion();
        }
    }, [stompClient.isConnected, listSlide]);

    useEffect(() => {
        return () => {
            for (const slide of listSlide)
                if (slide?.content?.slideType == 1) {
                    stompClient.client.unsubscribe(`/topic/slide/${slide.id}`);
                }
            stompClient.client.unsubscribe(`/topic/presenting/${presentingId}`);
            stompClient.client.unsubscribe(`/topic/chatroom/${preId}`);
            stompClient.client.unsubscribe(`/topic/question/${preId}`);
        };
    }, []);
    const loadOldMessage = () => {
        chatApi.loadOldMessage(presentingId).then((res) => {
            chatArr = res.data;
            setChatList(chatArr);
            setTimeout(function () {
                scrollToBottomChat();
            }, 1000);
        });
    };
    const loadOldQuestion = () => {
        questionApi.loadOldQuesiton(presentingId).then((res) => {
            // questionArr = res.data;
            setQuestionList(res.data.oldQuestionList);
            setCurrentRole(res.data.owner);
            setTimeout(function () {
                scrollToBottomQuestion();
            }, 500);
        });
    };

    const connect = (slideId) => {
        // // let Sock = new SockJS(`${BACKEND_URL}/ws`);
        // // stompClient = over(Sock);
        // stompClient.connect({}, onConnected, onError);
        onConnected(slideId);
    };

    const onConnected = (slideId) => {
        stompClient.client.subscribe(`/topic/slide/${slideId}`, onPrivateMessage);
    };

    const onSlideChangeMessage = (payload) => {
        setCurrentSlideIndex(payload.body);
        console.log(listSlide);
        if (listSlide && listSlide.length > 0) reloadContentDetail(listSlide[payload.body].id);
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
        );
    };

    const slideShowParagraphUI = () => {
        return (
            <Container className={'h-75 d-flex flex-column align-items-center justify-content-center'}>
                <h1>{heading}</h1>
                <p>{paragraph}</p>
            </Container>
        );
    };

    const slideShowHeadingUI = () => {
        return (
            <Container className={'h-75 d-flex flex-column align-items-center justify-content-center'}>
                <h1>{heading}</h1>
                <p>{subheading}</p>
            </Container>
        );
    };

    const slidePresentUi = () => {
        if (content?.slideType == 1) {
            return slideShowMultipleChoiceUI();
        } else if (content?.slideType == 2) {
            return slideShowParagraphUI();
        } else {
            return slideShowHeadingUI();
        }
    };

    const onLeftArrowBtnClick = () => {
        reloadContentDetail(listSlide[currentSlideId - 1].id);
        setCurrentSlideId(currentSlideId - 1);
    };

    const onRightArrowBtnClick = () => {
        reloadContentDetail(listSlide[currentSlideId + 1].id);
        setCurrentSlideId(currentSlideId + 1);
    };

    const navigate = useNavigate();
    const onStopPresenting = () => {
        presentationApi
            .stopPresentingData({
                presentingId: presentingId,
            })
            .then((resp) => {
                navigate(`/presentation/${preId}`);
            });
    };

    const changeTypePane = (isChatBox) => {
        setIsChoosingChatBox(isChatBox);
    };
    return (
        <>
            <Row style={{ padding: '32px 32px 70px 32px', height: '100vh', width: '100%' }}>
                <Col md={9} style={{ height: '100%', position: 'relative' }}>
                    <div className='container-slide'>
                        <p>
                            Go to <b>{`${ROOT_URL}/presentation-voting`}</b> and use the code <b>{slide?.id}</b>
                        </p>
                        {slidePresentUi()}
                    </div>
                    <Button className='utils-btn' style={{ left: '5%', top: '5%' }} onClick={() => navigate(`/group/${groupId}`)}>
                        <FontAwesomeIcon icon={faArrowLeft} size={'1x'} />
                        <span className='ms-2'>Back</span>
                    </Button>
                </Col>
                <Col md={3} style={{ height: '100%' }}>
                    <div className='option-leftside-container'>
                        <div className={isChoosingChatBox ? 'chatbox-option chosen' : 'chatbox-option'} onClick={() => changeTypePane(true)}>
                            Chat box
                        </div>
                        <div className={!isChoosingChatBox ? 'questionbox-option chosen' : 'questionbox-option'} onClick={() => changeTypePane(false)}>
                            Question Box
                        </div>
                    </div>
                    {isChoosingChatBox ? (
                        <Chat isLoading={isLoading} preId={presentingId} messagesEndRef={messagesEndRef} chatList={chatList} className={'chat-pane'}>
                            {' '}
                        </Chat>
                    ) : (
                        <QuestionBox
                            isLoading={isLoading}
                            preId={presentingId}
                            setQuestionList={setQuestionList}
                            questionEndRef={questionEndRef}
                            questionList={questionList}
                            currentRole={currentRole}
                        ></QuestionBox>
                    )}
                </Col>
                <AutohideToast show={showToast} setShow={setShowToast}></AutohideToast>
            </Row>
        </>
    );
};

export default SlidePresentGuest;
