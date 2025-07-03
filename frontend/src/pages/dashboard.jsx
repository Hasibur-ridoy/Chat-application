import React, { useState, useEffect, useRef} from "react";
import Nav from "../components/nav";
import UserList from '../components/userList.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client'
import { sendChatMessage } from '../components/button.jsx';

const Dashboard = () => {

    const navigate = useNavigate();

    // Fetch user name
    const [user, setUser] = useState(null);
    // Fetching alll user names
    const [allUsers, setAllUsers] = useState([]);

    // coversation useState
    const socketRef = useRef(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [conversationId, setConversationId] = useState(null);

    // message useState
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState([]);

    // load more message of scroll up


    useEffect(() => {
      const fetchUser = async () => {
        const sesiondId = localStorage.getItem('x-auth-token');
        if (!sesiondId) {
          return;
        }

        socketRef.current = io('http://localhost:3001');

        // Loading old messages
        socketRef.current.on('previousMessage', (message) => {
          setMessages(message);
        });

        // Listens for new messages
        socketRef.current.on('newMessage', (message) => {
          setMessages(prev => [...prev, message]);
        });
      

        try {
          // Fetch the current user
          const response = await axios.get('http://localhost:3001/chat/getUser', {
            headers: {'x-auth-token': sesiondId}
          });
          setUser(response.data);

          // Fetch all users
          const allUserResponse = await axios.get('http://localhost:3001/chat/getAllUsers', {
            headers: {'x-auth-token': sesiondId}
          });
          setAllUsers(allUserResponse.data);

        } catch (error) {
          console.log('Error fetching user:', error);
        }
      };
      fetchUser();

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }, []);

    
    // Handle logout
    const handleLogout = async () => {
        const sessionId = localStorage.getItem('x-auth-token');
      
        if (!sessionId) {
          navigate('/');
          return;
        }
      
        try {
          await axios.post('http://localhost:3001/chat/logout', {}, {
            headers: {
              'x-auth-token': sessionId
            }
          });
      
          localStorage.removeItem('x-auth-token');
          navigate('/');
        } catch (error) {
          console.error('Logout failed:', error);
          alert('Logout failed. Please try again.');
        }
    };
    return (
        <>
            <Nav onLogout={handleLogout} />
            <div className="flex h-[calc(100vh-64px)] bg-gray-100 overflow-hidden mt-16">
              {/* Sidebar */}
              <div className="w-1/4 bg-gray-800 text-white p-4 flex flex-col">
                <h1 className="text-2xl font-bold mb-6">Chat App</h1>

                <div className="flex-1 overflow-y-auto space-y-4">
                  {/* Example user list */}
                  <UserList
                    allUsers={allUsers}
                    socketRef={socketRef}
                    setSelectedUser={setSelectedUser}
                    setConversationId={setConversationId}
                  />
                </div>

                {/* user name */}
                <div className="text-white font-semibold mt-6">
                  Hello, {user?.name || '...'}
                </div>
              </div>

              {/* Chat Window */}
              <div className="flex flex-col flex-1 min-h-0">

                {/* Chat Header */}
                <div className="bg-white border-b p-4 font-semibold text-lg">
                  {selectedUser ? (
                    <span>
                      Chatting: <span className="text-blue-600">{user?.name}</span> & <span className="text-green-600">{selectedUser?.name}</span>
                    </span>
                  ) : (
                    "Select a user to start chatting"
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-gray-50 h-[calc(100vh-200px)] min-h-[300px]">
                  {!selectedUser ? (
                    <div className="text-center text-gray-500 mt-10">No conversation selected</div>
                  ) : (
                    messages.map((msg, index) => {
                      const isOwnMessage = msg.sender_id === user.id;
                      return (
                        <div key={index} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                          <div className={`${isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-300'} p-2 rounded-lg max-w-xs`}>
                            <div className="text-xs font-semibold mb-1">
                              {isOwnMessage ? 'You' : selectedUser?.name}
                            </div>
                            {msg.text}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Input Box */}
                <div className="p-4 border-t bg-white flex items-center">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 p-2 border rounded mr-2"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                  />
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={async () => {
                      await sendChatMessage({
                        socket: socketRef.current,
                        conversationId,
                        messageInput,
                      });
                      setMessageInput('');
                    }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
        </>
    );
};

export default Dashboard;