import thumnail from '../../../assets/images/admin.png';
import { Button } from 'react-bootstrap';
import './AdminView.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserSlash, faFlag } from '@fortawesome/free-solid-svg-icons';

const AdminView = ({ props, myRole, handlerDemote }) => {
    return (
        <>
            <div className='admin-item'>
                <div className='mi-info'>
                    <img src={thumnail} alt='#' width='40' height='40' />
                    <span style={{ marginLeft: '10px' }}> {props.user.fullName}</span>
                </div>
                {myRole === 'ROLE_OWNER' && props.roleUserInGroup !== 'ROLE_OWNER' ? (
                    <div className='assignment-btn-wapper'>
                        <Button
                            className='assignment-btn'
                            variant='primary btn-sm'
                            style={{ marginRight: '10px' }}
                            onClick={() => {
                                handlerDemote(props.user.username);
                            }}
                        >
                            <FontAwesomeIcon icon={faFlag} className='role-assignnment-icon'></FontAwesomeIcon>
                            demote role
                        </Button>
                    </div>
                ) : (
                    <div style={{ marginRight: '10px' }}>{props.roleUserInGroup === 'ROLE_OWNER' ? 'Owner' : myRole !== 'ROLE_OWNER' ? 'Co-Owner' : ''}</div>
                )}
            </div>
            <hr />
        </>
    );
};

export default AdminView;
