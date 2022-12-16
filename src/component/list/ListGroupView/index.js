import GroupView from '../../view/GroupView';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import './ListGroupView.css';

const ListGroupView = ({ props }) => {
    return (
        <>
            <Row xl={3} xs={2} className='g-4'>
                {props.map((value, index) => (
                    <Col key={index}>
                        <div className='group-item' style={{ color: 'black' }}>
                            <Link to={'/group/' + value.group.id} style={{ color: 'black', textDecoration: 'none' }}>
                                <GroupView props={value.group}></GroupView>
                            </Link>
                        </div>
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default ListGroupView;
