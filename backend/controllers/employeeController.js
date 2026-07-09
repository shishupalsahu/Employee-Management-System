import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// @desc    Get all employees (Admin Only)
// @route   GET /api/employees
export const getEmployees = async (req, res) => {
    try {
        // Sirf un users ko laayein jinka role 'employee' hai (aur password hide rakhein)
        const employees = await User.find({ role: 'employee' }).select('-password');
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a new employee (Admin Only)
// @route   POST /api/employees
export const addEmployee = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Employee with this email already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const employee = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'employee' // default explicit role
        });

        res.status(201).json({
            _id: employee._id,
            name: employee.name,
            email: employee.email,
            role: employee.role
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update employee details (Admin Only)
// @route   PUT /api/employees/:id
export const updateEmployee = async (req, res) => {
    try {
        const employee = await User.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        employee.name = req.body.name || employee.name;
        employee.email = req.body.email || employee.email;
        
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            employee.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedEmployee = await employee.save();
        res.json({
            _id: updatedEmployee._id,
            name: updatedEmployee.name,
            email: updatedEmployee.email,
            role: updatedEmployee.role
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete an employee (Admin Only)
// @route   DELETE /api/employees/:id
export const deleteEmployee = async (req, res) => {
    try {
        const employee = await User.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Employee removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};