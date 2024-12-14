const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema({
  recommendationName: { type: String,  required: true },
  recommendedSounds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sound' }]
});

const Recommendation = mongoose.model('Recommendation', RecommendationSchema);

module.exports = Recommendation;