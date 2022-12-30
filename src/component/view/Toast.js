import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';


function AutohideToast({ show, setShow }) {
    //   const [show, setShow] = useState(false);

    return (
        <Row>
            <Col xs={6}>
                <ToastContainer className='p-3' position={'bottom-center'}>
                    <Toast onClose={() => setShow(false)} show={show} delay={4000} autohide>
                        <Toast.Header>
                            <img src='holder.js/20x20?text=%20' className='rounded me-2' alt='' />
                            <strong className='me-auto'>Notification</strong>
                            <small>just a second ago</small>
                        </Toast.Header>
                        <Toast.Body>You have a new message in chat box</Toast.Body>
                    </Toast>
                </ToastContainer>
            </Col>
        </Row>
    );
}

export default AutohideToast;
