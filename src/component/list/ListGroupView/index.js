import GroupView from '../../view/GroupView';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import './ListGroupView.css';

const ListGroupView = ({ props, handlerDeleteGroup }) => {
    return (
        <>
            <Row xl={3} xs={2} className='g-4'>
                {props.map((value, index) => (
                    <Col key={index}>
                        <div className='group-item' style={{ color: 'black' }}>
                            <GroupView role={value.roleUserInGroup} handlerDeleteGroup={handlerDeleteGroup} props={value.group}></GroupView>
                        </div>
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default ListGroupView;
