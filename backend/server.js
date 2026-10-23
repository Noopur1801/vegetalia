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
    origin: "*", // Allows connections from both local development and your live Vercel frontend
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Make 'io' accessible inside your routes
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Vegetation backend is running!");
});

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

// Health check can be used by Render to confirm that the API process is responding.
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Vegetillya API is running', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

const PORT = process.env.PORT || 5000;

// Do not accept requests until MongoDB is connected; otherwise writes may hang and look successful in the UI.
async function startServer() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not configured in the backend environment.');
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB successfully');
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

startServer().catch((err) => {
  console.error('Backend startup failed:', err.message);
  process.exit(1);
});