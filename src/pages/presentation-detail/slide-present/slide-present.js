import './slide-present.css';
import { Button, Col, ListGroup, Row } from 'react-bootstrap';
import { Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Cell, LabelList } from 'recharts';
import { useEffect, useRef, useState } from 'react';
import useAxios from '../../../hooks/useAxios';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import { useParams } from 'react-router';
import useSlideApi from '../../../api/useSlideApi';
import UseContentApi from '../../../api/useContentApi';
import useContentApi from '../../../api/useContentApi';
import { ROOT_URL } from '../../../constant/common.const';
import Chat from '../../../component/Chat/Chat.js';

var stompClient = null;
var arr = [];
var count = 0;
const SlidePresent = () => {
    const messagesEndRef = useRef();

    const params = useParams();
    const slideApi = useSlideApi();
    const contentApi = useContentApi();
    const slideId = params.id;
    const axios = useAxios();
    const [slide, setSlide] = useState();
    const [optionVote, setOptionVote] = useState([]);
    const [maxValue, setMaxValue] = useState(0);
    const [chatList, setChatList] = useState([]);
    const [socketRerender, setSocketRerender] = useState(0);

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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        connect();
        reloadOptionVote();
    }, []);

    const connect = () => {
        let Sock = new SockJS(`${ROOT_URL}/ws`);
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    };
    const preSession = 3;
    const onConnected = () => {
        stompClient.subscribe(`/topic/slide/${slide?.id}`, onPrivateMessage);
        stompClient.subscribe(`/topic/chatroom/${preSession}`, onChatMessage);
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

    useEffect(() => {
        setChatList(arr);
        scrollToBottom();
        console.log(chatList);
    }, [socketRerender]);

    const onChatMessage = (payload) => {
        var payloadData = JSON.parse(payload.body);
        arr.push(payloadData);
        count = count + 1;
        setSocketRerender(count);
    };
    console.log('abcd');
    console.log(3, socketRerender);
    console.log(4, arr);

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
                    <Chat messagesEndRef={messagesEndRef} chatList={chatList} className={'chat-pane'}>
                        {' '}
                    </Chat>
                </Col>
            </Row>
        </>
    );
};

export default SlidePresent;
