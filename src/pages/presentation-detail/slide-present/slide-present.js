import './slide-present.scss';
import {Button, Col, Form, Modal, Row, Table} from 'react-bootstrap';
import { Bar, ResponsiveContainer, XAxis, YAxis, BarChart, LabelList } from 'recharts';
import { useEffect, useRef, useState, useContext } from 'react';
import useAxios from '../../../hooks/useAxios';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import {useLocation, useNavigate, useParams} from 'react-router';
import useSlideApi from '../../../api/useSlideApi';
import useContentApi from '../../../api/useContentApi';
import {BACKEND_URL, role_user, ROOT_URL} from '../../../constant/common.const';
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
import {faArrowLeft, faArrowRight, faUser, faXmark} from '@fortawesome/free-solid-svg-icons';
import usePresentationApi from '../../../api/usePresentationApi';
import usePresentingApi from "../../../api/usePresentingApi";
import useVotingApi from "../../../api/useVotingApi";
import useGroupApi from "../../../api/useGroupApi";

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
    const presentationApi = usePresentationApi();
    const presentingApi = usePresentingApi();

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
    const [heading, setHeading] = useState('');
    const [paragraph, setParagraph] = useState('');
    const [subheading, setSubheading] = useState('');
    const [quesFlagRerender, setQuesFlagRerender] = useState(0); //each receiving a question from socket, +1 then setQuestionlist
    const [preId, setPreId] = useState();
    const [groupId, setGroupId] = useState();
    const [currentSlideId, setCurrentSlideId] = useState(0);
    const presentingId = params.id;
    const [currentRole, setCurrentRole] = useState();
    const stompClient = useContext(SocketContext);
    const [isLoading, setIsLoading] = useState(true);

    const location = useLocation();
    const paramSearch = new URLSearchParams(location.search);

    const reloadContentDetail = (slideId) => {
        return votingApi.getListVoting(slideId)
            .then((resp) => {
                setListVoting(resp.data);
                return slideApi.getSlideDetail(slideId)
            })
            .then((resp) => {
                setSlide(resp.data);
                // if (stompClient.isConnected) {
                //     connect(resp?.data?.id);
                //     loadOldMessage();
                //     loadOldQuestion();
                // }
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

    const groupApi = useGroupApi();
    const reloadData = () => {
        let presentationIdTmp;
        presentingApi
            .getPresentingData(presentingId)
            .then((resp) => {
                setGroupId(resp?.data?.groupId);
                setPreId(resp?.data?.presentation?.id);
                presentationIdTmp = resp?.data?.presentation?.id;
                return groupApi.checkUserInGroup(localStorage.getItem('username'), resp?.data?.groupId);
                // return slideApi.getListSlide(resp?.data?.presentation?.id);
            })
            .then((resp) => {
                if (resp.data.roleUserInGroup == role_user.owner || resp.data.roleUserInGroup == role_user.coOwner)
                    return slideApi.getListSlide(presentationIdTmp, true);

                return slideApi.getListSlide(presentationIdTmp);

            })
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
        reloadData();
        // return () => {
        //     stompClient.unsubscribe(`/topic/slide/${slide?.id}`);
        //     stompClient.unsubscribe(`/topic/chatroom/${preId}`);
        //     stompClient.unsubscribe(`/topic/question/${preId}`);
        //
        //     stompClient.disconnect();
        // };
    }, [stompClient.isConnected]);

    const [isSetSocket, setIsSetSocket] = useState(false);
    useEffect(() => {
        if (stompClient.isConnected && listSlide && !isSetSocket) {
            setIsSetSocket(true);
            for (const slide of listSlide)
                if (slide?.content?.slideType == 1) connect(slide.id);
            stompClient.client.subscribe(`/topic/chatroom/${presentingId}`, onChatMessage);
            stompClient.client.subscribe(`/topic/question/${presentingId}`, onQuestion);
            setIsLoading(false);
            loadOldMessage();
            loadOldQuestion();
        }
    }, [stompClient.isConnected, listSlide])

    useEffect(() => {
        return () => {
            for (const slide of listSlide)
                if (slide?.content?.slideType == 1) connect(slide.id);
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
            }, 500);
        });
    };
    const loadOldQuestion = () => {
        questionApi.loadOldQuesiton(presentingId).then((res) => {
            // questionArr = res.data;
            console.log(4, res.data);
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
        // stompClient.client.subscribe(`/topic/chatroom/${presentingId}`, onChatMessage);
        // stompClient.client.subscribe(`/topic/question/${presentingId}`, onQuestion);
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

        votingApi.getListVoting(listSlide[currentSlideId].id)
            .then(resp => setListVoting(resp.data));
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
        if (currentSlideId == 0) return;
        presentingApi.moveToAnotherSlide({
            id : +presentingId,
            currentSlideIndex : currentSlideId - 1
        })
        reloadContentDetail(listSlide[currentSlideId - 1].id);
        setCurrentSlideId(currentSlideId - 1);

    };

    const onRightArrowBtnClick = () => {
        if (currentSlideId == listSlide.length - 1) return;
        presentingApi.moveToAnotherSlide({
            id : +presentingId,
            currentSlideIndex : currentSlideId + 1
        })
        reloadContentDetail(listSlide[currentSlideId + 1].id);
        setCurrentSlideId(currentSlideId + 1);

    };

    const navigate = useNavigate();
    const onStopPresenting = () => {
        presentingApi
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

    const votingApi = useVotingApi();
    const [listVoting, setListVoting] = useState([]);
    const onVotingListBtnClick = () => {
        setIsVotingListPanel(true);
    }

    const formatDate = (timestamp) => {
        if (!timestamp) return "";
        let date = new Date(timestamp);  // current date and time

        let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        let dateString = date.toLocaleDateString('en-US', options);

        options = { hour: '2-digit', minute: '2-digit' };
        let timeString = date.toLocaleTimeString('en-US', options);

        let formattedDate = `${dateString} ${timeString}`;
        return formattedDate;
    }

    const [isVotingListPanel, setIsVotingListPanel] = useState(false);
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

                    <Button className='utils-btn' style={{position : 'absolute', left : '5%', top : '5%', padding : '10px !important'}}
                            onClick={() => onStopPresenting()}>
                        <FontAwesomeIcon icon={faXmark} size={'1x'}/>
                    </Button>
                    <div style={{ position: 'absolute', bottom: '5%', left: '5%' }} className='utils-container d-flex justify-content-between p-3'>
                        <div onClick={() => onLeftArrowBtnClick()} disabled={currentSlideId == 0}
                             className={`utils-btn ${currentSlideId == 0 ? 'disabled' : ''} me-3`}>
                            <FontAwesomeIcon icon={faArrowLeft} size={'1x'} className='text-white' />
                        </div>

                        <div onClick={() => onRightArrowBtnClick()}
                             className={`utils-btn ${currentSlideId == listSlide.length - 1 ? 'disabled' : ''}`}>
                            <FontAwesomeIcon icon={faArrowRight} size={'1x'} className='text-white' />
                        </div>
                    </div>
                    <div className='d-flex justify-content-end'
                         style={{position : 'absolute', right : '5%', bottom : '5%'}}>
                        <div className='utils-right-btn' style={{position : 'relative', padding : '16px'}}
                             onClick={() => onVotingListBtnClick()}>
                            <span style={{backgroundColor : 'rgb(25, 108, 255)', color : 'white', left : '50%', padding : '3px',
                                position : 'absolute', transform : 'translateX(-50%) translateY(-125%)'}}>
                                {listVoting.length}
                            </span>
                            <FontAwesomeIcon icon={faUser} size={'1x'}/>
                        </div>
                    </div>
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
                <Modal show={isVotingListPanel} onHide={() => setIsVotingListPanel(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>List voting</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Table responsive='sm'>
                            <thead>
                                <th>Username</th>
                                <th>Option Vote</th>
                                <th>Started time</th>
                            </thead>
                            <tbody>
                            {
                                listVoting.map(voting =>
                                    <tr>
                                        <td>{voting?.userVote?.username}</td>
                                        <td>{voting?.option?.name}</td>
                                        <td>{formatDate(+voting?.createdTime)}</td>
                                    </tr>
                                )
                            }

                            </tbody>
                        </Table>
                    </Modal.Body>
                </Modal>
            </Row>
        </>
    );
};

export default SlidePresent;
