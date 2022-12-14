import './presentation-detail.css';
import { Button, Col, Container, Dropdown, DropdownButton, Form, ListGroup, Modal, Nav, Navbar, NavDropdown, Row, Table } from 'react-bootstrap';
import { CaretRightSquareFill, Plus, Share } from 'react-bootstrap-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCaretRight, faChartColumn, faChartSimple, faEllipsisH, faPencil, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import SlideWindow from './slide-window/slide-window';
import SlideShow from './slide-show/slide-show';
import SlideEdit from './slide-edit/slide-edit';
import { useNavigate, useParams } from 'react-router';
import useAxios from '../../hooks/useAxios';
import useSlideApi from "../../api/useSlideApi";

const PresentationDetail = () => {
    const navigate = useNavigate();
    const params = useParams();
    const axios = useAxios();
    const slideApi = useSlideApi();
    const preId = params.id;
    const [listSlide, setListSlide] = useState(
        [
            {
                "id": 25,
                "presentation": {
                    "id": 5,
                    "name": "presentation_1",
                    "user": {
                        "id": 2,
                        "username": "nhatcuongti",
                        "emailAddress": "nhatcuongti@gmail.com",
                        "facebookId": null,
                        "fullName": "Bùi Nguyễn Nhật Hào",
                        "image": null,
                        "activate": true
                    },
                    "modifiedTime": null,
                    "createdTime": null
                },
                "content": {
                    "id": 25,
                    "slideType": 1,
                    "title": "Multiple choice"
                }
            }
        ]
    );
    const [choosenSlide, setChoosenSlide] = useState(
        {
            "id": 25,
            "test" : true,
            "presentation": {
                "id": 5,
                "name": "presentation_1",
                "user": {
                    "id": 2,
                    "username": "nhatcuongti",
                    "emailAddress": "nhatcuongti@gmail.com",
                    "facebookId": null,
                    "fullName": "Bùi Nguyễn Nhật Hào",
                    "image": null,
                    "activate": true
                },
                "modifiedTime": null,
                "createdTime": null
            },
            "content": {
                "id": 25,
                "slideType": 1,
                "title": "Multiple choice"
            }
        },
    );
    const [isEmtyList, setIsEmtyList] = useState(false);
    const [stateChange, setStateChange] = useState(true);
    const reloadListSlide =() => {
        slideApi.getListSlide(preId)
            .then((resp) => {
                setListSlide(resp.data);
                if (resp.data.length === 0) setIsEmtyList(true);
                else {
                    if (choosenSlide?.test) setChoosenSlide(resp.data[0])
                    else if (choosenSlide) setChoosenSlide(resp.data.filter(data => data.id == choosenSlide.id)[0])
                    setIsEmtyList(false);
                }
            })
            .catch((err) => {
            });
    };

    useEffect(() => {
        reloadListSlide();
    }, [stateChange]);

    const onAddNewSlideClick = () => {
        slideApi.addNewSlide( { preId: preId, slideType: 1, title: 'Multiple choice' })
            .then((resp) => {
                if (resp.data) {
                    listSlide.push(resp.data);
                    setListSlide([...listSlide]);
                    setChoosenSlide(listSlide.at(-1));
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onChoosenSlideClick = (slide) => {
        if (slide) setChoosenSlide(slide);
    };

    const onChangeValueOnRightOption = () => {
        setStateChange(!stateChange);
    };

    const onDeleteSlideClick = () => {
        slideApi.deleteSlide( { slideId: choosenSlide?.id })
            .then((resp) => {
                const deleteSlide = resp.data;
                const indexDeleteSlide = listSlide.findIndex(slide => slide.id == deleteSlide.id);
                const listSlideAfterDelete = listSlide.filter(slide => slide.id != deleteSlide.id);
                setListSlide([...listSlideAfterDelete]);

                let choosenSlideAfterDelete = {};
                if (listSlideAfterDelete.length > 0) {
                    choosenSlideAfterDelete = listSlideAfterDelete[(indexDeleteSlide == 0) ? 0 : indexDeleteSlide - 1];
                }

                setChoosenSlide(choosenSlideAfterDelete);

            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <Container fluid>
            {/*Nav Bar*/}
            <Row>
                <Container id='custom-navbar'>
                    <Navbar expand='lg' variant='light' bg='light'>
                        {/*<Navbar.Brand href="#">Navbar</Navbar.Brand>*/}
                        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
                        <Navbar.Collapse id='responsive-navbar-nav'>
                            <Nav className='me-auto'>
                                <div className='d-flex align-items-center me-2' onClick={() => navigate('/presentation')}>
                                    <FontAwesomeIcon icon={faArrowLeft} style={{ cursor: 'pointer' }} className='p-2 align-middle' />
                                </div>
                                <div className='d-flex flex-column'>
                                    <b>{}</b>
                                    <span className='m-0 text-secondary'>Created by Hao Su</span>
                                </div>
                            </Nav>
                            <Nav>
                                <Button variant='secondary' className='me-4'>
                                    <Share size='20' className={'me-2'}></Share>
                                    <span>Share</span>
                                </Button>
                                <Button variant='primary' onClick={() => navigate(`./present`)}>
                                    <FontAwesomeIcon className={'me-2'} icon={faCaretRight} size={'xl'} />
                                    <span>Present</span>
                                </Button>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </Container>
            </Row>
            {/*utilities (Add slide, delete slide,...)*/}
            <Row style={{ backgroundColor: 'white', borderBottom: '2px solid rgb(231, 232, 235)', padding: '8px 16px 8px 16px' }}>
                <Col className='d-flex flex-row justify-content-between'>
                    <div>
                        <Button variant={'primary'} onClick={() => onAddNewSlideClick()}>
                            <FontAwesomeIcon className={'me-2'} icon={faPlus} />
                            <span>New slide</span>
                        </Button>
                        <Button variant={'danger'} onClick={() => onDeleteSlideClick()} className='ms-2'>
                            <FontAwesomeIcon className={'me-2'} icon={faTrash} />
                            <span>Delete slide</span>
                        </Button>
                    </div>
                </Col>
            </Row>
            {/*Slide Show*/}
            <Row className='content-wapper'>
                <Col id='left-pane' className='p-0' xs={2}>
                    <SlideWindow listSlide={listSlide} slide={choosenSlide} onChoosenSlide={onChoosenSlideClick} />
                </Col>
                <Col id='center-pane' xs={7}>
                    <SlideShow slide={choosenSlide} stateChange={stateChange} isEmtyList={isEmtyList} />
                </Col>
                <Col id='right-pane' xs={3}>
                    <SlideEdit slide={choosenSlide} changeValue={onChangeValueOnRightOption} />
                </Col>
            </Row>
        </Container>
    );
};

export default PresentationDetail;
