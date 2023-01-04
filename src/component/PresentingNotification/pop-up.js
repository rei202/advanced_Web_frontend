import { Modal, Button } from 'react-bootstrap';
import {useNavigate} from "react-router";
import useGroupApi from "../../api/useGroupApi";
import {useEffect, useState} from "react";
import {role_user} from "../../constant/common.const";
import {useParams} from "react-router-dom";

const PresentingPopUp = (props) => {
    const presentingId = props.presentingId;
    const { id } = useParams();
    const navigate = useNavigate();

    const groupApi = useGroupApi();
    const [endpointName, setEndpointName] = useState('presenting-guest');
    useEffect(() => {
        groupApi.checkUserInGroup(localStorage.getItem('username'), id)
            .then(resp => {
                if (resp.roleUserInGroup == role_user.owner || resp.roleUserInGroup == role_user.coOwner)
                    setEndpointName('presenting');
            })
    }, [])
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
                <Button type='Invite' variant='primary'
                        onClick={() => navigate(`/${endpointName}/${presentingId}?guest=true`)}>
                    Join
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
export default PresentingPopUp;
