import React, { useState, useEffect, useRef} from "react";
import axios from "axios";


const UserList = ({ allUsers, socketRef, setSelectedUser, setConversationId }) => {

    const handleUserClick = async (otherUserId) => {
      const sessionId = localStorage.getItem('x-auth-token');
      try {

        console.log("Sending to backend:", {
          user_two_id: otherUserId
        });
  
        const convRes = await axios.post('http://localhost:3001/chat/getOrCreateConversationId',
          {user_two_id: otherUserId.id},
          { headers: { 'x-auth-token': sessionId } },
        );
  
        const convId = convRes.data.conversationID;
        setConversationId(convId);
        setSelectedUser(otherUserId);
  
        socketRef.current.emit('join-room', convId);
        
      } catch (err) {
        console.error('Failed to join conversation:', err);
      }
    };
  
    return (
      <div className="flex-1 overflow-y-auto space-y-4">
        {allUsers.map(u => (
          <div
            key={u.id || u.name}
            className="cursor-pointer p-2 hover:bg-gray-700 rounded text-white"
            onClick={() => handleUserClick(u)}
          >
            {u.name}
          </div>
        ))}
      </div>
    );
  };
  
  export default UserList;