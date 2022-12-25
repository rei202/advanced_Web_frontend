import useAxios from '../../hooks/useAxios';
import { Button, Card, Col, Container, Form, Image, Row, Spinner } from 'react-bootstrap';
import './style.css';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import AccountModel from '../../models/account.model';

const schema = yup
    .object({
        fullName: yup.string().max(32, 'Full name is too long'),
        newPassword: yup.string().max(16),
        oldPassword: yup.string().max(16),
        confirmNewPassword: yup.string().oneOf([yup.ref('newPassword'), null], "Password doesn't match"),
    })
    .required();

const Profile = () => {
    const axios = useAxios();
    const [accountModel, setAccountModel] = useState(null);
    const [notSamePassword, setNotSamePassword] = useState(false);
    const [successful, setSuccessful] = useState(false);
    const [loadingButton, setLoadingButton] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
    console.log(errors);

    useEffect(() => {
        axios.get('/api/user').then((resp) => {
            if (resp.data) {
                setAccountModel(
                    new AccountModel(resp.data?.id, resp.data?.username, resp.data?.emailAddress, resp.data?.facebookId, resp.data?.image, resp.data?.fullName)
                );
                reset({
                    username: resp.data?.username,
                    emailAddress: resp.data?.emailAddress,
                    facebookId: resp.data?.facebookId,
                    image: resp.data?.image,
                    fullname: resp.data?.fullName,
                    oldPassword: '',
                    newPassword: '',
                    confirmNewPassword: '',
                });
            }
        });
    }, []);
    const onSubmit = (data) => {
        setNotSamePassword(false);
        setSuccessful(false);
        setLoadingButton(true);
        axios
            .post('/api/user/edit-profile', data)
            .then((resp) => {
                setSuccessful(true);
                reset({
                    username: resp.data?.username,
                    emailAddress: resp.data?.emailAddress,
                    facebookId: resp.data?.facebookId,
                    image: resp.data?.image,
                    fullname: resp.data?.fullName,
                    oldPassword: '',
                    newPassword: '',
                    confirmNewPassword: '',
                });
            })
            .catch((err) => {
                setNotSamePassword(true);
            })
            .finally(() => {
                setLoadingButton(false);
            });
    };

    return (
        <>
            <Container>
                <Row>
                    <Col xs={12} sm={12}>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Card className='panel panel-default'>
                                <Card.Body>
                                    <div className='text-center'>
                                        <img
                                            src='https://bootdey.com/img/Content/avatar/avatar6.png'
                                            className='rounded-circle profile-avatar'
                                            alt='User avatar'
                                        />
                                    </div>
                                </Card.Body>
                            </Card>
                            <Card className='panel'>
                                <Card.Body>
                                    <Card.Title className='panel-title'>User info</Card.Title>
                                    <Form.Group as={Row} className='mb-3'>
                                        <Form.Label column sm={3}>
                                            Username
                                        </Form.Label>
                                        <Col sm={9}>
                                            <input type='text' id='username' disabled className='form-control' {...register('username')} />
                                        </Col>
                                    </Form.Group>
                                    <span style={{ color: 'red' }}>{errors.username?.message}</span>

                                    <Form.Group as={Row} className='mb-3'>
                                        <Form.Label column sm={3}>
                                            Email Address
                                        </Form.Label>
                                        <Col sm={9}>
                                            <input type='text' id='emailAddress' disabled className='form-control' {...register('emailAddress')} />
                                        </Col>
                                    </Form.Group>
                                    <span style={{ color: 'red' }}>{errors.emailAddress?.message}</span>

                                    <Form.Group as={Row} className='mb-3'>
                                        <Form.Label column sm={3}>
                                            Full Name
                                        </Form.Label>
                                        <Col sm={9}>
                                            <input type='text' id='fullname' className='form-control' {...register('fullname')} />
                                        </Col>
                                    </Form.Group>
                                    <span style={{ color: 'red' }}>{errors.fullName?.message}</span>
                                </Card.Body>
                            </Card>
                            <Card className='panel panel-default'>
                                <Card.Body>
                                    <Card.Title className='panel-title'>Security</Card.Title>
                                    <Card.Text>
                                        <Form.Group as={Row} className='mb-3'>
                                            <Form.Label column sm={3}>
                                                Current password
                                            </Form.Label>
                                            <Col sm={9}>
                                                <input type='password' id='oldPassword' className='form-control' {...register('oldPassword')} />
                                            </Col>
                                        </Form.Group>
                                        <span style={{ color: 'red' }}>{errors.oldPassword?.message}</span>

                                        <Form.Group as={Row} className='mb-3'>
                                            <Form.Label column sm={3}>
                                                New password
                                            </Form.Label>
                                            <Col sm={9}>
                                                <input type='password' className='form-control' id='newPassword' {...register('newPassword')} />
                                            </Col>
                                        </Form.Group>
                                        <span style={{ color: 'red' }}>{errors.newPassword?.message}</span>

                                        <Form.Group as={Row} className='mb-3'>
                                            <Form.Label column sm={3}>
                                                Confirm new password
                                            </Form.Label>
                                            <Col sm={9}>
                                                <input type='password' className='form-control' id='confirmNewPassword' {...register('confirmNewPassword')} />
                                            </Col>
                                        </Form.Group>
                                        <span style={{ color: 'red' }}>{errors.confirmNewPassword?.message}</span>

                                        <Form.Group as={Row} className='mb-3'>
                                            <Col sm={{ span: 10, offset: 2 }} className='text-left'>
                                                <Button disabled={loadingButton} className='ms-5' type={'submit'} variant='primary'>
                                                    <Spinner
                                                        size='sm'
                                                        animation='border'
                                                        role='status'
                                                        aria-hidden='false'
                                                        className='spinner'
                                                        hidden={!loadingButton}
                                                    />
                                                    Submit
                                                </Button>
                                            </Col>
                                        </Form.Group>
                                        <span style={{ color: 'red' }} hidden={!notSamePassword}>
                                            Old password is not correct !!
                                        </span>

                                        <span style={{ color: 'green' }} hidden={!successful}>
                                            Edit profile successfully !!
                                        </span>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Profile;
