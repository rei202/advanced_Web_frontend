import { Card, Button } from 'react-bootstrap';
import thumnail from '../../../assets/images/group-thumnail.jpg';
import './GroupView.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faShareSquare } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';
const GroupView = ({ props, handlerDeleteGroup }) => {
    return (
        <>
            <Card className='group-item' style={{ width: '20rem' }}>
                <Link to={'/group/' + props.id} style={{ color: 'black', textDecoration: 'none' }}>
                    <Card.Img variant='top' src={thumnail} />
                    <Card.Body id='body-card-group'>
                        <Card.Title>{props.groupName}</Card.Title>
                    </Card.Body>
                </Link>
                <Card.Footer id='footer-card-group'>
                    <FontAwesomeIcon className='group-function-icon' icon={faShareSquare}></FontAwesomeIcon>
                    <FontAwesomeIcon
                        onClick={() => {
                            handlerDeleteGroup(props.id);
                        }}
                        className='group-function-icon'
                        icon={faTrashCan}
                        style={{ color: 'red' }}
                    ></FontAwesomeIcon>
                </Card.Footer>
            </Card>
        </>
    );
};

export default GroupView;
