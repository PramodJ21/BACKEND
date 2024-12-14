const express = require('express');
const router = express.Router();
const mixController = require('../controllers/mixController');
const Mix = require('../models/Mix'); 
router.get('/recent', mixController.getRecentMixes);
router.get('/:id/sounds', mixController.getMixSounds);
router.get('/', mixController.getAllMixes);
router.post('/', mixController.createMix);
router.delete('/:id', mixController.deleteMix)

router.get('/', async (req, res) => {
    try {
        const mixes = await Mix.find();
        res.json({ mixes });
    } catch (error) {
        console.error('Error fetching mixes:', error);
        res.status(500).json({ error: 'Error fetching mixes' });
    }
});

module.exports = router;