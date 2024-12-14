const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Sound = require('./models/Sound'); // Ensure this path is correct

const mongoURI = 'mongodb+srv://devtarasenirmayi:Nirmayi%4029@cluster0.uztjk.mongodb.net/soundscape?retryWrites=true&w=majority&appName=Cluster0'; // Replace with your MongoDB URI

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const soundsDir = path.join(__dirname, 'SOUND_AUDIO'); // Replace with your sounds directory

const addSounds = async () => {
  try {
    const folders = fs.readdirSync(soundsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => path.join(soundsDir, dirent.name));

    const soundPromises = folders.map(async (folder) => {
      const files = fs.readdirSync(folder);
      const soundFile = files.find(file => file.endsWith('.wav') || file.endsWith('.mp3')); // Adjust extensions as needed
      const imageFile = files.find(file => file.endsWith('.jpg') || file.endsWith('.png')); // Adjust extensions as needed

      if (!soundFile || !imageFile) {
        console.error(`Skipping folder ${folder} because it does not contain both sound and image files.`);
        return;
      }

      folder = folder.replace(__dirname,"")
      folder = folder.replace("\\SOUND_AUDIO","")
      const soundFilePath = path.join(folder, soundFile);
      const imageFilePath = path.join(folder, imageFile);
      const fileName = path.basename(soundFile, path.extname(soundFile));

      const sound = new Sound({
        name: fileName,
        filePath: soundFilePath.replace(__dirname, ''), // Make filePath relative to project root
        imagePath: imageFilePath.replace(__dirname, ''), // Make imagePath relative to project root
        // Optionally include description and tags if needed
      });

      return sound.save();
    });

    await Promise.all(soundPromises);

    console.log('All sounds have been added to the database.');
    mongoose.disconnect(); // Close the connection
  } catch (error) {
    console.error('Error adding sounds:', error);
    mongoose.disconnect(); // Ensure connection is closed in case of error
  }
};



addSounds();
