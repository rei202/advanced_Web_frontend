import userIcon from '../../assets/images/father.png';
import './message.scss';

const Messsage = ({ isOwner, username, content, fullname }) => {
    return (
        <>
            <div>
                <div className={isOwner ? 'message-user-name owner' : 'message-user-name'}>{fullname}</div>

                <div className={isOwner ? 'message owner' : 'message'}>
                    <div className='message-info'>
                        <img src={userIcon}></img>
                    </div>
                    <div className='message-content'>
                        <p>{content}</p>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Messsage;
