import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routers/auth.js';
import vendorRoutes from './routers/vendorRouter.js';
import buyerRoutes from './routers/buyerRouter.js';
import driverRoutes from './routers/driverRouter.js';
import adminRoutes from './routers/adminRouter.js';
import productRoutes from './routers/productRoutes.js';
import orderRoutes from './routers/orderRouter.js';

dotenv.config();
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your React frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// 2. Make 'io' accessible inside your routes!
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON payloads

app.use('/api/auth', authRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/buyer', buyerRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

io.on('connection', (socket) => {
  console.log(`🔌 A user connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});



// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Vegetillya API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});