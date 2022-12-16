import './login.css';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import useAxios from '../../hooks/useAxios';
import { Navigate, useNavigate } from 'react-router';
import { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import googleIcon from '../../assets/images/google.png';

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
        formState: { errors },
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
            <div className='inner'>
                <form action='' onSubmit={handleSubmit(onSubmit)}>
                    <h3>Log in</h3>

                    <div className='form-group'>
                        <label style={{ color: 'black' }}>Username</label>
                        <input
                            id='username'
                            type='text'
                            className='form-control'
                            placeholder='Username'
                            {...register('username')}
                            // onChange={(e) => handleUserChange(e)}
                        />
                        <span style={{ color: 'red' }}>{errors.username?.message}</span>
                    </div>
                    <div className='form-group'>
                        <label style={{ color: 'black' }}>Password</label>
                        <input
                            id='password'
                            type='password'
                            className='form-control'
                            placeholder='Enter password'
                            {...register('password')}
                            // onChange={(e) => handleUserChange(e)}
                        />
                        <span style={{ color: 'red' }}>{errors.password?.message}</span>
                    </div>
                    {/* <div className="form-group">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customCheck1"
              />
              <label className="custom-control-label" htmlFor="customCheck1">
                Remember me
              </label>
            </div>
          </div> */}
                    <div className='btn-wapper'>
                        <button
                            type='submit'
                            className='login-button'
                            style={{ width: '100%' }}
                            disabled={loadingButton}
                            // onClick={(e) => handleSubmit(onHandleSubmit())}
                        >
                            <Spinner size='sm' animation='border' role='status' aria-hidden='false' className='spinner' hidden={!loadingButton} />
                            Sign in
                        </button>
                    </div>
                    <p className='text-right text-danger' hidden={!authenInvalid}>
                        {errorMsg}
                    </p>

                    <p className='forgot-password text-right'>
                        <Link to='/register' style={{ color: 'blue' }}>Register now</Link>
                    </p>
                    <hr style={{ width: '100%' }} />
                    <div className='text-other-signin'>Sign In with Social Media</div>
                    <div className='social-media-icon-white'>
                        <a href='https://advancedwebbackend-production-1b23.up.railway.app/oauth2/authorization/google'>
                            <img id='social-icon' src={googleIcon} />
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
