import './chat.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import Message from './Message';
import { over } from 'stompjs';
import { useEffect, useState } from 'react';
import useChatApi from '../../api/useChatApi';

const Chat = ({ chatList }) => {
    const [dataInput, setDataInput] = useState('');
    const chatApi = useChatApi();
    const submitMessage = () => {
        chatApi.sendMessage(3, { message: dataInput });
        setDataInput('');
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') submitMessage();
    };

    return (
        <>
            <div className='chat-pane'>
                <div className='chat-container'>
                    {/* {chatList.map((value, index) => (
                        <Message
                            key={index}
                            isOwner={value.username === localStorage.getItem('username') ? true : false}
                            username={value.username}
                            content={value.message}
                        />
                    ))} */}
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
                    <input value={dataInput} onKeyDown={(e) => handleKeyDown(e)} onChange={(e) => setDataInput(e.target.value)} type='text'></input>
                    <div onClick={() => submitMessage()} className='send-btn-wapper'>
                        <FontAwesomeIcon className='send-btn' icon={faPaperPlane}></FontAwesomeIcon>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Chat;
