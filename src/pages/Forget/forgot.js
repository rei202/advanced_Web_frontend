import './forgot.css';
import {Link, useSearchParams} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {Button, Spinner} from 'react-bootstrap';
import {ROOT_URL} from "../../constant/common.const";
import {useNavigate} from "react-router";

const schema = yup
    .object({
        username: yup.string().max(16).min(6).required(),
        password: yup.string().max(16).min(6).required(),
    })
    .required();

function Forgot() {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(schema),
    });
    const navigate = useNavigate();

    return (
        <div className='outer'>
            <div style={{maxWidth: '568px', width: '100%'}}
                 className='h-100 d-flex align-items-center'>
                <div className='inner '>
                    <div style={{marginLeft : '104px', marginRight : '104px'}}>
                        <h1 className='text-center mb-4'>Reset Password</h1>
                        <div className='form-group p-0'>
                            <label><b className='text-black'>Your email</b></label>
                            <input
                                id='email'
                                type='email'
                                className='form-control'
                                placeholder='Enter email'
                                {...register('email')}
                            />
                            <span style={{color: 'red'}}>{errors.password?.message}</span>
                        </div>

                        <div className="d-grid gap-2 mt-1">
                            <Button variant='outline-primary'
                                    onClick={() => navigate('/login')}>
                                <span className='ms-2'>Login</span>
                            </Button>
                        </div>

                        <div className="d-grid gap-2 mt-1">
                            <Button href={`${ROOT_URL}/oauth2/authorization/google`}
                                    variant='primary'>
                                <span className='ms-2'>Reset password</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Forgot;
