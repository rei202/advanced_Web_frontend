import { Row, Col } from 'react-bootstrap';
import AdminView from '../../view/AdminView';
import MemberView from '../../view/MemberView';

import './ListOwnerView.css';

const ListOwnerView = ({ props, handler }) => {
    return (
        <>
            {props.map((value, index) => (
                <Row className='row-item' key={index}>
                    <Col>
                        <AdminView props={value} handler={handler} />
                    </Col>
                </Row>
            ))}
        </>
    );
};

export default ListOwnerView;
