import './slide-present.css';
import {
    Button,
    Col,
    ListGroup, Row
} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretRight, faChartColumn, faEllipsisH, faPencil, faPlus} from "@fortawesome/free-solid-svg-icons";
import {Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Cell, LabelList} from "recharts";
import {useEffect, useState} from "react";
import useAxios from "../../../hooks/useAxios";
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import {connect} from "net";
import {useParams} from "react-router";

var stompClient = null;

const SlidePresent = () => {
    const params = useParams();
    const slideId = params.id;
    const axios = useAxios();
    const [slide, setSlide] = useState();
    const [optionVote, setOptionVote] = useState([]);
    const [maxValue, setMaxValue] = useState(0);
    const reloadOptionVote = () => {
        axios.get(`/api/v1/slide/${slideId}`)
            .then(resp => {
                setSlide(resp.data);
                return resp.data
            })
            .then(resp => {
                return axios.get('/api/v1/slide-type', {params : {contentId : slide?.content?.id}})
            })
            .then(resp => {
                const optionList = resp.data.map(data => {
                    if (data.option.numberVote + 6 > maxValue) setMaxValue(data.option.numberVote + 6);
                    return data.option
                });
                setOptionVote(optionList);
                console.log(optionList);
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        connect();
        reloadOptionVote()
    }, [])

    const connect = () => {
        let Sock = new SockJS('http://localhost:8080/ws');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    };

    const onConnected = () => {
        stompClient.subscribe(`/topic/${slide?.id}`, onPrivateMessage);
    };

    const onPrivateMessage = (payload) => {
        console.log(payload);
        var payloadData = JSON.parse(payload.body);
        if (payloadData) {
            const optionList = payloadData.map(data => {
                if (data.option.numberVote + 6 > maxValue) setMaxValue(data.option.numberVote + 6);
                return data.option
            });
            setOptionVote(optionList);
        }
    };

    const onError = (err) => {
        console.log(err);
    };

    const maxCount = 200;

    return (
        <>
            <Row style={{padding : '32px 32px 70px 32px', height : '100%'}}>
                <div className='container-slide'>
                    <p>Go to <b>http://localhost:3000/presentation-voting</b> and use the code <b>{slide?.id}</b></p>
                    <p>
                        <h1 className='text-start'>{slide?.content?.title}</h1>
                    </p>
                    <ResponsiveContainer width='60%'  aspect={2} className='d-flex align-items-center center-h'>
                        <BarChart data={optionVote} width={200} height={200} >
                            <XAxis dataKey={'name'}/>
                            <YAxis type='number' domain={[0, maxValue]} hide />
                            <Bar dataKey='numberVote' fill='#196cff' barSize={70}>
                                <LabelList dataKey='numberVote' position='top'/>
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Row>
        </>
    );
};

export default SlidePresent;
