const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Import routes
const authRoutes = require("./routes/authRoutes");
const mixRoutes = require("./routes/mixRoutes");
const playlistRoutes = require("./routes/playlistRoutes");
const soundRoutes = require('./routes/soundRoutes');
const todolistRoutes = require('./routes/todolistRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const profileRoutes = require('./routes/profileRoutes')
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const frontendDir = path.join(__dirname, '..', 'FRONTEND');
const indexPath = path.join(frontendDir, 'PAGES', 'index.html');

// Serve static files
app.use(express.static(frontendDir));
app.use('/SOUND_AUDIO', express.static(path.join(__dirname, 'SOUND_AUDIO')));

// API routes
app.use("/api/auth", authRoutes);
app.use('/api/sounds', soundRoutes);
app.use('/api/mixes', mixRoutes);
app.use("/api/playlists", playlistRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/tasks', todolistRoutes);
app.use('/api/profile',profileRoutes)

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Catch-all route handler
app.get('*', (req, res) => {
  console.log('Catch-all route hit:', req.url);
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('File not found');
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Add this after MongoDB connection
mongoose.connection.once('open', async () => {
  console.log('Checking database contents...');
  // const Sound = require('./models/Sound');
  // const Mix = require('./models/Mix');
  
  // const sounds = await Sound.find();
  // console.log('Sounds in database:', sounds);
  
  // const mixes = await Mix.find();
  // console.log('Mixes in database:', mixes);
});