import './login.css';
import {Link, useSearchParams} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFacebook, faGoogle} from '@fortawesome/free-brands-svg-icons';
import useAxios from '../../hooks/useAxios';
import {Navigate, useNavigate} from 'react-router';
import {useState} from 'react';
import {Button, Spinner} from 'react-bootstrap';
import {ROOT_URL} from "../../constant/common.const";
import {Image, Images} from "react-bootstrap-icons";

const schema = yup
    .object({
        username: yup.string().max(16).min(6).required(),
        password: yup.string().max(16).min(6).required(),
    })
    .required();

function Login() {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(schema),
    });
    const axios = useAxios();
    const navigate = useNavigate();
    const [loadingButton, setLoadingButton] = useState(false);
    const [authenInvalid, setAuthenInvalid] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    const onSubmit = (data) => {
        setLoadingButton(true);
        setAuthenInvalid(false);
        axios
            .post('/auth/signin', data)
            .then((resp) => {
                if (resp.data.jwttoken) {
                    localStorage.setItem('token', resp.data.jwttoken);
                    localStorage.setItem('username', resp.data.username);
                    const group_id = localStorage.getItem('group_id');
                    if (group_id) {
                        navigate(`/invite/${group_id}`);
                    } else navigate('/presentation');
                    // Check duoc url hien tai la gi ? => Biet duoc co redirect_url hay khong ?
                    // Neu nhu co, request theo thang redirect_url

                    // if (searchParams.get('redirect_url') === null) {
                    //     navigate('/profile');
                    // } else {
                    //     axios
                    //         .get(searchParams.get('redirect_url'))
                    //         .then((res) => {
                    //             console.log(res.data);
                    //         })
                    //         .catch((err) => console.log(err));
                    // }
                } else setAuthenInvalid(true);
            })
            .catch((err) => {
                setErrorMsg(err.response.data);
                setAuthenInvalid(true);
            })
            .finally(() => {
                setLoadingButton(false);
            });
    };

    const onGmailIconClick = () => {
        axios
            .get('/oauth2/authorization/google')
            .then((resp) => {
                console.log(resp);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className='outer'>
            <form action='' onSubmit={handleSubmit(onSubmit)}
                  style={{maxWidth: '568px', width: '100%'}}>
                <div className='inner'>
                    <h1 className='text-center'>Welcome back!</h1>
                    <p className='text-center text-secondary'>Log in to your Mentimeter account</p>
                    <div style={{marginLeft : '104px', marginRight : '104px'}}>
                        <div className="d-grid gap-2 mt-4">
                            <Button href={`${ROOT_URL}/oauth2/authorization/google`}
                                    variant='outline-secondary' >
                                <img src={'https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png'}
                                     style={{width : '25px', height : '25px', marginBottom : '3px'}}/>

                                <span className='ms-2'>Log in with Google</span>
                            </Button>
                        </div>

                        <p className='mt-5 mb-2 text-center text-secondary'>or using account</p>

                        <div className='form-group mb-2'>
                            <label><b className='text-black'>Username</b></label>
                            <input
                                id='username'
                                type='text'
                                className='form-control'
                                placeholder='Username'
                                {...register('username')}
                                // onChange={(e) => handleUserChange(e)}
                            />
                            <span style={{color: 'red'}}>{errors.username?.message}</span>
                        </div>
                        <div className='form-group'>
                            <label><b className='text-black'>Password</b></label>
                            <input
                                id='password'
                                type='password'
                                className='form-control'
                                placeholder='Enter password'
                                {...register('password')}
                                // onChange={(e) => handleUserChange(e)}
                            />
                            <span style={{color: 'red'}}>{errors.password?.message}</span>
                        </div>
                        <p className='text-end'>
                            <Link to='/forgot' className='text-decoration-none ms-2 text-primary'>
                                Forgot password
                            </Link>
                        </p>

                        <div className="d-grid gap-2" style={{padding : '5px'}}>
                            <Button variant='primary' type='submit'
                                    disabled={loadingButton}>
                                <Spinner size='sm' animation='border' role='status' aria-hidden='false' className='spinner'
                                         hidden={!loadingButton}/>
                                <span className='ms-2'>Log in</span>
                            </Button>
                        </div>
                        <p className='text-right text-danger' hidden={!authenInvalid}>
                            {errorMsg}
                        </p>
                    </div>
                    <p className='text-center'>
                        <span style={{color: 'rgba(16, 24, 52, 0.75)', fontSize : '20px'}}>
                            New to Mentimeter?
                        </span>
                        <Link to='/register' className='text-decoration-none ms-2 text-primary'
                              style={{fontSize : '20px'}}>
                           Sign up now
                        </Link>

                    </p>
                </div>
            </form>
        </div>
    );
}

export default Login;
