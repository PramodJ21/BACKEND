const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mixes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Mixes" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Playlist", playlistSchema);