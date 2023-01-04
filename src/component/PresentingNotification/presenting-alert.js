import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import './presenting-alert.css';
import {useNavigate} from "react-router";
const PresentingAlert = (props) => {
    const presentingGroupData = props.presentingGroupData;
    const navigate = useNavigate();
    return (
        <>
            <Card border='danger' className='pop-up'>
                <Card.Body className='pop-up-body'>
                    <Card.Text style={{ marginRight: '5px', color: 'red' }}>
                        <FontAwesomeIcon icon={faBell} style={{ marginRight: '5px' }} />
                        Announce to everyone. Owner is presenting in this group. Click button to join{' '}
                        <Button variant='primary' className='join-pre-btn'
                                onClick={() => navigate(`/presenting-guest/${presentingGroupData}`)}>
                            Join
                        </Button>
                    </Card.Text>
                    {/* <Card.Text>With supporting text below as a natural lead-in to additional content.</Card.Text> */}
                </Card.Body>
            </Card>
        </>
    );
};

export default PresentingAlert;
