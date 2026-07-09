import mongoose from 'mongoose';

const salarySchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // Ek employee ka ek hi base payroll configuration rahega
    },
    basicSalary: {
        type: Number,
        required: true,
        default: 0
    },
    hra: {
        type: Number,
        required: true,
        default: 0
    },
    allowances: {
        type: Number,
        required: true,
        default: 0
    },
    deductions: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true });

// Dynamic Virtual field jo compute karega net take-home salary
salarySchema.virtual('netSalary').get(function() {
    return (this.basicSalary + this.hra + this.allowances) - this.deductions;
});

salarySchema.set('toJSON', { virtuals: true });
salarySchema.set('toObject', { virtuals: true });

const Salary = mongoose.model('Salary', salarySchema);
export default Salary;