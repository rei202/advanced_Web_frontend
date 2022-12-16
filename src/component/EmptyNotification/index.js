import i from '../../assets/images/emptybox.png';
import './EmptyNotification.css';

const EmptyNotification = ({ props }) => {
    return (
        <>
            <img id='content-img' src={i} alt=''></img>
            <div id='notification-text'>
                <b>{props}</b>{' '}
            </div>
        </>
    );
};

export default EmptyNotification;
