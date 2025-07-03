import axios from 'axios';

export const sendChatMessage = async ({ socket, conversationId, messageInput }) => {
  const sessionId = localStorage.getItem('x-auth-token');
  if (!sessionId) {
    console.error('No session token found.');
    return;
  }

  try {
    const response = await axios.get('http://localhost:3001/chat/getUser', {
      headers: { 'x-auth-token': sessionId }
    });

    const senderId = response.data.id;

    socket.emit('chat-message', {
      conversationID: conversationId,
      senderId,
      text: messageInput,
    });

  } catch (error) {
    console.error('Failed to get sender ID:', error);
  }
};