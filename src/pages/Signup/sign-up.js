import "./sign-up.css";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useNavigate} from "react-router";
import useAxios from "../../hooks/useAxios";
import {Button, Col, Row, Spinner} from "react-bootstrap";
import {useState} from "react";
import {BACKEND_URL, ROOT_URL} from "../../constant/common.const";
import {Link} from "react-router-dom";

const schema = yup
    .object({
        username: yup.string().max(16).min(6).required(),
        fullName: yup
            .string()
            .max(32, "Full name is too long")
            .required("full name is required"),
        password: yup.string().max(16).min(6).required(),
        emailAddress: yup.string().email().required(),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("password"), null], "Password doesn't match"),
    })
    .required();

function Signup() {
    const {
        register, getValues, handleSubmit, formState: {errors},
    } = useForm({
        resolver: yupResolver(schema),
    });
    const navigate = useNavigate();
    const axios = useAxios();
    const [loadingButton, setLoadingButton] = useState(false);
    const [isRegistereSuccess, setIsRegistereSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    ;

    const onSubmit = (data) => {
        setLoadingButton(true);
        setErrorMsg("");
        axios.post('/auth/register', data)
            .then(res => {
                if (res.status == 200) {
                    // redirect to login page
                    setLoadingButton(false);
                    setIsRegistereSuccess(true);
                    // navigate('/login');

                }
                console.log(res);
            })
            .catch(err => {
                console.log(err.response.data.message);
                setErrorMsg(err.response.data.message);
                setLoadingButton(false);
            })
    };

    const onResendClickBtn = () => {
        axios.get(`/auth/resend/activate/${getValues('username')}`);
    }

    return (
        <div className='outer'>

            {/*<form action="" hidden={isRegistereSuccess} onSubmit={handleSubmit(onSubmit)}>*/}
            {/*    <h3>Sign up</h3>*/}
            {/*    <p className='text-danger'>{errorMsg}</p>*/}
            {/*    <div className="btn-wapper">*/}
            {/*        <button*/}
            {/*            type="submit"*/}
            {/*            className="signup-button"*/}
            {/*            disabled={loadingButton}*/}
            {/*            // onClick={(e) => handleSubmit(onHandleSubmit())}*/}
            {/*        >*/}
            {/*            <Spinner*/}
            {/*                size='sm'*/}
            {/*                animation='border'*/}
            {/*                role='status'*/}
            {/*                aria-hidden='false'*/}
            {/*                className='spinner'*/}
            {/*                hidden={!loadingButton}/>*/}
            {/*            Sign up*/}
            {/*        </button>*/}
            {/*    </div>*/}

            {/*    /!* <p className="forgot-password text-right">*/}
            {/*                Forgot <a href="#">password?</a>*/}
            {/*            </p> *!/*/}
            {/*</form>*/}




            <div className='inner'>
                <form action='' onSubmit={handleSubmit(onSubmit)}
                      hidden={isRegistereSuccess}
                      style={{maxWidth: '568px', width: '100%'}}>
                    <h1 className='text-center'>Create a free account</h1>
                    <div style={{marginLeft: '104px', marginRight: '104px'}}
                         className='mt-5'>
                        <div className="d-grid gap-2 mt-4">
                            <Button href={`${BACKEND_URL}/oauth2/authorization/google`}
                                    variant='outline-secondary'>
                                <img
                                    src={'https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png'}
                                    style={{width: '25px', height: '25px', marginBottom: '3px'}}/>

                                <span className='ms-2'>Log in with Google</span>
                            </Button>
                        </div>

                        <p className='mt-5 mb-2 text-center text-secondary'>or using account</p>

                        <div className="form-group">
                            <label>
                                <b className='text-black'>
                                    Full Name
                                </b>
                            </label>
                            <input
                                id="full-name"
                                type="text"
                                className="form-control"
                                placeholder="Your name"
                                {...register("fullName")}
                                // onChange={(e) => handleUserChange(e)}
                            />
                            <span style={{color: "red"}}>{errors.fullname?.message}</span>
                        </div>
                        <div className="form-group">
                            <label>
                                <b className='text-black'>
                                    Email
                                </b>
                            </label>
                            <input
                                id="emailAddress"
                                type="email"
                                className="form-control"
                                placeholder="Your email"
                                {...register("emailAddress")}
                                // onChange={(e) => handleUserChange(e)}
                            />
                            <span style={{color: "red"}}>{errors.email?.message}</span>
                        </div>
                        <div className="form-group">
                            <label>
                                <b className='text-black '>
                                    Username
                                </b>
                            </label>
                            <input
                                id="username"
                                type="text"
                                className="form-control"
                                placeholder="Username"
                                {...register("username")}
                                // onChange={(e) => handleUserChange(e)}
                            />
                            <span style={{color: "red"}}>{errors.username?.message}</span>
                        </div>
                        <div className="form-group">
                            <label>
                                <b className='text-black'>
                                    Password
                                </b>
                            </label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Enter password"
                                {...register("password")}
                                // onChange={(e) => handleUserChange(e)}
                            />
                            <span style={{color: "red"}}>{errors.password?.message}</span>
                        </div>
                        <div className="form-group">
                            <label>
                                <b className='text-black'>
                                    Confirm Password
                                </b>
                            </label>
                            <input
                                id="confirm-password"
                                type="password"
                                className="form-control"
                                placeholder="Enter password again"
                                {...register("confirmPassword")}
                                // onChange={(e) => handleUserChange(e)}
                            />
                            <span style={{color: "red"}}>{errors.confirmPassword?.message}</span>
                        </div>
                        <p className='text-danger text-end mb-0 mt-3'>{errorMsg}</p>
                        <div className="d-grid gap-2 mt-1" style={{padding: '5px'}}>
                            <Button variant='primary' type='submit'
                                    disabled={loadingButton}>
                                <Spinner size='sm' animation='border' role='status' aria-hidden='false'
                                         className='spinner'
                                         hidden={!loadingButton}/>
                                <span className='ms-2'>Sign up</span>
                            </Button>
                        </div>
                        {/*<p className='text-right text-danger' hidden={!authenInvalid}>*/}
                        {/*    {errorMsg}*/}
                        {/*</p>*/}
                    </div>
                    <p className='text-center'>
                        <span style={{color: 'rgba(16, 24, 52, 0.75)', fontSize: '20px'}}>
                            Already have an account ?
                        </span>
                        <Link to='/login' className='text-decoration-none ms-2 text-primary'
                              style={{fontSize: '20px'}}>
                            Login
                        </Link>

                    </p>
                </form>

                <div style={{maxWidth : '568px', width : '100%'}}
                     hidden={!isRegistereSuccess}>
                    <h1 className='text-center'>Verify account by Gmail</h1>
                    <div style={{marginLeft : '104px', marginRight : '104px'}}
                         className='mt-5'>
                        <p >Please access your gmail : "{getValues('emailAddress')}" and click links
                            to activate your
                            account</p>
                        <p>
                            If you don't receive any mail from us, please click "Resend" button
                        </p>
                        <Row>
                            <Col>
                                <Button variant="outline-primary" onClick={() => navigate('/login')}>login</Button>
                            </Col>
                            <Col>
                                <Button variant="primary" onClick={() => onResendClickBtn()}>Resend</Button>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>


        </div>

    );
}

export default Signup;
