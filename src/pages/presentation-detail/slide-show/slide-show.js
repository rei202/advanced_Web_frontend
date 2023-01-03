import './slide-show.css';
import { Button, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { Bar, ResponsiveContainer, XAxis, YAxis, BarChart, LabelList } from 'recharts';
import { useContext, useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import useContentApi from '../../../api/useContentApi';
import Container from 'react-bootstrap/Container';
import SocketContext from '../../../store/Context';

const SlideShow = (props) => {
    const slideId = props.slideId;
    const stateChange = props.stateChange;
    const contentApi = useContentApi();
    const [listOptionVote, setListOptionVote] = useState([]);
    const [slide, setSlide] = useState();
    const [maxValue, setMaxValue] = useState(0);
    const [heading, setHeading] = useState('');
    const [paragraph, setParagraph] = useState('');
    const [subheading, setSubheading] = useState('');
    const stompClient = useContext(SocketContext);

    const reloadContentDetail = () => {
        contentApi
            .getContentDetail(slideId)
            .then((resp) => {
                const slideTmp = resp?.data?.content;
                setSlide(slideTmp);
                if (slideTmp.slideType == 1) {
                    const optionList = resp?.data?.listContentMultipleChoice.map((data) => {
                        if (data.option.numberVote + 6 > maxValue) setMaxValue(data.option.numberVote + 6);
                        return data.option;
                    });
                    setListOptionVote(optionList);
                } else if (slideTmp.slideType == 2) {
                    setHeading(resp?.data?.heading);
                    setParagraph(resp?.data?.paragraph);
                } else {
                    setHeading(resp?.data?.heading);
                    setSubheading(resp?.data?.subheading);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        if (slideId) {
            connect();
            reloadContentDetail();
        }
    }, [slideId, stateChange]);
    useEffect(() => {
        return () => {
            stompClient.unsubscribe(`/topic/slide/${slideId}`);
        };
    }, []);
    const connect = () => {
        // let Sock = new SockJS('https://advancedwebbackend-production-1b23.up.railway.app/ws');
        // let Sock = new SockJS('http://localhost:8080/ws');
        // stompClient = over(Sock);
        // stompClient.connect({}, onConnected, onError);
        onConnected();
    };

    const onConnected = () => {
        stompClient.subscribe(`/topic/slide/${slideId}`, onPrivateMessage);
    };

    const onPrivateMessage = (payload) => {
        var payloadData = JSON.parse(payload.body);
        if (payloadData) {
            const optionList = payloadData.map((data) => {
                if (data.option.numberVote + 6 > maxValue) setMaxValue(data.option.numberVote + 6);
                return data.option;
            });
            setListOptionVote(optionList);
        }
    };

    const onError = (err) => {
        console.log(err);
    };

    const maxCount = 200;

    const slideShowMultipleChoiceUI = () => {
        return (
            <>
                <h2>{slide?.title}</h2>
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

    const slideShowUI = () => {
        if (slide?.slideType == 1) {
            return slideShowMultipleChoiceUI();
        } else if (slide?.slideType == 2) {
            return slideShowParagraphUI();
        } else {
            return slideShowHeadingUI();
        }
    };
    return (
        <>
            <Row style={{ backgroundColor: 'rgb(219, 220, 225)', padding: '32px 32px 70px 32px', height: '90%' }}>
                {!props.isEmtyList ? (
                    <div className='container-slide'>
                        <p>
                            Go to <b>http://localhost:3000/advanced_Web_frontend#/presentation-voting</b> and use the code <b>{slideId}</b>
                        </p>

                        {slideShowUI()}
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
