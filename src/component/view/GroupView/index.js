import { Card, Button, Dropdown } from 'react-bootstrap';
import thumnail from '../../../assets/images/group-thumnail.jpg';
import './GroupView.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faAward } from '@fortawesome/free-solid-svg-icons';
import preIcon from '../../../assets/images/presentation.png';

import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useNotificationApi from '../../../api/useNotificationApi';
const GroupView = ({ role, props, handlerDeleteGroup }) => {
    const [showPresentingNoti, setShowPresentingNoti] = useState(false);
    const notificationApi = useNotificationApi();
    useEffect(() => {
        notificationApi.checkPresenting(props.id).then((res) => {
            if (res.data !== null) {
                setShowPresentingNoti(res.data.isPresenting);
            }
        });
    }, []);
    return (
        <>
            <Card className='group-item' style={{ width: '20rem' }}>
                <Link to={'/group/' + props.id} style={{ color: 'black', textDecoration: 'none' }}>
                    <div style={{ position: 'relative' }}>
                        {role === 'ROLE_OWNER' || role === 'ROLE_COOWNER' ? (
                            <div className='role-tag' style={{}}>
                                <FontAwesomeIcon icon={faAward} style={{ marginRight: '5px' }}>
                                    {' '}
                                </FontAwesomeIcon>
                                {role === 'ROLE_OWNER' ? 'Owner' : 'Co-Owner'}
                            </div>
                        ) : (
                            <div />
                        )}
                        {showPresentingNoti ? (
                            <div className={'presenting-tag' + (role === 'ROLE_MEMBER' ? ' non-role-tag' : '')}>
                                <img src={preIcon} alt='#' style={{ marginRight: '5px', width: '14pt' }} />
                            </div>
                        ) : (
                            <div />
                        )}
                        <Card.Img variant='top' src={thumnail} />
                    </div>
                    <Card.Body id='body-card-group'>
                        <Card.Title>{props.groupName}</Card.Title>
                    </Card.Body>
                </Link>
                {role === 'ROLE_OWNER' && (
                    <Card.Footer style={{ backgroundColor: 'white' }} id='footer-card-group'>
                        <div className='group-deletion-wapper'>
                            <FontAwesomeIcon
                                onClick={() => {
                                    handlerDeleteGroup(props.id);
                                }}
                                className='group-function-icon'
                                icon={faTrashCan}
                                style={{ color: 'red', textAlign: 'end' }}
                            ></FontAwesomeIcon>
                        </div>
                    </Card.Footer>
                )}
            </Card>
        </>
    );
};

export default GroupView;
