import express from 'express';
import Salary from '../models/Salary.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Admin: Create or Update Salary for an Employee
router.post('/update', protect, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized as admin' });
    }

    const { employeeId, basicSalary, hra, allowances, deductions } = req.body;

    try {
        let salary = await Salary.findOne({ employeeId });

        if (salary) {
            // Update existing record
            salary.basicSalary = basicSalary;
            salary.hra = hra;
            salary.allowances = allowances;
            salary.deductions = deductions;
            await salary.save();
        } else {
            // Create new record
            salary = await Salary.create({
                employeeId,
                basicSalary,
                hra,
                allowances,
                deductions
            });
        }

        res.json({ message: 'Payroll matrix updated successfully', salary });
    } catch (error) {
        res.status(500).json({ message: 'Server Error processing payroll allocation' });
    }
});

// 2. Employee/Admin: Fetch Salary profile
router.get('/:employeeId', protect, async (req, res) => {
    // Employee sirf apni salary dekh sakta hai, Admin kisi ki bhi
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.employeeId) {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const salary = await Salary.findOne({ employeeId: req.params.employeeId });
        if (!salary) return res.status(404).json({ message: 'Salary structure not defined yet for this profile' });
        res.json(salary);
    } catch (error) {
        res.status(500).json({ message: 'Server error retrieving salary matrix' });
    }
});

export default router;