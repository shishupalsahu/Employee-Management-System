import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Yeh User model se connect (link) karega
        required: true
    },
    leaveType: {
        type: String,
        required: true,
        enum: ['Casual Leave', 'Sick Leave', 'Paid Leave']
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

const Leave = mongoose.model('Leave', leaveSchema);
export default Leave;