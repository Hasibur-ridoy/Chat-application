const { Conversation, Message } = require('../models');
module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(' User connected:', socket.id);

        // Join a covo room and load previous message
        socket.on('join-room', async (conversationId) => {
            socket.join(conversationId);

            // Loading more messages when user scrolls up
            try {
                const message = await Message.findAll({
                    where: {conversation_id: conversationId},
                    order: [['createdAt', 'ASC']]
                });
                socket.emit('previousMessage', message);
            } catch (error) {
                console.error('Error loading message:', error);
                io.to(conversationId).emit('error', 'Failed to load message');
            }
        });

        // crette new message in the convo room
        socket.on('chat-message', async ({ conversationID, senderId, text }) => {
            try {
                const message = await Message.create({
                    conversation_id: conversationID,
                    sender_id: senderId,
                    text: text,
                });
                io.to(conversationID).emit('newMessage', message);
            } catch (error) {
                console.error('Error saving message:', error);
                io.to(conversationID).emit('error', 'Failed to send message');
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        })
    });
};