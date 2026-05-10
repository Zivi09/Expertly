require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const { connectDB } = require('./src/config/db');
const { errorHandler } = require('./src/middleware/errorHandler');
const expertRoutes = require('./src/routes/expertRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const { registerSocketHandlers } = require('./src/socket/socketHandler');

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH'],
  },
});

app.set('io', io);
registerSocketHandlers(io);

// Reflect request origin so Expo Go / physical devices can call the API without hard-coding hosts.
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/experts', expertRoutes);
app.use('/bookings', bookingRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.use(errorHandler);

async function start() {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
