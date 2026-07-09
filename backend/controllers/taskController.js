import Task from '../models/Task.js';

// @desc    Create and assign a new task (Admin Only)
// @route   POST /api/tasks
export const createTask = async (req, res) => {
    const { title, description, assignedTo, priority, deadline } = req.body;

    try {
        const task = await Task.create({
            title,
            description,
            assignedTo, // Employee ki User ID
            priority,
            deadline
        });

        res.status(201).json({ message: 'Task created and assigned successfully', task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get tasks (Admin gets all, Employee gets their own assigned tasks)
// @route   GET /api/tasks
export const getTasks = async (req, res) => {
    try {
        // Agar Admin hai, toh saare tasks laao aur assigned employee ka naam-email bhi dikhao
        if (req.user.role === 'admin') {
            const allTasks = await Task.find().populate('assignedTo', 'name email');
            return res.json(allTasks);
        }

        // Agar Employee hai, toh sirf uske apne assigned tasks laao
        const myTasks = await Task.find({ assignedTo: req.user._id });
        res.json(myTasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update task status or details
// @route   PUT /api/tasks/:id
export const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Agar normal employee hai, toh wo sirf status update kar sakta hai (Pending -> In Progress -> Completed)
        if (req.user.role === 'employee') {
            // Security check: Kya ye task isi employee ko assigned hai?
            if (task.assignedTo.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to update this task' });
            }
            task.status = req.body.status || task.status;
        } 
        
        // Agar admin hai, toh wo sab kuch edit kar sakta hai (title, priority, deadline, etc.)
        if (req.user.role === 'admin') {
            task.title = req.body.title || task.title;
            task.description = req.body.description || task.description;
            task.priority = req.body.priority || task.priority;
            task.deadline = req.body.deadline || task.deadline;
            task.status = req.body.status || task.status;
            task.assignedTo = req.body.assignedTo || task.assignedTo;
        }

        const updatedTask = await task.save();
        res.json({ message: 'Task updated successfully', updatedTask });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a task (Admin Only)
// @route   DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};