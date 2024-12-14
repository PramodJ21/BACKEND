const mongoose = require('mongoose');

const soundSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  filePath: { type: String, required: true },
  imagePath: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  tags: [String]
});

module.exports = mongoose.model('Sound', soundSchema);