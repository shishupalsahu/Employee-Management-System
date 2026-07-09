import Leave from '../models/Leave.js';
import User from '../models/User.js'; // <-- 1. User model import kiya admin dhoodhne ke liye
import Notification from '../models/Notification.js'; // <-- 2. Notification model import kiya

// @desc    Apply for a leave (Employee)
// @route   POST /api/leave/apply
export const applyLeave = async (req, res) => {
    const { leaveType, startDate, endDate, reason } = req.body;

    try {
        const leave = await Leave.create({
            employeeId: req.user._id, // Logged-in employee ki ID middleware se aayegi
            leaveType,
            startDate,
            endDate,
            reason
        });

        // 🚨 TRIGGER A: Admin ko notify karein ki leave apply hui hai
        const adminUser = await User.findOne({ role: 'admin' });
        if (adminUser) {
            await Notification.create({
                recipient: adminUser._id,
                sender: req.user._id, // Logged-in Employee
                title: 'New Leave Request ⏳',
                message: `${req.user.name} has applied for ${leaveType}.`
            });
        }

        res.status(201).json({ message: 'Leave applied successfully', leave });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get leave history (Employee gets their own, Admin gets all)
// @route   GET /api/leave/history
export const getLeaveHistory = async (req, res) => {
    try {
        // Agar user admin hai, toh saari leaves laao aur employee details bhi populate karo
        if (req.user.role === 'admin') {
            const allLeaves = await Leave.find().populate('employeeId', 'name email');
            return res.json(allLeaves);
        }

        // Agar normal employee hai, toh sirf uski apni leaves laao
        const myLeaves = await Leave.find({ employeeId: req.user._id });
        res.json(myLeaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve or Reject leave request (Admin Only)
// @route   PUT /api/leave/approve/:id
export const updateLeaveStatus = async (req, res) => {
    const { status } = req.body; // Expecting 'Approved' or 'Rejected'

    try {
        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const leave = await Leave.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        leave.status = status;
        const updatedLeave = await leave.save();

        // 🚨 TRIGGER B: Employee ko notify karein ki unki leave status update ho gayi hai
        await Notification.create({
            recipient: leave.employeeId, // Jis employee ki leave hai
            sender: req.user._id,        // Logged-in Admin
            title: `Leave Request ${status} 📢`,
            message: `Your request for ${leave.leaveType} has been ${status.toLowerCase()} by management.`
        });

        res.json({ message: `Leave status updated to ${status}`, updatedLeave });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};