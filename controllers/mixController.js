const Mix = require("../models/Mix");
const Sound = require('../models/Sound');

exports.getAllMixes = async (req, res) => {
  try {
    const mixes = await Mix.find().populate("sounds");
    res.status(200).json({ mixes });
  } catch (error) {
    console.error("Error fetching mixes:", error);
    res.status(500).json({ error: "Error fetching mixes", message: error.message });
  }
};

exports.getMixById = async (req, res) => {
  try {
    const mix = await Mix.findById(req.params.id);
    if (!mix) {
      return res.status(404).json({ error: 'Mix not found' });
    }
    res.json(mix);
  } catch (error) {
    console.error('Error fetching mix:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

exports.createMix = async (req, res) => {
  try {
    const newMix = new Mix(req.body);
    const savedMix = await newMix.save();
    res.status(201).json(savedMix);
  } catch (error) {
    console.error('Error creating mix:', error);
    res.status(400).json({ error: "Error creating mix", message: error.message });
  }
};

exports.getRecentMixes = async (req, res) => {
  try {
    const mixes = await Mix.find()
      .sort({ lastPlayed: -1 })
      .limit(5)
      .populate("sounds");
    res.json(mixes);
  } catch (error) {
    console.error('Error fetching recent mixes:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

exports.deleteMix = async (req, res) => {
  try {
    const mix = await Mix.findByIdAndDelete(req.params.id);
    if (!mix) return res.status(404).json({ error: "Mix not found" });
    res.status(200).json({ message: "Mix deleted successfully" });
  } catch (error) {
    console.error('Error deleting mix:', error);
    res.status(500).json({ error: "Error deleting mix", message: error.message });
  }
};

exports.getMixSounds = async (req, res) => {
  try {
    console.log('Fetching sounds for mix ID:', req.params.id);
    
    const mix = await Mix.findById(req.params.id);
    if (!mix) {
      console.log('Mix not found:', req.params.id);
      return res.status(404).json({ error: 'Mix not found' });
    }
    
    console.log('Mix found:', mix);
    
    if (!mix.sounds || mix.sounds.length === 0) {
      console.log('No sounds in mix');
      return res.json({ sounds: [] });
    }
    
    const sounds = await Sound.find({ _id: { $in: mix.sounds } });
    console.log('Sounds found:', sounds);
    
    res.json({ sounds });
  } catch (error) {
    console.error('Error in getMixSounds:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack
    });
  }
};