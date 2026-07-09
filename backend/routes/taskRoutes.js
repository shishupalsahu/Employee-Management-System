import express from 'express';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/taskController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Sabhi task operations ke liye login (protect) hona compulsory hai
router.route('/')
    .post(protect, adminOnly, createTask) // Sirf admin task bana sakta hai
    .get(protect, getTasks);              // Admin ko sab dikhega, Employee ko sirf apna

router.route('/:id')
    .put(protect, updateTask)             // Admin sab badal sakta hai, Employee sirf status
    .delete(protect, adminOnly, deleteTask); // Sirf admin delete kar sakta hai

export default router;