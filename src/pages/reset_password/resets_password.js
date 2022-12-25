import useAxios from '../../hooks/useAxios';
import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router';
import {Button} from "react-bootstrap";
import {ROOT_URL} from "../../constant/common.const";
import {useSearchParams} from "react-router-dom";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import useAccountApi from "../../api/useAccountApi";


const ResetPassword = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [newPassword, setNewPassword] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const username = searchParams.get('id');
    const accountApi = useAccountApi();

    const handlePasswordChange = (event) => {
        setNewPassword(event.target.value);
        console.log(event.target.value);
        accountApi.resetPassword({emailAddress : username, password : newPassword})
            .then(resp => {
                console.log(resp);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const onChangePassword = () => {
        if (newPassword == '') {
            setErrorPassword('your password is empty !!');
            return;
        }


    }

    return (
        <div className='outer'>
            <div style={{maxWidth: '568px', width: '100%'}}
                 className='h-100 d-flex align-items-center'>
                <div className='inner '>
                    <div style={{marginLeft : '104px', marginRight : '104px'}}>
                        <h1 className='text-center mb-4'>Reset Password</h1>
                        <p className='text-secondary text-center'>Please enter your new password</p>
                        <div className='form-group p-0'>
                            <label><b className='text-black'>Your password</b></label>
                            <input
                                id='password'
                                type='password'
                                className='form-control'
                                value={newPassword}
                                onChange={handlePasswordChange}
                                {...register('password')}/>
                            <span style={{color: 'red'}} hidden={errorPassword == ''}>{errorPassword}</span>
                        </div>
                        <div className="d-grid gap-2 mt-1">
                            <Button variant='secondary' onClick={() => onChangePassword()} >
                                <span className='ms-2'>Change password</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
