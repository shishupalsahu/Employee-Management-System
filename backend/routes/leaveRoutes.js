import express from 'express';
import { applyLeave, getLeaveHistory, updateLeaveStatus } from '../controllers/leaveController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Dono routes ke liye user ka logged in hona (protect) zaroori hai
router.post('/apply', protect, applyLeave);
router.get('/history', protect, getLeaveHistory);

// Leave approve/reject karne ka haq sirf admin ko hai
router.put('/approve/:id', protect, adminOnly, updateLeaveStatus);

export default router;