import "./Signup.css";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useNavigate} from "react-router";
import axios from "../../api/axios";
import useAxios from "../../hooks/useAxios";
import {Button, Spinner} from "react-bootstrap";
import {useState} from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
        axios.post('https://advancedwebbackend-production-1b23.up.railway.app/auth/register', data)
            .then(res => {
                if (res.status == 200) {
                    // redirect to login page
                    setLoadingButton(false);
                    setIsRegistereSuccess(true);
                    // navigate('/login');

                }
            })
            .catch(err => {
                setErrorMsg(err.response.data.message);
                setLoadingButton(false);
            })
    };

    const onResendClickBtn = () => {
        axios.get(`/auth/resend/activate/${getValues('username')}`);
    }

    return (<div className="outer">
            <div className="inner">
                <form action="" hidden={isRegistereSuccess} onSubmit={handleSubmit(onSubmit)}>
                    <h3>Sign up</h3>
                    <div className="form-group">
                        <label>Username</label>
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
                        <label>Full Name</label>
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
                        <label>Email</label>
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
                        <label>Password</label>
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
                        <label>Confirm Password</label>
                        <input
                            id="confirm-password"
                            type="password"
                            className="form-control"
                            placeholder="Enter password again"
                            {...register("confirmPassword")}
                            // onChange={(e) => handleUserChange(e)}
                        />
                        <span style={{color: "red"}}>
              {errors.confirmPassword?.message}
            </span>
                    </div>
                    <p className='text-danger'>{errorMsg}</p>
                    <div className="btn-wapper">
                        <button
                            type="submit"
                            className="signup-button"
                            disabled={loadingButton}
                            // onClick={(e) => handleSubmit(onHandleSubmit())}
                        >
                            <Spinner
                                size='sm'
                                animation='border'
                                role='status'
                                aria-hidden='false'
                                className='spinner'
                                hidden={!loadingButton}/>
                            Sign up
                        </button>
                    </div>

                    {/* <p className="forgot-password text-right">
                            Forgot <a href="#">password?</a>
                        </p> */}
                </form>
                <div hidden={!isRegistereSuccess}>
                    <p className='text-white'>Please access your gmail : "{getValues('emailAddress')}" and click links
                        to activate your
                        account</p>
                    <p className='text-white'>
                        If you don't receive any mail from us, please click "Resend" button
                    </p>
                    <Row>
                        <Col>
                            <Button variant={"info"} onClick={() => onResendClickBtn()}>Resend</Button>
                        </Col>
                        <Col>
                            <Button variant={"info"} onClick={() => navigate('/login')}>login</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>);
}

export default Signup;
