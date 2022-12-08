import { Row, Col } from 'react-bootstrap';
import MemberView from '../../view/MemberView';

import './ListMemberView.css';

const ListMemberView = ({ props, myRole, handlerUpgrade, handlerDelete }) => {
    return (
        <>
            {props.map((value, index) => (
                <Row className='row-item' key={index}>
                    <Col>
                        <MemberView props={value} myRole={myRole} handlerUpgrade={handlerUpgrade} handlerDelete={handlerDelete} />
                    </Col>
                </Row>
            ))}
        </>
    );
};

export default ListMemberView;
