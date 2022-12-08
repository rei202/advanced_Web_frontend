import * as yup from 'yup';
import { Modal, Button, Form, Card } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import useAxios from '../../../hooks/useAxios';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
const schema = yup
    .object({
        // webLink: yup.string().max(12, 'Group name must be at most 12 characters').min(6, 'Group name must be at least 6 characters').required(),
        email: yup.string().email().required(),
    })
    .required();

function CreLinkCenteredModal(props) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [textLink, setTextLink] = useState('');
    const axios = useAxios();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
            axios
                .get('/api/group/link/' + searchParams.get('id'))
                .then((res) => {
                    setTextLink(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
    }, []);

    const onSubmitData = (data) => {
        axios
            .post('/api/group/2', data)
            .then((res) => {
                console.log(res);
                props.handler(res.data);
                props.onHide();
            })
            .catch((err) => console.log(err));
    };
    return (
        <Modal show={props.show} onHide={props.onHide} size='md' aria-labelledby='contained-modal-title-vcenter' centered>
            <Modal.Header closeButton>
                <Modal.Title id='contained-modal-title-vcenter'>Generate inviting link</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit(onSubmitData)}>
                <Modal.Body>
                    <Form.Label>Link</Form.Label>

                    <Card body>{textLink}</Card>
                    <Form.Group className='mb-3' controlId='exampleForm.ControlTextarea1'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control as='input' {...register('email')} autoFocus />
                        <span style={{ color: 'red' }}>{errors.email?.message}</span>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={props.onHide}>
                        Close
                    </Button>
                    <Button type='Invite' variant='primary'>
                        Submit
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default CreLinkCenteredModal;
