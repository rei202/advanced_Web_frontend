import {useEffect, useState} from 'react';
import {Button} from "react-bootstrap";
import {useSearchParams} from "react-router-dom";

import useAccountApi from "../../api/useAccountApi";
import {useNavigate, useParams} from "react-router";


const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [successful, setSuccessful] = useState(false);
    const [title, setTitle] = useState("Reset password");
    const params = useParams();
    const username = params.id;
    const accountApi = useAccountApi();
    const navigate = useNavigate();

    const handlePasswordChange = (event) => {
        setNewPassword(event.target.value);
    }

    const onChangePassword = () => {
        if (newPassword == '') {
            setErrorPassword('your password is empty !!');
            return;
        }
        accountApi.resetPassword({username : username, password : newPassword})
            .then(resp => {
                console.log(resp);
                setTitle('Password successfully changed');
                setSuccessful(true);
            })
            .catch(err => {
                console.log(err);
            })

    }

    const formElement = () => {
        return (
            <>
                <p className='text-secondary text-center'>Please enter your new password</p>
                <div className='form-group p-0'>
                    <label><b className='text-black'>Your password</b></label>
                    <input
                        id='password'
                        type='password'
                        className='form-control'
                        value={newPassword}
                        onChange={handlePasswordChange}/>
                    <span style={{color: 'red'}} hidden={errorPassword == ''}>{errorPassword}</span>
                </div>
                <div className="d-grid gap-2 mt-1">
                    <Button variant='secondary' onClick={() => onChangePassword()} >
                        <span className='ms-2'>Change password</span>
                    </Button>
                </div>
            </>
    )
    }

    return (
        <div className='outer'>
            <div style={{maxWidth: '568px', width: '100%'}}
                 className='h-100 d-flex align-items-center'>
                <div className='inner '>
                    <div style={{marginLeft : '104px', marginRight : '104px'}}>
                        <h2 className='text-center mb-4'>{title}</h2>
                        {successful ?
                            <div className='d-flex justify-content-center'>
                                <Button variant={"primary"} onClick={() => navigate('/login')}>Login</Button>
                            </div>
                        : formElement()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
