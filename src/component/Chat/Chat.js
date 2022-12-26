import './chat.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import Message from './Message';

const Chat = () => {
    return (
        <>
            <div className='chat-pane'>
                <div className='chat-container'>
                    <Message isOwner={true} username='nhatks147' content={'hello top how are you today'}>
                        message
                    </Message>
                    <Message isOwner={false} username='renaks' content={'hi, today im so happy'}>
                        message
                    </Message>
                    <Message isOwner={false} username='renaks' content={'Have you done your homwork'}>
                        message
                    </Message>
                    <Message
                        isOwner={true}
                        username='nhatks147'
                        content={'actually No im so sorry about that. I just forgot it because my cousin visited my home last week'}
                    >
                        message
                    </Message>
                </div>
                <div className={'input-chat-box'}>
                    <input type='text'></input>
                    <div className='send-btn-wapper'>
                        <FontAwesomeIcon className='send-btn' icon={faPaperPlane}></FontAwesomeIcon>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Chat;
