import * as yup from 'yup';
import { Modal, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import useAxios from '../../../hooks/useAxios';
import { yupResolver } from '@hookform/resolvers/yup';
const schema = yup
    .object({
        groupName: yup.string().max(20, 'Group name must be at most 20 characters').min(6, 'Group name must be at least 6 characters').required(),
        description: yup.string().max(32, 'Description must be at most 32 characters').min(6, 'Description must be at least 6 characters').required(),
    })
    .required();

function CreGroupCenteredModal(props) {
    const axios = useAxios();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
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
                <Modal.Title id='contained-modal-title-vcenter'>Creating Group</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit(onSubmitData)}>
                <Modal.Body>
                    <Form.Group className='mb-3' controlId='exampleForm.ControlInput1'>
                        <Form.Label>Group Name</Form.Label>
                        <Form.Control type='text' placeholder='example Group' autoFocus {...register('groupName')} />
                        <span style={{ color: 'red' }}>{errors.groupName?.message}</span>
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='exampleForm.ControlTextarea1'>
                        <Form.Label>Description</Form.Label>
                        <Form.Control as='textarea' rows={2} {...register('description')} />
                        <span style={{ color: 'red' }}>{errors.description?.message}</span>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={props.onHide}>
                        Close
                    </Button>
                    <Button type='submit' variant='primary'>
                        Submit
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default CreGroupCenteredModal;
