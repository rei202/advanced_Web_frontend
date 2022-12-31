import './slide-show.css';
import { Button, Col, ListGroup, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faChartColumn, faEllipsisH, faPencil, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Cell, LabelList } from 'recharts';
import { useEffect, useState } from 'react';
import useAxios from '../../../hooks/useAxios';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import useContentApi from '../../../api/useContentApi';

var stompClient = null;

const SlideShow = (props) => {
    const slide = props.slide;
    const stateChange = props.stateChange;
    const contentApi = useContentApi();
    const [optionVote, setOptionVote] = useState([]);
    const [maxValue, setMaxValue] = useState(0);

    const reloadOptionVote = () => {
        contentApi
            .getContentDetail(slide?.content?.id)
            .then((resp) => {
                const optionList = resp.data.map((data) => {
                    if (data.option.numberVote + 6 > maxValue) setMaxValue(data.option.numberVote + 6);
                    return data.option;
                });
                setOptionVote(optionList);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        if (slide) connect();
        reloadOptionVote();
    }, [slide, stateChange]);

    const connect = () => {
        // let Sock = new SockJS('https://advancedwebbackend-production-1b23.up.railway.app/ws');
        let Sock = new SockJS('http://localhost:8080/ws');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    };

    const onConnected = () => {
        stompClient.subscribe(`/topic/slide/${slide?.id}`, onPrivateMessage);
    };

    const onPrivateMessage = (payload) => {
        var payloadData = JSON.parse(payload.body);
        if (payloadData) {
            const optionList = payloadData.map((data) => {
                if (data.option.numberVote + 6 > maxValue) setMaxValue(data.option.numberVote + 6);
                return data.option;
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
            <Row style={{ backgroundColor: 'rgb(219, 220, 225)', padding: '32px 32px 70px 32px', height: '90%' }}>
                {!props.isEmtyList ? (
                    <div className='container-slide'>
                        <p>
                            Go to <b>http://localhost:3000/advanced_Web_frontend#/presentation-voting</b> and use the code <b>{slide?.id}</b>
                        </p>

                        <h2>{slide?.content?.title}</h2>

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
                ) : (
                    <div className='container-slide'>
                        <h4 style={{ marginTop: '20px' }}>You haven't created any slide, let create new one !</h4>
                    </div>
                )}
            </Row>
            <Row className='p-2' style={{ height: '10%' }}>
                <Col>
                    <Button className='icon-button text-primary'>
                        <FontAwesomeIcon icon={faPencil} />
                        <span>Presenter notes</span>
                    </Button>
                </Col>
            </Row>
        </>
    );
};

export default SlideShow;
