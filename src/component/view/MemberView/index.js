import { Button } from 'react-bootstrap';
import userIcon from '../../../assets/images/father.png';
import './MemberView.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserSlash, faFlag } from '@fortawesome/free-solid-svg-icons';
import useAxios from '../../../hooks/useAxios';
import { useSearchParams } from 'react-router-dom';

const MemberView = ({ props, myRole, handlerUpgrade, handlerDelete }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const axios = useAxios();

    return (
        <>
            <div className='member-item'>
                <div className='mi-info'>
                    <img src={userIcon} alt='#' width='40' height='40' />
                    <span style={{ marginLeft: '10px' }}>{props.user.fullName}</span>
                </div>
                {myRole === 'ROLE_OWNER' ? (
                    <div className='assignment-btn-wapper'>
                        <Button
                            className='assignment-btn'
                            variant='primary btn-sm'
                            style={{ marginRight: '10px' }}
                            onClick={() => {
                                handlerUpgrade(props.user.username);
                            }}
                        >
                            <FontAwesomeIcon icon={faFlag} className='role-assignnment-icon'></FontAwesomeIcon>
                            promote role
                        </Button>
                        <Button
                            className='assignment-btn'
                            variant='primary btn-sm'
                            onClick={() => {
                                handlerDelete(props.user.username);
                            }}
                        >
                            <FontAwesomeIcon icon={faUserSlash} className='role-assignnment-icon'></FontAwesomeIcon>
                            Remove
                        </Button>
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
            <hr />
        </>
    );
};

export default MemberView;
