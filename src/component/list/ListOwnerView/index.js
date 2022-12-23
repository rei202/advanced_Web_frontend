import { Row, Col } from 'react-bootstrap';
import AdminView from '../../view/AdminView';
import MemberView from '../../view/MemberView';

import './ListOwnerView.css';

const ListOwnerView = ({ props, myRole, handlerDemote }) => {
    return (
        <>
            {props.map((value, index) => (
                <Row className='row-item' key={index}>
                    <Col>
                        <AdminView props={value} myRole={myRole} handlerDemote={handlerDemote} />
                    </Col>
                </Row>
            ))}
        </>
    );
};

export default ListOwnerView;
