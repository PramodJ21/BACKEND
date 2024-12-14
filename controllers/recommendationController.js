const Recommendation = require('../models/Recommendation');

exports.saveRecommendation = async (req, res) => {
  try {
    const { recommendationName, recommendedSoundIds } = req.body;
    
    if (!recommendationName) {
      return res.status(400).json({ error: 'Recommendation name is required' });
    }

    let recommendation = await Recommendation.findOne({ recommendationName});
    
    if (recommendation) {
      // Update existing recommendation
      recommendation.recommendedSounds = recommendedSoundIds;
    } else {
      // Create new recommendation
      recommendation = new Recommendation({
        recommendationName,
        recommendedSounds: recommendedSoundIds
      });
    }
    
    await recommendation.save();
    
    res.status(200).json({ 
      message: 'Recommendation saved successfully',
      recommendation: {
        id: recommendation._id,
        name: recommendation.recommendationName,
        recommendedSounds: recommendation.recommendedSounds
      }
    });
  } catch (error) {
    console.error('Error saving recommendation:', error);
    res.status(500).json({ error: 'Error saving recommendation' });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const recommendation = await Recommendation.find().populate('recommendedSounds');
    if (recommendation) {
      res.status(200).json(recommendation);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: 'Error fetching recommendations' });
  }
};

// Optional: Add a function to delete a recommendation
exports.deleteRecommendation = async (req, res) => {
  try {
    const { recId } = req.params;
    const result = await Recommendation.findByIdAndDelete(recId);
    if (result) {
      res.status(200).json({ message: 'Recommendation deleted successfully' });
    } else {
      res.status(404).json({ message: 'Recommendation not found' });
    }
  } catch (error) {
    console.error('Error deleting recommendation:', error);
    res.status(500).json({ error: 'Error deleting recommendation' });
  }
};

// Optional: Add a function to update a recommendation
exports.updateRecommendation = async (req, res) => {
  try {
    const { mainSoundId } = req.params;
    const { recommendedSoundIds } = req.body;
    const updatedRecommendation = await Recommendation.findOneAndUpdate(
      { mainSound: mainSoundId },
      { recommendedSounds: recommendedSoundIds },
      { new: true, runValidators: true }
    );
    if (updatedRecommendation) {
      res.status(200).json({ message: 'Recommendation updated successfully', recommendation: updatedRecommendation });
    } else {
      res.status(404).json({ message: 'Recommendation not found' });
    }
  } catch (error) {
    console.error('Error updating recommendation:', error);
    res.status(500).json({ error: 'Error updating recommendation' });
  }
};