const Task = require('../models/Task');

exports.saveTasks = async (req, res) => {
    try {
        await Task.deleteMany({}); // Clear existing tasks
        const tasks = req.body.tasks.map(task => new Task(task));
        await Task.insertMany(tasks);
        res.status(200).json({ message: 'Tasks saved successfully' });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Error saving tasks', details: error.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json({ tasks });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching tasks' });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        await Task.findOneAndDelete({ text: req.body.text });
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting task' });
    }
};

exports.updateTask = async (req, res) => {
    try {
        await Task.findOneAndUpdate(
            { text: req.body.text },
            { completed: req.body.completed }
        );
        res.status(200).json({ message: 'Task updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating task' });
    }
};