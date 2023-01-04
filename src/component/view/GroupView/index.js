import { Card, Button } from 'react-bootstrap';
import thumnail from '../../../assets/images/group-thumnail.jpg';
import './GroupView.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faShareSquare } from '@fortawesome/free-regular-svg-icons';
import { faAward } from '@fortawesome/free-solid-svg-icons';

import { Link } from 'react-router-dom';
const GroupView = ({ role, props, handlerDeleteGroup }) => {
    return (
        <>
            <Card className='group-item' style={{ width: '20rem', }} >
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
                        <Card.Img variant='top' src={thumnail} />
                    </div>
                    <Card.Body id='body-card-group'>
                        <Card.Title>{props.groupName}</Card.Title>
                    </Card.Body>
                </Link>
                {role === 'ROLE_MEMBER' ? (
                    <div />
                ) : (
                    <Card.Footer id='footer-card-group'>
                        <div className='group-deletion-icon'>
                            <FontAwesomeIcon className='group-function-icon' icon={faShareSquare}></FontAwesomeIcon>
                        </div>
                        <div className='group-deletion-icon'>
                            <FontAwesomeIcon
                                onClick={() => {
                                    handlerDeleteGroup(props.id);
                                }}
                                className='group-function-icon'
                                icon={faTrashCan}
                                style={{ color: 'red' }}
                            ></FontAwesomeIcon>
                        </div>
                    </Card.Footer>
                )}
            </Card>
        </>
    );
};

export default GroupView;
