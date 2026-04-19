import { useParams } from 'react-router-dom';
import {use, useEffect, useState} from 'react';
import { createSocketConnection } from '../utils/socket';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
const Chat = () => {

    const { targetUserId } = useParams();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const user = useSelector(store => store.user);
    const userId = user?._id;

    const fetchChatMessages = async () => {
        try {
            const chat = await axios.get(BASE_URL + `/chat/${targetUserId}`,{
                withCredentials: true});

              const chatMessages = chat?.data?.messages.map(msg => ({
                firstName: msg?.senderId?.firstName,
                lastName: msg?.senderId?.lastName,
                text: msg.text
              }));
              setMessages(chatMessages || []);

        } catch (error) {
            console.error('Error fetching chat messages:', error);
        }
    };

    useEffect(() => {
        fetchChatMessages();
    }, []);

    useEffect(() => {

      if(!userId) return;
        const socket = createSocketConnection(); 

        socket.emit('joinChat', { 
          firstName:user.firstName,
          userId, 
          targetUserId 
        });

        socket.on('receiveMessage', ({firstName,lastName,text}) => {
          // console.log("Received message:", {firstName,text});
            setMessages(prevMessages => [...prevMessages, {firstName,lastName,text}]);
        });

        return () => {
           
            socket.disconnect();
        }

    }, [userId, targetUserId]);

    const sendMessage = () => {
        const socket = createSocketConnection();
        socket.emit('sendMessage', {
          firstName:user.firstName, 
          lastName:user.lastName,
          userId, 
          targetUserId, 
          text: newMessage
        });

        setNewMessage("");
    }
   
  return (
    <div className="w-3/4 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col">
      
      <h1 className="p-5 border-b border-gray-400">Chat</h1>

<div className='flex-1 p-5 overflow-y-auto'>

{messages.map((message, index) => {
return(
    <div key={index}>
        <div className={"chat" + (user.firstName === message.firstName ? " chat-end" : " chat-start")}>
  <div className="chat-header">
    {`  ${message.firstName} ${message.lastName || ''} `}
    {/* <time className="text-xs opacity-50">2 hours ago</time> */}
  </div>
  <div className="chat-bubble">{message.text}</div>
  {/* <div className="chat-footer opacity-50">Seen</div> */}
</div>
<div className="chat chat-start">


</div>
    </div>
);

})}
</div>

<div className="p-5 border-t border-gray-600 flex items-center gap-2">

<input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} 
className='w-full p-2 border border-gray-300 rounded text-white rounded' placeholder='Type your message here...'>
</input>

<button onClick={sendMessage}className="btn btn-secondary">Send</button>
</div>

    </div>
  )
}

export default Chat
