const express = require('express');
const router = express.Router();
const { generateImages } = require('../services/replicateService');

router.post('/', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Missing prompt." });

  try {
    const images = await generateImages(prompt, 3);
    res.json({ image: images });
  } catch (err) {
    console.error("❌ Image Gen Error:", err.message);
    res.status(500).json({ error: "Image generation failed." });
  }
});

module.exports = router;
