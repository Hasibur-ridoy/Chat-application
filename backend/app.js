const express = require('express');
const whatsAppRoutes = require('./routes/routes');
const { sequelize } = require('./models');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();


const app = express();
const port = 3001;
const server = http.createServer(app);
// this cors is for socket.io
const io = new Server (server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// this cors is for REST routes
app.use(cors({
    origin: 'http://localhost:5173',  // your React app origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

//Middleware
app.use(express.json());
app.use('/chat', whatsAppRoutes);

// Socket.io connection
require('./sockets/chatSocket')(io);

sequelize
    .sync()
    .then(() => {
        server.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });
