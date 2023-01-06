import './presentation.css';
import { Button, Dropdown, Form, Modal, Table } from 'react-bootstrap';
import { CaretRightSquareFill } from 'react-bootstrap-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEllipsisH, faPencil, faPlus, faTrash} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useAxios from '../../hooks/useAxios';
import { useNavigate } from 'react-router';
import usePresentationApi from '../../api/usePresentationApi';
import handleConvertTime from '../../utils/time-converter';

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
    const [choosenPresentation, setChoosenPresentation] = useState();
    const [presentationList, setPresentationList] = useState([]);

    const presentationApi = usePresentationApi();
    const reloadData = () => {
        presentationApi.getListPresentation().then((resp) => {
            console.log(resp.data);
            setPresentationList(resp.data);
        });
    };

    useEffect(() => {
        reloadData();
    }, []);

    const onSubmit = (presentationFormData: any) => {
        setIsPresentationModalShow(false);
        presentationApi
            .addNewPresentation({
                presentationName: presentationFormData.namePresentation,
                createdTime: '' + Date.now(),
            })
            .then((resp) => {
                reloadData();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onEditSubmit = (formData: any) => {
        presentationApi
            .editPresentation(choosenPresentation?.id, {
                presentationName: formData.nameEditPresentation,
                editTime: '' + Date.now(),
            })
            .then((resp) => {
                reloadData();
                setIsPresentationEditModalShow(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onDeleteDropDownClick = (presentation: any) => {
        setChoosenPresentation(presentation);
        setIsPresentationDeleteModalShow(true);
    };

    const onEditDropDownClick = (presentation: any) => {
        setChoosenPresentation(presentation);
        setIsPresentationEditModalShow(true);
    };

    const onDeletePresentationClick = (presentation: any) => {
        presentationApi
            .deletePresentation({ preId: presentation.id })
            .then((resp) => {
                reloadData();
                setIsPresentationDeleteModalShow(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <p className='text-start'>My Presentations</p>
            <div className='d-flex flex-row justify-content-between me-5' style={{ marginTop: '32px', marginBottom: '32px' }}>
                <Button className='me-4' onClick={() => setIsPresentationModalShow(true)}>
                    <FontAwesomeIcon icon={faPlus} className='me-2' />
                    New Presentation
                </Button>
            </div>
            <div>
                <Table hover>
                    <thead>
                        <tr>
                            <th className='text-start'>Name</th>
                            <th className='text-start'>Owner</th>
                            <th className='text-start'>Modified</th>
                            <th className='text-start'>Created</th>
                            <th className='text-start'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {presentationList.map((presentation: any, index) => (
                            <tr className='row-table text-start' key={index}>
                                <td>
                                    <div className='d-flex flex-row align-items-center'>
                                        <CaretRightSquareFill
                                            className='rounded-circle me-3 present-icon'
                                            size='24'
                                            onClick={() => navigate(`/presentation/${presentation.id}/present`)}
                                        ></CaretRightSquareFill>
                                        <div className='d-flex flex-column'>
                                            <span className='text-dark' style={{ cursor: 'pointer' }} onClick={() => navigate(`./${presentation.id}`)}>
                                                {presentation.name}
                                            </span>
                                            <span className='text-secondary'>1 slide</span>
                                        </div>
                                    </div>
                                </td>
                                <td className='text-secondary' style={{ verticalAlign: 'middle' }}>
                                    {presentation?.user?.username}
                                </td>

                                <td className='text-secondary' style={{ verticalAlign: 'middle' }}>
                                    {handleConvertTime(presentation?.modifiedTime)}
                                </td>

                                <td className='text-secondary' style={{ verticalAlign: 'middle' }}>
                                    {handleConvertTime(presentation?.createdTime)}
                                </td>
                                <td style={{ verticalAlign: 'middle' }}>
                                    <Dropdown>
                                        <Dropdown.Toggle id='dropdown-basic' className='icon-button'>
                                            <FontAwesomeIcon size='xl' color='black' icon={faEllipsisH}></FontAwesomeIcon>
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => onEditDropDownClick(presentation)}>
                                                <FontAwesomeIcon icon={faPencil} size='1x' className='me-2'></FontAwesomeIcon>
                                                Edit
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => onDeleteDropDownClick(presentation)}>
                                                <FontAwesomeIcon icon={faTrash} size='1x' className='me-2'></FontAwesomeIcon>
                                                Delete
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
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
        </>
    );
};

export default Presentation;
