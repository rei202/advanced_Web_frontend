import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import './presenting-alert.css';
const PresentingAlert = () => {
    return (
        <>
            <Card border='danger' className='pop-up'>
                <Card.Body className='pop-up-body'>
                    <Card.Text style={{ marginRight: '5px', color: 'red' }}>
                        <FontAwesomeIcon icon={faBell} style={{ marginRight: '5px' }} />
                        Announce to everyone. Owner is presenting in this group. Click button to join{' '}
                        <Button variant='primary' className='join-pre-btn'>
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
