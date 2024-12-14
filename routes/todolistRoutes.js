const express = require('express');
const router = express.Router();
const {saveTasks, getTasks, deleteTask, updateTask} = require('../controllers/todolistController');

router.post('/tasks', saveTasks);
router.get('/tasks', getTasks);
router.delete('/tasks', deleteTask);
router.put('/tasks', updateTask);

module.exports = router;