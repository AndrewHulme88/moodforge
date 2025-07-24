const express = require('express');
const router = express.Router();
const { generateColorPalette } = require('../services/openaiService');
const requireAuth = require('../middleware/authMiddleware');

//router.post('/generate', requireAuth, async (req, res) => {
router.post("/", async (req, res) => {
  const { description } = req.body;
  if (!description) return res.status(400).json({ error: "Missing description." });

  try {
    const colors = await generateColorPalette(description);
    res.json({ colors });
  } catch (err) {
    console.error("❌ Color Gen Error:", err.message);
    res.status(500).json({ error: "Failed to generate color theme." });
  }
});

module.exports = router;
