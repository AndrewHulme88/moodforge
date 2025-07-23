const express = require('express');
const router = express.Router();
const { generateSceneDescription } = require('../services/openaiService');

router.post('/', async (req, res) => {
  const { theme, genre, tone } = req.body;
  if (!theme || !genre || !tone) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const description = await generateSceneDescription(theme, genre, tone);
    if (!description) throw new Error("No description returned");
    res.json({ description });
  } catch (error) {
    console.error("❌ Text Gen Error:", error.message);
    res.status(500).json({ error: "Failed to generate mood text." });
  }
});

module.exports = router;
