// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid'); // Generates unique room IDs

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS enabled
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3002', // Adjust to your React app's URL
    methods: ['GET', 'POST'],
  },
});

// Handle socket connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Join a specific room based on room ID
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  // Handle incoming encrypted messages
  socket.on('message', (encryptedMessage, roomId) => {
    // Broadcast message to users in the room
    io.to(roomId).emit('message', encryptedMessage);
    console.log(`Message sent to room: ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server on port 3001
server.listen(3001, () => {
  console.log('Server is listening on port 3001');
});
