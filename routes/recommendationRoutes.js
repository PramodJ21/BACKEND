const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');

router.post('/', recommendationController.saveRecommendation);
router.get('/', recommendationController.getRecommendations);
router.delete('/:recId', recommendationController.deleteRecommendation);

module.exports = router;