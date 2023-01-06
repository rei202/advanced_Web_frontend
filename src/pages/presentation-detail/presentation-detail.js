import './presentation-detail.css';
import {
    Button,
    Col,
    Container,
    Form,
    Modal,
    Nav,
    Navbar,
    Row,
} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faCaretRight,
    faPlus,
    faTrash
} from '@fortawesome/free-solid-svg-icons';
import {useEffect, useState} from 'react';
import SlideWindow from './slide-window/slide-window';
import SlideShow from './slide-show/slide-show';
import SlideEdit from './slide-edit/slide-edit';
import {useNavigate, useParams} from 'react-router';
import useAxios from '../../hooks/useAxios';
import useSlideApi from "../../api/useSlideApi";
import useGroupApi from "../../api/useGroupApi";
import usePresentationApi from "../../api/usePresentationApi";
import usePresentingApi from "../../api/usePresentingApi";
import {role_user} from "../../constant/common.const";
import Loading from "../../component/Loading/Loading";

const PresentationDetail = () => {
    const navigate = useNavigate();
    const params = useParams();
    const slideApi = useSlideApi();
    const groupApi = useGroupApi();
    const preId = params.id;
    const [listSlide, setListSlide] = useState(
        [
            {
                "id": null,
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
    const [choosenSlideId, setChoosenSlideId] = useState(null);
    const [isEmtyList, setIsEmtyList] = useState(false);
    const [stateChange, setStateChange] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const reloadListSlide = () => {
        slideApi.getListSlide(preId)
            .then((resp) => {
                setListSlide(resp.data);
                if (resp.data.length === 0) setIsEmtyList(true);
                else {
                    // if (!choosenSlideId) setChoosenSlideId(resp.data[0].id)
                    // else if (choosenSlideId) setChoosenSlideId(resp.data.filter(data => data.id == choosenSlideId.id)[0].id)
                    setChoosenSlideId(resp.data[0].id);
                    setIsEmtyList(false);
                }

            })
            .catch((err) => {
                console.log(err);
                if (err?.response?.status == 403) navigate('/presentation');
            });
    };

    useEffect(() => {
        reloadListSlide();
    }, []);

    const onAddNewSlideClick = () => {
        slideApi.addNewSlide({preId: preId, slideType: 1, title: 'Multiple choice'})
            .then((resp) => {
                if (resp.data) {
                    listSlide.push(resp.data);
                    setListSlide([...listSlide]);
                    setChoosenSlideId(listSlide.at(-1).id);
                    setIsEmtyList(false);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onChoosenSlideClick = (slide) => {
        if (slide) setChoosenSlideId(slide.id);
    };

    const onChangeValueOnRightOption = () => {
        setStateChange(!stateChange);
    };

    const onDeleteSlideClick = () => {
        slideApi.deleteSlide({slideId: choosenSlideId})
            .then((resp) => {
                const deleteSlide = resp.data;
                const indexDeleteSlide = listSlide.findIndex(slide => slide.id == deleteSlide.id);
                const listSlideAfterDelete = listSlide.filter(slide => slide.id != deleteSlide.id);
                setListSlide([...listSlideAfterDelete]);

                let choosenSlideAfterDelete = {};
                if (listSlideAfterDelete.length > 0) {
                    choosenSlideAfterDelete = listSlideAfterDelete[(indexDeleteSlide == 0) ? 0 : indexDeleteSlide - 1];
                }
                if (listSlideAfterDelete.length == 0) setIsEmtyList(true);
                setChoosenSlideId(choosenSlideAfterDelete.id);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [isChooseGroupToSlideModal, setIsChooseGroupToSlideModal] = useState(false);
    const [listGroup, setListGroup] = useState([]);
    const onGroupSelectModalOpen = () => {
        setIsChooseGroupToSlideModal(true);
        groupApi.getMyGroup()
            .then(resp => {
                const listGroupTmp = resp?.data
                    .filter(groupData => groupData.roleUserInGroup == role_user.owner || groupData.roleUserInGroup == role_user.coOwner)
                    .map(
                        groupData => groupData.group
                    );
                console.log(listGroupTmp);
                setListGroup(listGroupTmp);
            })
    }

    const [selectedGroup, setSelectedGroup] = useState("");
    const handleGroupSelectChange = (event) => {
        console.log(event.target.value);
        setSelectedGroup(event.target.value);
    }

    const presenting = usePresentingApi()
    const onPresentingBtnClick = () => {
        presenting.presentForGroup(
            {
                "presentationId" : preId,
                "groupId" : selectedGroup
            }
        )
            .then((resp) => {
                navigate(`/presenting/${resp.data.id}`);
            })
    }

    const [pageFinish, setPageFinish] = useState(0);
    const loadSlideShowFinish = () => {
        setPageFinish(pageFinish + 1);
    }

    const loadSlideEditFinish = () => {
        setIsLoading(false);
    }


    return (
        <>
            {
                isLoading &&
                <div className={'h-100'}>
                    <Loading/>
                </div>
            }
            <Container hidden={isLoading} fluid className='h-100'>
                        {/*Nav Bar*/}
                        <Row>
                            <Container id='custom-navbar'>
                                <Navbar expand='lg' variant='light' bg='light'>
                                    {/*<Navbar.Brand href="#">Navbar</Navbar.Brand>*/}
                                    <Navbar.Toggle aria-controls='responsive-navbar-nav'/>
                                    <Navbar.Collapse id='responsive-navbar-nav'>
                                        <Nav className='me-auto'>
                                            <div className='d-flex align-items-center me-2'
                                                 onClick={() => navigate('/presentation')}>
                                                <FontAwesomeIcon icon={faArrowLeft} style={{cursor: 'pointer'}}
                                                                 className='p-2 align-middle'/>
                                            </div>
                                            <div className='d-flex flex-column'>
                                                <b>{}</b>
                                                <span className='m-0 text-secondary'>Created by Hao Su</span>
                                            </div>
                                        </Nav>
                                        <Nav>
                                            <Button variant='primary' onClick={() => onGroupSelectModalOpen()}>
                                                <FontAwesomeIcon className={'me-2'} icon={faCaretRight} size={'xl'}/>
                                                <span>Present</span>
                                            </Button>
                                        </Nav>
                                    </Navbar.Collapse>
                                </Navbar>
                            </Container>
                        </Row>
                        {/*utilities (Add slide, delete slide,...)*/}
                        <Row style={{
                            backgroundColor: 'white',
                            borderBottom: '2px solid rgb(231, 232, 235)',
                            padding: '8px 16px 8px 16px'
                        }}>
                            <Col className='d-flex flex-row justify-content-between'>
                                <div>
                                    <Button variant={'primary'} onClick={() => onAddNewSlideClick()}>
                                        <FontAwesomeIcon className={'me-2'} icon={faPlus}/>
                                        <span>New slide</span>
                                    </Button>
                                    <Button variant={'danger'} onClick={() => onDeleteSlideClick()} className='ms-2'>
                                        <FontAwesomeIcon className={'me-2'} icon={faTrash}/>
                                        <span>Delete slide</span>
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                        {/*Slide Show*/}
                        <Row className='content-wapper'>
                            <Col id='left-pane' className='p-0' xs={2}>
                                <SlideWindow listSlide={listSlide} slideId={choosenSlideId} onChoosenSlide={onChoosenSlideClick}/>
                            </Col>
                            <Col id='center-pane' xs={7}>
                                <SlideShow slideId={choosenSlideId} stateChange={stateChange} isEmtyList={isEmtyList}
                                           onHavingData={loadSlideShowFinish}/>
                            </Col>
                            <Col id='right-pane' xs={3}>
                                <SlideEdit slideId={choosenSlideId} changeValue={onChangeValueOnRightOption}
                                           onHavingData={loadSlideEditFinish}/>
                            </Col>
                        </Row>

                        <Modal show={isChooseGroupToSlideModal} onHide={() => setIsChooseGroupToSlideModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Presenting</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form.Select aria-label="Default select example" onChange={handleGroupSelectChange}>
                                    <option value="" disabled selected>Choose a group to present</option>
                                    {
                                        listGroup.map(group => <option key={group.id} value={group.id}>{group.groupName}</option> )
                                    }
                                </Form.Select>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant='secondary' onClick={() => setIsChooseGroupToSlideModal(false)}>
                                    Close
                                </Button>
                                <Button type={'submit'} variant='primary' onClick={onPresentingBtnClick}>
                                    Present
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </Container>
        </>
    );
};

export default PresentationDetail;
