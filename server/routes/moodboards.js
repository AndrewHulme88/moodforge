const express = require('express');
const router = express.Router();
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const streamifier = require('streamifier');

const requireAuth = require('../middleware/authMiddleware');
const Moodboard = require('../models/Moodboard');
const cloudinary = require('../config/cloudinary');

// Create new moodboard
router.post('/', requireAuth, async (req, res) => {
  try {
    const { theme, genre, tone, description, openaiImageUrl, colors } = req.body;

    // Download the image from OpenAI's URL
    const imageRes = await axios.get(openaiImageUrl, { responseType: 'arraybuffer' });

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          public_id: `moodforge/${uuidv4()}`,
          resource_type: 'image',
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
      streamifier.createReadStream(imageRes.data).pipe(stream);
    });

    // Create and save moodboard with Cloudinary URL
    const newBoard = new Moodboard({
      theme,
      genre,
      tone,
      description,
      imageUrl: result.secure_url,
      colors,
      user: req.userId,
    });

    await newBoard.save();
    res.status(201).json(newBoard);
  } catch (err) {
    console.error('❌ Save moodboard error:', err.message);
    res.status(500).json({ error: 'Failed to save moodboard.' });
  }
});

// Get all moodboards for logged-in user
router.get('/', requireAuth, async (req, res) => {
  try {
    const moodboards = await Moodboard.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(moodboards);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load moodboards' });
  }
});

module.exports = router;
