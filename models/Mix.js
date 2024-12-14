const mongoose = require('mongoose');

const mixSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sounds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sound" }],
  createdAt: { type: Date, default: Date.now },
  lastPlayed: { type: Date },
  playCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Mix', mixSchema);