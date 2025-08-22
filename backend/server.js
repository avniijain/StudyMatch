import express from 'express' ;
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import {initSocket} from './socket.js';
import connectDB from  './config/db.js';
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import roomRoutes from './routes/roomRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
  res.send('StudyMatch API is running...');
});

app.use((req,res,next)=>{
  req.io=io;
  next();
});

app.use('/api/auth/', authRoutes);
app.use('/api/user/', userRoutes);
app.use('/api/todo/', todoRoutes);
app.use('/api/room/',roomRoutes);
app.use('/api/notifications/', notificationRoutes);

const server = http.createServer(app);
const io = await initSocket(server);

// Listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));