import Leave from '../models/Leave.js';

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

        res.json({ message: `Leave status updated to ${status}`, updatedLeave });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};