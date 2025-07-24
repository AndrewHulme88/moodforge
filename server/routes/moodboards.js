const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/authMiddleware');
const Moodboard = require('../models/Moodboard');

// Create new moodboard
router.post('/', requireAuth, async (req, res) => {
  try {
    const newBoard = new Moodboard({
      ...req.body,
      user: req.userId, // This is critical
    });

    await newBoard.save();
    res.status(201).json(newBoard);
  } catch (err) {
    console.error("Save moodboard error:", err.message);
    res.status(500).json({ error: "Failed to save moodboard." });
  }
});

// Get all moodboards for logged-in user
router.get('/', requireAuth, async (req, res) => {
  try {
    const moodboards = await Moodboard.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(moodboards);
  } catch (err) {
    res.status(500).json({ error: "Failed to load moodboards" });
  }
});

module.exports = router;
