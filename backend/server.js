import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import taskRoutes from './routes/taskRoutes.js'; // <-- 1. Import Task Routes
import notificationRoutes from './routes/notificationRoutes.js'; // Environment variables configuration
import salaryRoutes from './routes/salaryRoutes.js';
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes Middleware
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/tasks', taskRoutes); // <-- 2. Use Task Routes
app.use('/api/notifications', notificationRoutes);// Basic Test Route
app.use('/api/salary', salaryRoutes);
app.get('/', (req, res) => {
    res.send('Employee Management System API is running...');
});

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected Successfully! ✅');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT} 🚀`);
        });
    })
    .catch((error) => {
        console.error('Database connection failed ❌:', error.message);
    });