const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle new socket connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  // Listen for chat messages
  socket.on('chat message', (msg) => {
    console.log('Message: ' + msg);
    // Broadcast the message to all connected clients
    io.emit('chat message', msg);
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});