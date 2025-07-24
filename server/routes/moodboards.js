const express = require('express');
const router = express.Router();
const Moodboard = require('../models/Moodboard');
const requireAuth = require('../middleware/authMiddleware');

// Save moodboard
router.post('/', requireAuth, async (req, res) => {
  try {
    const newMoodboard = new Moodboard({
      user: req.user.id,
      ...req.body
    });
    const saved = await newMoodboard.save();
    res.json(saved);
  } catch (err) {
    console.error("❌ Save Moodboard Error:", err.message);
    res.status(500).json({ error: 'Failed to save moodboard' });
  }
});

// Get user's moodboards
router.get('/', requireAuth, async (req, res) => {
  try {
    const moodboards = await Moodboard.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(moodboards);
  } catch (err) {
    console.error("❌ Fetch Moodboards Error:", err.message);
    res.status(500).json({ error: 'Failed to fetch moodboards' });
  }
});

module.exports = router;
