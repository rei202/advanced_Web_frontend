import { Card, Button } from 'react-bootstrap';
import thumnail from '../../../assets/images/group-thumnail.jpg';
import './GroupView.css';

const GroupView = ({ props }) => {
    return (
        <>
            <Card className='group-item' style={{ width: '17rem' }}>
                <Card.Img variant='top' src={thumnail} />
                <Card.Body>
                    <Card.Title>{props.groupName}</Card.Title>
                    {/* <Button variant="primary">Go somewhere</Button> */}
                </Card.Body>
            </Card>
        </>
    );
};

export default GroupView;
