const Sound = require('../models/Sound');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const SOUND_AUDIO_PATH = path.join(__dirname, '..', 'SOUND_AUDIO');

exports.getAllSounds = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const sounds = await Sound.find().limit(limit);
    res.status(200).json({ sounds });
  } catch (error) {
    console.error('Error fetching sounds:', error);
    res.status(500).json({ error: 'Error fetching sounds' });
  }
};

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50 MB limit for each file
  }
});

const saveFiles = (folderName, mp3Buffer, mp3Name, imageBuffer, imageName) => {
  const folderPath = path.join(SOUND_AUDIO_PATH, folderName);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const mp3Path = path.join(folderPath, mp3Name);
  fs.writeFileSync(mp3Path, mp3Buffer);

  const imagePath = path.join(folderPath, imageName);
  fs.writeFileSync(imagePath, imageBuffer);

  return {
    filePath: path.relative(SOUND_AUDIO_PATH, mp3Path),
    imagePath: path.relative(SOUND_AUDIO_PATH, imagePath)
  };
};

exports.addSounds = async (req, res) => {
  try {
    upload.fields([{ name: 'mp3' }, { name: 'image' }])(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error uploading files', error: err });
      }

      const mp3File = req.files['mp3'][0];
      const imageFile = req.files['image'][0];

      if (!mp3File || !imageFile) {
        return res.status(400).json({ message: 'Both MP3 and image files are required.' });
      }

      const mp3Name = mp3File.originalname;
      const imageName = imageFile.originalname;
      const folderName = `${path.parse(mp3Name).name}_${path.parse(imageName).name}`;

      const { filePath, imagePath } = saveFiles(folderName, mp3File.buffer, mp3Name, imageFile.buffer, imageName);

      const sound = new Sound({
        name: path.parse(mp3Name).name,
        filePath: "\\" + filePath,
        imagePath: "\\" + imagePath,
        description: req.body.description || '',
        tags: req.body.tags || []
      });

      await sound.save();

      res.status(200).json({ message: 'Files uploaded and saved successfully!', sound });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteSound = async (req, res) => {
  const soundId = req.params.id;

  try {
      // Find the sound in the database
      const sound = await Sound.findById(soundId);

      if (!sound) {
          return res.status(404).json({ message: 'Sound not found' });
      }

      // Construct the full paths for the files
      const mp3FullPath = path.join(SOUND_AUDIO_PATH, sound.filePath);
      const imageFullPath = path.join(SOUND_AUDIO_PATH, sound.imagePath);

      // Delete the MP3 file
      if (fs.existsSync(mp3FullPath)) {
          fs.unlinkSync(mp3FullPath);
      }

      // Delete the image file
      if (fs.existsSync(imageFullPath)) {
          fs.unlinkSync(imageFullPath);
      }

      // Get the folder path
      const folderPath = path.dirname(mp3FullPath);

      // Remove the sound from the database
      await Sound.findByIdAndDelete(soundId);

      // Check if the folder is empty and delete it if it is
      if (fs.existsSync(folderPath)) {
          const files = fs.readdirSync(folderPath);
          if (files.length === 0) {
              fs.rmdirSync(folderPath);
          }
      }

      res.status(200).json({ message: 'Sound deleted successfully' });
  } catch (error) {
      console.error('Error deleting sound:', error);
      res.status(500).json({ message: 'Error deleting sound', error: error.message });
  }
};