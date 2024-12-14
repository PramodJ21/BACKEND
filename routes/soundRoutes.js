const express = require('express');
const router = express.Router();
const Sound = require('../models/Sound'); // Adjust the path as necessary
const soundController = require('../controllers/soundController')
router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const sounds = await Sound.find().limit(limit);
        res.json({ sounds });
    } catch (error) {
        console.error('Error fetching sounds:', error);
        res.status(500).json({ error: 'Error fetching sounds' });
    }
});

router.delete('/:id', soundController.deleteSound);
router.post('/', soundController.addSounds);
module.exports = router;