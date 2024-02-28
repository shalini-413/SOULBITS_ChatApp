// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/SOULBITS_CHATAPP', { useNewUrlParser: true, useUnifiedTopology: true });

// Define the message schema
const messageSchema = new mongoose.Schema({
  user: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Serve HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Socket.io for real-time communication
io.on('connection', (socket) => {
  console.log('A user connected');

  // Load previous messages from the database
  Message.find({})
    .then((messages) => {
      socket.emit('load messages', messages);
      console.log('Messages loaded from MongoDB:', messages);
    })
    .catch((err) => {
      console.error('Error loading messages:', err);
    });

  // Handle new messages
  socket.on('chat message', (data) => {
    const { user, message } = data;
    const newMessage = new Message({ user, message });
    newMessage.save()
      .then(() => {
        io.emit('chat message', newMessage);
        console.log('Message saved to MongoDB:', newMessage);
      })
      .catch((err) => {
        console.error('Error saving message:', err);
      });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  // Clear previous messages when a new user connects
  socket.on('clear messages', () => {
    io.emit('clear messages');
    console.log('Previous messages cleared from the screen');
  });
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
