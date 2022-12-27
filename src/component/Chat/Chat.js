import './chat.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import Message from './Message';
import { over } from 'stompjs';
import { useEffect, useRef, useState } from 'react';
import useChatApi from '../../api/useChatApi';

const Chat = ({ chatList, messagesEndRef }) => {
    const [dataInput, setDataInput] = useState('');
    const chatApi = useChatApi();
    const submitMessage = () => {
        chatApi.sendMessage(3, { message: dataInput });
        setDataInput('');
        // setTimeout(() => {
        //     scrollToBottom();
        // }, 1000);
    };
 
    console.log(5, chatList);
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') submitMessage();
    };

    return (
        <>
            <div className='chat-pane'>
                <div className='chat-container'>
                    {chatList.map((value, index) => (
                        <Message
                            key={index}
                            isOwner={value.username !== localStorage.getItem('username') ? true : false}
                            username={value.username}
                            content={value.message}
                        />
                    ))}
                    <div ref={messagesEndRef} />

                    <Message isOwner={false} username='value.username' content={'fdsfhjdkshfjkdshfjkhdsjkhfjkdshfjkdhsjkfhkjdshfjkdshfjksd'} />
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
