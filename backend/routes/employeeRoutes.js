import express from 'express';
import { 
    getEmployees, 
    addEmployee, 
    updateEmployee, 
    deleteEmployee 
} from '../controllers/employeeController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Sabhi routes par phle protect middleware chalega (Token check karne) 
// Aur fir adminOnly middleware chalega (Role check karne)
router.route('/')
    .get(protect, adminOnly, getEmployees)
    .post(protect, adminOnly, addEmployee);

router.route('/:id')
    .put(protect, adminOnly, updateEmployee)
    .delete(protect, adminOnly, deleteEmployee);

export default router;