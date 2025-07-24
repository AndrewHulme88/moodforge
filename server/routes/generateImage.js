const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");
const requireAuth = require("../middleware/authMiddleware");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/", requireAuth, async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
    });

    const image = response.data[0]?.url;
    if (!image) throw new Error("No image returned");

    console.log("✅ OpenAI image URL:", image);
    res.json({ image });
  } catch (err) {
    console.error("❌ OpenAI Image Gen Error:", err.message);
    res.status(500).json({ error: "Image generation failed." });
  }
});

module.exports = router;
