import './presentation.css';
import { Button, Col, Container, Dropdown, Form, ListGroup, Modal, Nav, Navbar, NavDropdown, Row, Table } from 'react-bootstrap';
import { CaretRightSquareFill } from 'react-bootstrap-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useAxios from '../../hooks/useAxios';
import PresentationModel from '../../models/presentation.model';
import { useNavigate } from 'react-router';

const schema = yup
    .object({
        namePresentation: yup.string().max(32, 'Full name is too long !!').min(1, "Presentation's name must not be empty !!"),
        nameEditPresentation: yup.string().max(32, 'Full name is too long !!').min(1, "Presentation's name must not be empty !!"),
    })
    .required();

const Presentation = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const axios = useAxios();
    const navigate = useNavigate();
    const [isPresentationModalShow, setIsPresentationModalShow] = useState(false);
    const [isPresentationDeleteModalShow, setIsPresentationDeleteModalShow] = useState(false);
    const [isPresentationEditModalShow, setIsPresentationEditModalShow] = useState(false);
    const [choosenPresentation, setChoosenPresentation] = useState(null);
    const [presentationList, setPresentationList] = useState([]);

    const reloadData = () => {
        axios.get('/api/v1/presentation').then((resp) => {
            setPresentationList(resp.data);
        });
    };

    useEffect(() => {
        reloadData();
    }, []);

    const onSubmit = (presentationFormData) => {
        setIsPresentationModalShow(false);
        axios
            .post('/api/v1/presentation/add', { presentationName: presentationFormData.namePresentation, createdTime: '' + Date.now() })
            .then((resp) => {
                reloadData();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onEditSubmit = (formData) => {
        axios
            .post(`/api/v1/presentation/edit/${choosenPresentation?.id}`, { presentationName: formData.nameEditPresentation, editTime: '' + Date.now() })
            .then((resp) => {
                reloadData();
                setIsPresentationEditModalShow(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onDeleteDropDownClick = (presentation) => {
        setChoosenPresentation(presentation);
        setIsPresentationDeleteModalShow(true);
    };

    const onEditDropDownClick = (presentation) => {
        setChoosenPresentation(presentation);
        setIsPresentationEditModalShow(true);
    };

    const onDeletePresentationClick = (presentation) => {
        axios
            .post('/api/v1/presentation/delete', { preId: presentation.id })
            .then((resp) => {
                reloadData();
                setIsPresentationDeleteModalShow(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <Container fluid>
            {/*Nav bar*/}
            <Row>
                <Container id='custom-navbar'>
                    <Navbar expand='lg' variant='light' bg='light'>
                        <Navbar.Brand href='#'>Navbar</Navbar.Brand>
                        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
                        <Navbar.Collapse id='responsive-navbar-nav'>
                            <Nav className='me-auto'></Nav>
                            <Nav>
                                <NavDropdown title='Dropdown' id='collasible-nav-dropdown' align='end'>
                                    <NavDropdown.Item href='#action/3.1'>Action</NavDropdown.Item>
                                    <NavDropdown.Item href='#action/3.2'>Another action</NavDropdown.Item>
                                    <NavDropdown.Item href='#action/3.3'>Something</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href='#action/3.4'>Separated link</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </Container>
            </Row>
            {/*Content*/}
            <Row className='h-100'>
                {/*Left Menu*/}
                <Col xs={2} id='left-side' className='p-0'>
                    <ListGroup>
                        <ListGroup.Item action className='border-0 text-start'>
                            Group
                        </ListGroup.Item>
                        <ListGroup.Item action className='border-0 text-start'>
                            PresentationDetail
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                {/*Content*/}
                <Col id='right-side'>
                    <p className='text-start'>My PresentationDetail</p>
                    <div className='d-flex flex-row justify-content-between me-5' style={{ marginTop: '32px', marginBottom: '32px' }}>
                        <Button className='me-4' onClick={() => setIsPresentationModalShow(true)}>
                            New Presentation
                        </Button>
                    </div>
                    <div>
                        <Table hover>
                            <thead>
                                <tr>
                                    <th className='text-start'>
                                        <input type='checkbox' className='custom-checkbox' />
                                    </th>
                                    <th className='text-start'>Name</th>
                                    <th className='text-start'>Owner</th>
                                    <th className='text-start'>Modified</th>
                                    <th className='text-start'>Created</th>
                                    <th className='text-start'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {presentationList.map((presentation, index) => (
                                    <tr className='row-table text-start' key={index}>
                                        <td></td>
                                        <td onClick={() => navigate(`./${presentation.id}`)}>
                                            <div className='d-flex flex-row align-items-center'>
                                                <CaretRightSquareFill className='rounded-circle' size='24'></CaretRightSquareFill>
                                                <div className='d-flex flex-column'>
                                                    <span className='text-dark' style={{ cursor: 'pointer' }}>
                                                        {presentation.name}
                                                    </span>
                                                    <span className='text-secondary'>1 slide</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='text-secondary align-middle' onClick={() => navigate(`./${presentation.id}`)}>
                                            {presentation?.user?.username}
                                        </td>
                                        <td className='text-secondary align-middle' onClick={() => navigate(`./${presentation.id}`)}>
                                            {presentation?.modifiedTime}
                                        </td>
                                        <td className='text-secondary align-middle' onClick={() => navigate(`./${presentation.id}`)}>
                                            {presentation?.createdTime}
                                        </td>
                                        <td className='align-items-center'>
                                            <Dropdown className='m-auto'>
                                                <Dropdown.Toggle id='dropdown-basic' className='icon-button'>
                                                    <FontAwesomeIcon size='xl' color='black' icon={faEllipsisH}></FontAwesomeIcon>
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={() => onEditDropDownClick(presentation)}>Edit</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => onDeleteDropDownClick(presentation)}>Delete</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                            {/*<Button className='icon-button'>*/}
                                            {/*</Button>*/}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row>

            {/*Add more presentation */}
            <Modal show={isPresentationModalShow} onHide={() => setIsPresentationModalShow(false)}>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add new presentation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Control id='name-presentation' type='text' placeholder='PresentationDetail name' {...register('namePresentation')} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='secondary' onClick={() => setIsPresentationModalShow(false)}>
                            Close
                        </Button>
                        <Button type={'submit'} variant='primary'>
                            Create presentation
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            {/*Delete Presentation*/}
            <Modal show={isPresentationDeleteModalShow} onHide={() => setIsPresentationDeleteModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete "{choosenPresentation?.name}"</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className='text-secondary'>This will permanently delete "{choosenPresentation?.name}" and any results.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='outline-secondary' onClick={() => setIsPresentationDeleteModalShow(false)}>
                        Close
                    </Button>
                    <Button type={'submit'} onClick={() => onDeletePresentationClick(choosenPresentation)} variant='danger'>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
            {/*Rename*/}
            <Modal show={isPresentationEditModalShow} onHide={() => setIsPresentationEditModalShow(false)}>
                <Form onSubmit={handleSubmit(onEditSubmit)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Rename {choosenPresentation?.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Control id='name-presentation' type='text' placeholder='PresentationDetail name' {...register('nameEditPresentation')} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='outline-secondary' onClick={() => setIsPresentationEditModalShow(false)}>
                            Close
                        </Button>
                        <Button type={'submit'} variant='primary'>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default Presentation;
