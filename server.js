const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

// Store usernames associated with socket IDs
const users = {};

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle new socket connections
io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);
  // Initialize user with socket ID as default identifier
  users[socket.id] = socket.id;

  // Handle username submission
  socket.on('set username', (username) => {
    if (username && typeof username === 'string' && username.trim() !== '') {
      users[socket.id] = username.trim();
      console.log(`User ${socket.id} set username to ${username}`);
      // Notify all clients of the new user
      io.emit('user joined', `${users[socket.id]} joined the chat`);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${users[socket.id]}`);
    // Notify all clients of the user leaving
    io.emit('user left', `${users[socket.id]} left the chat`);
    // Remove user from the users object
    delete users[socket.id];
  });

  // Listen for chat messages
  socket.on('chat message', (msg) => {
    if (msg && typeof msg === 'string' && msg.trim() !== '') {
      console.log(`Message from ${users[socket.id]}: ${msg}`);
      // Broadcast the message with username or ID
      io.emit('chat message', { user: users[socket.id], text: msg.trim() });
    }
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});