import { Modal, Button } from 'react-bootstrap';

const PresentingPopUp = (props) => {
    return (
        <Modal show={props.show} onHide={props.onHide} size='md' aria-labelledby='contained-modal-title-vcenter' centered>
            <Modal.Header closeButton>
                <Modal.Title id='contained-modal-title-vcenter'>Announcement</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>There is a presentation in this group now. Do you want to join ?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={props.onHide}>
                    Close
                </Button>
                <Button type='Invite' variant='primary'>
                    Join
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
export default PresentingPopUp;
