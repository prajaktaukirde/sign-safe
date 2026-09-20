const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const Session = require('./models/Session');
const Alert = require('./models/Alert');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// REST API Endpoints
// Get active session
app.get('/api/session/active', async (req, res) => {
  try {
    let session = await Session.findOne({ isActive: true });
    if (!session) {
      session = new Session({ title: 'Physics Class', room: 'Room 103' });
      await session.save();
    }
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get emergency alerts history
app.get('/api/alerts', async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ timestamp: -1 }).limit(50);
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// WebSocket Real-Time Handlers
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join classroom room
  socket.on('join-room', ({ room }) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  // Teacher Speech broadcast
  socket.on('teacher-speech-broadcast', async ({ room, text }) => {
    try {
      // Broadcast text to all students in room
      socket.to(room).emit('teacher-lecture-text', { text });

      // Save transcript to active session in MongoDB
      await Session.findOneAndUpdate(
        { isActive: true, room },
        { 
          $push: { 
            transcripts: { sender: 'TEACHER', name: 'Professor Sharma', text } 
          } 
        },
        { upsert: true }
      );
    } catch (err) {
      console.error('Error saving speech transcript:', err.message);
    }
  });

  // Student Sign language translate question send
  socket.on('student-sign-send', async ({ room, studentName, word, desk }) => {
    try {
      // Broadcast question to teacher in room
      io.to(room).emit('student-question-alert', { 
        id: Math.random().toString(36).slice(2, 10),
        student: studentName,
        desk: desk || 'Desk 3',
        text: word,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        answered: false
      });

      // Save student sign to MongoDB transcript log
      await Session.findOneAndUpdate(
        { isActive: true, room },
        { 
          $push: { 
            transcripts: { sender: 'STUDENT', name: studentName, text: word } 
          } 
        },
        { upsert: true }
      );
    } catch (err) {
      console.error('Error saving student question:', err.message);
    }
  });

  // Teacher toggles or acoustic scanning triggers Emergency Evacuation
  socket.on('trigger-global-emergency', ({ room, reason }) => {
    console.log(`EMERGENCY TRIGGERED in ${room} due to: ${reason}`);
    // Broadcast emergency state to all devices in the room
    io.to(room).emit('emergency-activated', { reason });
  });

  // Clear emergency state
  socket.on('clear-global-emergency', ({ room }) => {
    console.log(`Emergency cleared in ${room}`);
    io.to(room).emit('emergency-cleared');
  });

  // Student sends two-way SOS distress status
  socket.on('sos-distress-signal', async ({ room, studentName, status, message }) => {
    try {
      console.log(`SOS distress signal from ${studentName} in ${room}: ${status}`);

      // Save alert entry to MongoDB database
      const alert = new Alert({
        room,
        studentName,
        status,
        message: message || `Student marked safety status: ${status.toUpperCase()}`
      });
      await alert.save();

      // Broadcast alert update to teacher and admin consoles in the room
      io.to(room).emit('alert-log-update', {
        id: alert._id,
        source: studentName,
        text: `Safety status: I AM ${status.toUpperCase()}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      });
    } catch (err) {
      console.error('Error handling SOS signal:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`SignSync & SafeSOS Backend Server listening on port ${PORT}`);
});
