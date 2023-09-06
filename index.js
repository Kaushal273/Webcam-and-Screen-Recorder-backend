
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://127.0.0.1:27017/recorder', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const VideoSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
});

const VideoModel = mongoose.model('Video', VideoSchema);

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create a POST route to handle video uploads
app.post('/api/upload', upload.single('video'), async (req, res) => {
  try {
    const { originalname, buffer } = req.file;

    // Save video data to MongoDB
    const newVideo = new VideoModel({
      title: originalname,
      videoUrl: `data:video/webm;base64,${buffer.toString('base64')}`,
    });

    await newVideo.save();

    res.status(201).json({ message: 'Video uploaded successfully' });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT =5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
