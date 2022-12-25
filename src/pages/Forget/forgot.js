import './forgot.css';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {Alert, Button, Spinner} from 'react-bootstrap';
import {useNavigate} from "react-router";
import {useState} from "react";
import useAccountApi from "../../api/useAccountApi";

const schema = yup.object({
    email: yup.string().email().required('Email is required'),
});

function Forgot() {
    const {
        register,
        getValues,
        handleSubmit,
        formState : {errors}
    } = useForm({
        resolver: yupResolver(schema),
    });
    const navigate = useNavigate();
    const [isResent, setIsResent] = useState(false);
    const [errShow, setErrShow] = useState(false);
    const accountApi = useAccountApi();
    const onResetPasswordClick = () => {
        console.log(errors);
    }

    const onSubmit = () => {
        const emailAddress = getValues().email;
        accountApi.forgotPassword({"emailAddress" : emailAddress})
            .then(() => {
                setIsResent(true);
            })
            .catch((err) => {
                setIsResent(false);
                setErrShow(true);
            })
    }

    return (
        <div className='outer'>
            <div style={{maxWidth: '600px', width: '100%'}}
                 className='h-100 d-flex align-items-center'>
                <div className='inner '>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div style={{marginLeft : '90px', marginRight : '90px'}}>
                            <h1 className='text-center mb-4' hidden={isResent}>Reset Password</h1>
                            <h1 className='text-center mb-4' hidden={!isResent}>Email sent</h1>
                            <p className='text-center text-secondary' hidden={!isResent}>Check your email and continue by clicking the link received</p>
                            <div className='form-group p-0' hidden={isResent}>
                                <label><b className='text-black'>Your email</b></label>
                                <input
                                    id='email'
                                    type='email'
                                    className='form-control'
                                    placeholder='Enter email'
                                    {...register('email')}
                                />
                                {errors.email && <span style={{color: 'red'}}>{errors.email?.message}</span>}
                            </div>

                            <div className="d-grid gap-2 mt-1" >
                                <Button variant='outline-primary' hidden={isResent}
                                        onClick={() => navigate('/login')}>
                                    <span className='ms-2'>Back to Login</span>
                                </Button>
                            </div>

                            <div className="d-grid gap-2 mt-1" >
                                <Button
                                    hidden={isResent}
                                        type={'submit'}
                                        variant='primary'>
                                    <span className='ms-2'>Reset password</span>
                                </Button>
                            </div>
                            <Alert className={'mt-2'} variant={"danger"} hidden={!errShow}>
                                This provided email is not registered - perhaps you use another email address?
                            </Alert>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Forgot;
